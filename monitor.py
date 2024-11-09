from fastapi import Depends, FastAPI, File, Form, HTTPException, status, UploadFile
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, RedirectResponse

import os.path

from bcrypt import checkpw
from datetime import datetime, timedelta
from json import dumps, loads
from re import search
from typing import Annotated, List, Optional
from uuid import uuid4

from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")

security = HTTPBasic()


def setup_service():
    SCOPES = ["https://www.googleapis.com/auth/documents.readonly"]

    google_token_file = "announcements/token.json"
    google_creds_file = "announcements/credentials.json"

    creds = None
    if os.path.exists(google_token_file):
        creds = Credentials.from_authorized_user_file(google_token_file, SCOPES)

    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            if not os.path.exists(google_creds_file):
                print(
                    "You must obtain a credentials.json file from Google Cloud Platform to use the Google Docs API to fetch announcements. "
                    "None was found in the announcements/ directory."
                )
                return None

            flow = InstalledAppFlow.from_client_secrets_file(google_creds_file, SCOPES)
            creds = flow.run_local_server(port=0)

        with open(google_token_file, "w") as token:
            token.write(creds.to_json())

    return build("docs", "v1", credentials=creds)


def update_announcements():
    # Announcements service not available
    if not ann_state["service"]:
        return ["Failed to connect to Google Docs API"]

    now = datetime.now()

    if not ann_state["last_update"]:
        ann_state["last_update"] = now - timedelta(minutes=10)

    if now - ann_state["last_update"] < timedelta(minutes=5):
        return ann_state["announcements"]

    print("Querying Google Docs API for latest announcements")

    ANNOUNCEMENTS_DOC_ID = "15bhSjMZYsuS6XkGMgsXq2I5qZchHRfrtQEQ_X6kqYrg"

    document = (
        ann_state["service"].documents().get(documentId=ANNOUNCEMENTS_DOC_ID).execute()
    )

    announcements = []

    paragraphs = [
        block.get("paragraph") for block in document.get("body").get("content")
    ]

    for paragraph in paragraphs:
        if not paragraph:
            continue

        for element in paragraph.get("elements"):
            if text := element.get("textRun"):
                announcements.append(text.get("content").strip())

    # Remove Nones
    ann_state["announcements"] = [
        announcement for announcement in announcements if announcement
    ]

    ann_state["last_update"] = now

    return ann_state["announcements"]


# Initialize announcements state
ann_state = {"service": setup_service(), "last_update": None, "announcements": []}

hashed_password = ""
with open("config/monitor_password.txt") as f:
    hashed_password = f.read().strip().encode()


def redirect(path):
    return RedirectResponse(path, status_code=301)


@app.get("/")
async def index():
    return FileResponse("monitor.html")


@app.get("/announcements")
async def announcements():
    return update_announcements()


@app.get("/setup")
async def setup_endpoint():
    return FileResponse("pi/client_setup")


# Poor makeshift solution for the unrecoverable Pis.
@app.get("/monitor.html")
async def config_redirect():
    return redirect("/")


def authorization(
    credentials: Annotated[HTTPBasicCredentials, Depends(security)],
):
    is_correct_username = credentials.username == "oboro"

    guess_password = credentials.password.encode()
    is_correct_password = checkpw(guess_password, hashed_password)

    if not (is_correct_username and is_correct_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="IP out of whitelisted range",
            headers={"WWW-Authenticate": "Basic"},
        )

    return True


@app.get("/update")
async def monitor_update(authorized: Annotated[bool, Depends(authorization)]):
    return FileResponse("monitor_update.html")


# Should parse the following formats, at least
# - https://youtube.com/watch?v=o-YBDTqX_ZU
# - https://youtube.com/watch?v=o-YBDTqX_ZU&foo=bar&bar=baz
# - https://www.youtube.com/watch?v=o-YBDTqX_ZU?foo=bar&bar=baz
# - https://youtu.be/o-YBDTqX_ZU?si=pLeuVDoJjradBVeA
# Returns the id of the video
def parse_yt_video(youtube_url):
    r = search(
        r"^https?://(?:www\.)?youtube\.com/watch\?v=([a-zA-Z0-9_-]{11})", youtube_url
    )

    # .group(0) is the entire regex match, but we want 1: our ID group
    if r:
        return r.group(1)

    r = search(r"^https?://(?:www\.)?youtu\.be/([a-zA-Z0-9_-]{11})", youtube_url)
    if r:
        return r.group(1)

    return None


# Parse the following format
# https://www.youtube.com/playlist?list=PLhN2KFLfxLBROc8wknPrb6_rCH-E7e383
# Returns the id of the playlist
def parse_yt_playlist(youtube_url):
    r = search(
        r"^https?://(?:www\.)?youtube\.com/playlist\?list=([a-zA-Z0-9_-]{34})",
        youtube_url,
    )

    if r:
        return r.group(1)

    return None


def get_monitor_config():
    with open("config/monitor.json") as f:
        return loads(f.read())


def set_monitor_config(
    monitor_config, authorized: Annotated[bool, Depends(authorization)]
):
    with open("config/monitor.json", "w") as f:
        f.write(dumps(monitor_config))


# These files should already have been validated
async def save_images(image_files):
    filenames = []

    for file in image_files:
        filename = f"user-{uuid4()}"
        filenames.append(filename)

        path = "static/img/monitor/" + filename
        content = await file.read()
        with open(path, "wb") as f:
            f.write(content)

    return filenames


@app.post("/api/update")
async def monitor_api_update(
    authorized: Annotated[bool, Depends(authorization)],
    section: str = Form(...),
    type: str = Form(...),
    image_files: List[UploadFile] = File(None),
    image_interval: Optional[float] = Form(None),
    youtube_url: Optional[str] = Form(None),
):
    section = {
        "a": "main",
        "b": "footer",
        "c": "sidebar",
    }.get(section)

    if not section:
        raise HTTPException(status_code=400, detail="Invalid section")

    if type not in [
        "image_cycle",
        "youtube_video",
        "youtube_playlist",
        "announcements",
        "info",
    ]:
        raise HTTPException(status_code=400, detail="Invalid section type")

    monitor_config = get_monitor_config()
    display = {"type": type}

    if type == "image_cycle":
        if image_interval is None or image_interval < 0.5:
            raise HTTPException(
                status_code=400, detail="Image interval should be >= 0.5 seconds"
            )

        if not image_files:
            raise HTTPException(
                status_code=400,
                detail="Image cycle type requires at least one image file",
            )

        for file in image_files:
            if not file.filename:
                raise HTTPException(
                    status_code=400,
                    detail="Image cycle type requires valid image files",
                )

            if not file.content_type.startswith("image/"):
                raise HTTPException(
                    status_code=400, detail="Image cycle type only accepts image files"
                )

        filenames = await save_images(image_files)
        display.update(
            {
                "images": filenames,
                "image_interval": image_interval,
            }
        )

    elif type == "youtube_video":
        if not youtube_url:
            raise HTTPException(status_code=400, detail="No video URL provided")

        video_id = parse_yt_video(youtube_url)
        if not video_id:
            raise HTTPException(
                status_code=400, detail="Invalid YouTube URL format provided"
            )

        display.update({"resource_id": video_id})

    elif type == "youtube_playlist":
        if not youtube_url:
            raise HTTPException(status_code=400, detail="No playlist URL provided")

        playlist_id = parse_yt_playlist(youtube_url)
        if not playlist_id:
            raise HTTPException(
                status_code=400, detail="Invalid playlist URL format provided"
            )

        display.update({"resource_id": playlist_id})

    # (For 'announcements' and 'info' types, no additional data is needed)

    monitor_config[section] = display
    set_monitor_config(monitor_config, authorized)
    return redirect("/update")


@app.get("/config")
async def config():
    return get_monitor_config()

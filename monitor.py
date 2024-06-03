from fastapi import Depends, FastAPI, File, Form, HTTPException, status, UploadFile
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, RedirectResponse

from bcrypt import checkpw
from json import dumps, loads
from re import search
from typing import Annotated, List, Optional
from uuid import uuid4

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")

security = HTTPBasic()


hashed_password = ""
with open("config/monitor_password.txt") as f:
    hashed_password = f.read().strip().encode()


def redirect(path):
    return RedirectResponse(path, status_code=301)


@app.get("/")
async def index():
    return FileResponse("monitor.html")


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
# https://youtube.com/watch?v=o-YBDTqX_ZU
# https://youtube.com/watch?v=o-YBDTqX_ZU&foo=bar&bar=baz
# https://www.youtube.com/watch?v=o-YBDTqX_ZU?foo=bar&bar=baz
# https://youtu.be/o-YBDTqX_ZU?si=pLeuVDoJjradBVeA
# Returns the id of the video
def parse_yt_video(youtube_url):
    r = search(
        "^https?://(www\\.)?youtube\\.com/watch\\?v=[a-zA-Z0-9_-]{11}", youtube_url
    )
    if not r:
        r = search("^https?://(www\\.)?youtu\\.be/[a-zA-Z0-9_-]{11}", youtube_url)

    if not r:
        return None

    return r.group(0)[-11:]


# Parse the following format
# https://www.youtube.com/playlist?list=PLhN2KFLfxLBROc8wknPrb6_rCH-E7e383
# Returns the id of the playlist
def parse_yt_playlist(youtube_url):
    r = search(
        "^https?://(www\\.)?youtube\\.com/playlist\\?list=[a-zA-Z0-9_-]{34}",
        youtube_url,
    )

    if not r:
        return None

    return r.group(0)[-34:]


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
    image_files: List[UploadFile] = File(...),
    image_interval: float = Form(...),
    youtube_url: Optional[str] = Form(None),
):
    section = {
        "a": "main",
        "b": "footer",
        "c": "sidebar",
    }.get(section)

    monitor_config = get_monitor_config()

    if not section:
        return "Invalid section"

    if type not in ["image_cycle", "youtube_video", "youtube_playlist"]:
        return "Invalid section type"

    display = {"type": type}

    if type == "image_cycle":
        if image_interval < 0.5:
            return "Image interval should be >= 0.5 seconds"

        for file in image_files:
            if not file.filename:
                return "image cycle type requires at least one image file"

            if not file.content_type.startswith("image/"):
                return "image cycle type only accepts image files"

        filenames = await save_images(image_files)
        display.update(
            {
                "images": filenames,
                "image_interval": image_interval,
            }
        )

    elif type == "youtube_video":
        if not youtube_url:
            return "No video URL provided"

        id = parse_yt_video(youtube_url)
        if not id:
            return "Invalid YouTube URL format provided"

        display.update({"resource_id": id})

    elif type == "youtube_playlist":
        if not youtube_url:
            return "No playlist URL provided"

        id = parse_yt_playlist(youtube_url)
        if not id:
            return "Invalid playlist URL format provided"

        display.update({"resource_id": id})

    monitor_config[section] = display
    set_monitor_config(monitor_config, authorized)
    return redirect("/update")


@app.get("/config")
async def config():
    return get_monitor_config()

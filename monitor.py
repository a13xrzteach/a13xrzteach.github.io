from fastapi import FastAPI, File, Form, UploadFile
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from typing import List, Optional

app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")


@app.get("/")
async def index():
    return FileResponse("monitor.html")


# Poor makeshift solution for the unrecoverable Pis.
@app.get("/monitor.html")
async def config_redirect():
    return FileResponse("monitor.html")


@app.get("/update")
async def monitor_update():
    return FileResponse("monitor_update.html")


def parse_youtube_id(youtube_url):
    return "o-YBDTqX_ZU"


@app.post("/api/update")
async def monitor_api_update(
    section: str = Form(...),
    type: str = Form(...),
    image_files: List[UploadFile] = File(...),
    youtube_url: Optional[str] = Form(None),
):
    if section not in ["a", "b", "c"]:
        return "Invalid section"

    if type not in ["image_cycle", "youtube"]:
        return "Invalid section type"

    if type == "image_cycle":
        for file in image_files:
            if not file.filename:
                return "image cycle type requires at least one image file"

            if not file.content_type.startswith("image/"):
                return "image cycle type only accepts image files"

        return "ok image_cycle"

    if not youtube_url:
        return "No YouTube URL provided"

    id = parse_youtube_id(youtube_url)
    if not id:
        return "Invalid YouTube URL format provided"

    return "ok youtube"


@app.get("/config")
async def config():
    return FileResponse("config/monitor.js")

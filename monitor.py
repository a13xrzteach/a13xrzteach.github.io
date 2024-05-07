from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")


@app.get("/")
async def index():
    return FileResponse("monitor.html")


@app.get("/update")
async def monitor_update():
    return FileResponse("monitor_update.html")


@app.get("/config")
async def config():
    return FileResponse("config/monitor.js")

# https://developers.google.com/docs/api/quickstart/python

# GCP Project name: APAlpha
# GCP Project number: 120642416673

from json import dumps
import os.path

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build

SCOPES = ["https://www.googleapis.com/auth/documents.readonly"]
ANNOUNCEMENTS_DOC_ID = "15bhSjMZYsuS6XkGMgsXq2I5qZchHRfrtQEQ_X6kqYrg"


creds = None
if os.path.exists("token.json"):
    creds = Credentials.from_authorized_user_file("token.json", SCOPES)

if not creds or not creds.valid:
    if creds and creds.expired and creds.refresh_token:
        creds.refresh(Request())
    else:
        flow = InstalledAppFlow.from_client_secrets_file("credentials.json", SCOPES)
        creds = flow.run_local_server(port=0)

    with open("token.json", "w") as token:
        token.write(creds.to_json())

service = build("docs", "v1", credentials=creds)
document = service.documents().get(documentId=ANNOUNCEMENTS_DOC_ID).execute()

announcements = []

paragraphs = [block.get("paragraph") for block in document.get("body").get("content")]
for paragraph in paragraphs:
    if not paragraph:
        continue

    for element in paragraph.get("elements"):
        if text := element.get("textRun"):
            announcements.append(text.get("content").strip())

announcements = [announcement for announcement in announcements if announcement]
print(announcements)

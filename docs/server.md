# Pi Monitor System Server Documentation

## Introduction

The server component of the **Pi Monitor System** is a FastAPI application
defined in `monitor.py`. It serves as the backend that manages content,
configurations, and integrations with external services. This document provides
an in-depth explanation of `monitor.py`, the available API routes, and how the
frontend interacts with these routes.

## Table of Contents

- [Overview](#overview)
- [Server Functionality](#server-functionality)
  - [Announcements Integration](#announcements-integration)
  - [Authentication](#authentication)
  - [Configuration Management](#configuration-management)
- [API Routes](#api-routes)
  - [Public Routes](#public-routes)
    - [`GET /`](#get-)
    - [`GET /announcements`](#get-announcements)
    - [`GET /config`](#get-config)
    - [`GET /setup`](#get-setup)
  - [Authenticated Routes](#authenticated-routes)
    - [`GET /update`](#get-update)
    - [`POST /api/update`](#post-apiupdate)
  - [Redirects](#redirects)
    - [`GET /monitor.html`](#get-monitorhtml)
- [Internal Functions](#internal-functions)
  - [`setup_service()`](#setup_service)
  - [`update_announcements()`](#update_announcements)
  - [`parse_yt_video()`](#parse_yt_video)
  - [`parse_yt_playlist()`](#parse_yt_playlist)
- [Frontend Interaction](#frontend-interaction)
- [Conclusion](#conclusion)

## Overview

The server handles several key responsibilities:

- Serving the main monitor interface to clients.
- Providing an API for clients to fetch configurations and announcements.
- Offering a web-based GUI for administrators to update monitor configurations.
- Integrating with Google Docs to fetch the latest announcements.
- Managing authentication for secure access to administrative functions.

## Server Functionality

### Announcements Integration

The server integrates with Google Docs to fetch the latest announcements. The
announcements are submitted by school staff via a Google Form, stored in a
Google Sheet, and then processed into a Google Doc by a Google Apps Script
(`controller.js`). The server uses the Google Docs API to fetch the content of
the document.

- **Function:** `update_announcements()`
  - Fetches announcements from the specified Google Doc.
  - Caches announcements to minimize API calls (updates every 5 minutes).
- **Usage Scenario:** When a client requests `/announcements`, the server
returns the latest announcements.

### Authentication

Authentication is required for administrative routes to prevent unauthorized
access. The server uses HTTP Basic Authentication with a single admin user.

- **Username:** `oboro`
- **Password Hash:** Stored in `config/monitor_password.txt` (bcrypt-hashed).
- **Function:** `authorization()`
  - Verifies credentials against stored username and password hash.
- **Protected Routes:**
  - `GET /update`
  - `POST /api/update`

### Configuration Management

Monitor configurations determine what content is displayed on the monitors. The
configurations are stored in `config/monitor.json` and can be updated via the
administrative GUI.

- **Functions:**
  - `get_monitor_config()`: Reads the current configuration.
  - `set_monitor_config()`: Writes new configurations to the file.
- **Usage Scenario:** Clients fetch the configuration via `/config` to determine
what content to display.

## API Routes

### Public Routes

#### `GET /`

- **Description:** Serves the main monitor HTML page (`monitor.html`).
- **Function:** `index()`
- **Response:** Returns `monitor.html`.
- **Frontend Interaction:** Clients (Raspberry Pis) load this page to display
the monitor interface.

#### `GET /announcements`

- **Description:** Provides the latest announcements as a JSON array.
- **Function:** `announcements()`
- **Response:** JSON array of announcements.
- **Frontend Interaction:** The frontend JavaScript fetches announcements to
display in the announcements section.

#### `GET /config`

- **Description:** Returns the current monitor configuration in JSON format.
- **Function:** `config()`
- **Response:** JSON object containing configurations for different sections
(main, footer, sidebar).
- **Frontend Interaction:** The frontend fetches this configuration to determine
what content to display and how.

#### `GET /setup`

- **Description:** Serves the client setup script (`pi/client_setup`).
- **Function:** `index()`
- **Response:** Returns `pi/client_setup` script.
- **Usage Scenario:** Used during the initial setup of Raspberry Pi clients.

### Authenticated Routes

#### `GET /update`

- **Description:** Serves the monitor update GUI (`monitor_update.html`).
- **Function:** `monitor_update(authorized)`
- **Response:** Returns `monitor_update.html`.
- **Authentication:** Requires valid credentials.
- **Frontend Interaction:** Administrators use this GUI to update monitor
configurations without editing JSON files directly.

#### `POST /api/update`

- **Description:** Processes updates to the monitor configuration submitted via
the update GUI.
- **Function:** `monitor_api_update(authorized, ...)`
- **Request Parameters:**
  - `section`: Section of the monitor to update (`a` for main, `b` for footer,
`c` for sidebar).
  - `type`: Type of content (`image_cycle`, `youtube_video`, `youtube_playlist`,
`announcements`, `info`).
  - Additional parameters depending on `type` (e.g., image files, YouTube URLs).
- **Response:** Redirects back to `/update`.
- **Authentication:** Requires valid credentials.
- **Frontend Interaction:** The update form submits data to this endpoint to
change the monitor configuration.

### Redirects

#### `GET /monitor.html`

- **Description:** Redirects to `/`.
- **Function:** `config_redirect()`
- **Response:** Redirects to `/`.
- **Usage Scenario:** Legacy support or misdirected requests.

## Internal Functions

### `setup_service()`

- **Purpose:** Initializes the Google Docs API client for fetching
announcements.
- **Mechanism:**
  - Checks for existing credentials in `announcements/token.json`.
  - If not valid, initiates OAuth flow to obtain new credentials.
- **Usage:** Called once at server startup to set up the Google Docs service
client.

### `update_announcements()`

- **Purpose:** Fetches and caches the latest announcements from the Google Doc.
- **Mechanism:**
  - Checks if announcements were updated within the last 5 minutes.
  - If not, fetches content from the Google Doc.
  - Parses the document to extract announcements.
- **Usage:** Used by the `/announcements` route to provide up-to-date
announcements.

### `parse_yt_video()`

- **Purpose:** Extracts the YouTube video ID from a given URL.
- **Input:** YouTube video URL.
- **Output:** Video ID string or `None` if invalid.
- **Usage:** Used in the `/api/update` route when processing a YouTube video
submission.

### `parse_yt_playlist()`

- **Purpose:** Extracts the YouTube playlist ID from a given URL.
- **Input:** YouTube playlist URL.
- **Output:** Playlist ID string or `None` if invalid.
- **Usage:** Used in the `/api/update` route when processing a YouTube playlist
submission.

## Frontend Interaction

### Monitor Interface (`monitor.html`)

- **Description:** The main page displayed on the monitors.
- **JavaScript:** `static/js/monitor.js` (compiled from `monitor.ts`).
- **Interaction Flow:**
  1. **Load Page:** The client loads `/`, which serves `monitor.html`.
  2. **Fetch Configuration:** The JavaScript code sends a `GET /config` request
to obtain the current monitor configuration.

  3. **Initialize Sections:** Based on the configuration, the script initializes
different sections (main, footer, sidebar) with appropriate content types.
     - **Image Cycle:** Fetches images from the server's static directory.
     - **YouTube Content:** Uses YouTube IFrame API to embed videos or playlists.
     - **Announcements:** Sends `GET /announcements` to fetch announcements.
     - **Info Display:** Fetches weather data from Open-Meteo API.

- **Example Scenario:** If the main section is configured to display
announcements, the script will fetch announcements and display them in a loop.

### Monitor Update GUI (`monitor_update.html`)

- **Description:** A web interface for administrators to update monitor
configurations.

- **JavaScript:** `static/js/monitor_update.js`.
- **Interaction Flow:**
  1. **Access Page:** Administrator navigates to `/update` and authenticates.

  2. **View Current Configuration:** The GUI displays the current configuration
by fetching data from `/config`.

  3. **Update Configuration:** Administrator selects a section and content type,
fills in required fields, and submits the form.

  4. **Form Submission:** The form data is sent via `POST /api/update`.

  5. **Server Processing:** The server validates input, updates
`config/monitor.json`, and handles file uploads if necessary.

  6. **Feedback:** The administrator is redirected back to the update page.

### Client Setup Script (`pi/client_setup`)

- **Description:** Automates the setup process for Raspberry Pi clients.
- **Access:** Clients fetch the script via `GET /setup`.
- **Execution Flow:**
  1. **Download and Execute Script:** The client runs the script, which performs
system updates and installs necessary packages.

  2. **Clone Repository:** The script clones the GitHub repository to the
client's machine.

  3. **Configure Autostart:** Sets up the `startup` script to run on boot.
  4. **Reboot:** The client reboots to apply changes.

- **Usage Scenario:** Used when setting up new Raspberry Pis to act as clients.

## Conclusion

The `monitor.py` server application is the backbone of the Pi Monitor System,
providing essential services to both clients and administrators. It handles
content delivery, configuration management, authentication, and integration with
external APIs. Understanding the available routes and how the frontend interacts
with them is crucial for extending the system, and helpful for any sort of
maintenance.

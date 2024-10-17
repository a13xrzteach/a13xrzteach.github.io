# Pi Monitor System for School Information Display

Welcome to the **Pi Monitor System** repository! This project is designed to
facilitate the display of school-related information on monitors installed
throughout the school using Raspberry Pis. It provides an easy way to configure
and manage the content displayed, ensuring that important announcements and
updates are readily accessible to students and staff.

(The repository is named "a13xrzteach.github.io" for historic reasons; the live
GitHub pages site, reading `./index.html`, is mostly unused.)

## Table of Contents

- [Overview](#overview)
- [Key Components](#key-components)
- [Features](#features)
- [Documentation](#documentation)
- [Project Structure](#project-structure)
- [Contact](#contact)

## Overview

The Pi Monitor System leverages Raspberry Pis connected to monitors to display
dynamic content such as announcements, informational messages, and multimedia.
The system consists of a FastAPI backend server that manages configurations and
content, and client scripts running on the Raspberry Pis to display the content
on the monitors.

### Key Components:

- **Server**: A FastAPI application that serves content and configurations to
the clients.

- **Clients**: Raspberry Pis running scripts that fetch content from the server
and display it on connected monitors.

- **Content Management**: A GUI for updating monitor configurations without
directly editing configuration files.

- **Announcements Integration**: Automated fetching of announcements from Google
Docs, populated via a Google Form.

## Features

- **Easy Configuration**: Modify monitor displays through a user-friendly GUI.

- **Automated Content Updates**: Clients automatically pull the latest content
and updates from the server.

- **Announcements Display**: Fetch and display announcements submitted via a
Google Form.

- **Support for Multimedia**: Display images, YouTube videos, and playlists.

- **Minimal Maintenance**: Designed to operate with minimal intervention after
initial setup.

## Documentation

For detailed information on setup, configuration, and operation, refer to the
following documents:

- [Setup Guide](docs/setup.md): Instructions for configuring new Raspberry Pis,
launching the server and client locally, and understanding the client scripts.

- [System Overview](docs/overview.md): Detailed explanation of data flow and how
clients interact with the server.

- [Server Documentation](docs/server.md): Details about the FastAPI backend,
including endpoints and configuration management.

- [Frontend Documentation](docs/frontend.md): Information about the frontend
functionality and how the monitors display content.

## Project Structure

```
a13xrzteach.github.io/
├── announcements/       # Scripts and credentials for announcements integration
├── config/              # Configuration files for the monitor system
├── docs/                # ~Detailed documentation files
├── pi/                  # Scripts and files specific to Raspberry Pi setup
├── static/              # Static assets (CSS, JS, images, audio)
├── monitor.py           # FastAPI server application
└── requirements.txt     # Python dependencies
```

## Contact

For questions, assistance, or feedback, please reach out through the CS Club
Discord server. You can contact Michael (the original developer; might take long
to respond) and/or the current maintainers.

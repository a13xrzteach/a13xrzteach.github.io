# Pi Monitor System Setup Guide

## Introduction

This setup guide provides detailed instructions for installing, configuring, and
running the **Pi Monitor System**. The system consists of a server application
and client scripts running on Raspberry Pis connected to monitors. This document
covers the prerequisites, installation steps, and maintenance procedures for
both the server and clients.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Server Setup](#server-setup)
  - [Dependencies](#dependencies)
  - [Installation Steps](#installation-steps)
  - [Starting the Server](#starting-the-server)
- [Client Setup](#client-setup)
  - [Running the Client on a Raspberry Pi](#running-the-client-on-a-raspberry-pi)
  - [Running the Client Locally for Development](#running-the-client-locally-for-development)
- [Auto-Update Mechanism](#auto-update-mechanism)
- [Maintenance](#maintenance)
  - [Updating the Server](#updating-the-server)
  - [Updating the Clients](#updating-the-clients)
  - [Troubleshooting](#troubleshooting)
- [Security Considerations](#security-considerations)
- [Contact](#contact)

## Prerequisites

### Server Requirements

- **Operating System:**
  - **Recommended:** Linux (e.g., Arch Linux, Ubuntu)
  - **Alternative:** macOS (functionality may vary; Linux is preferred)
- **Python 3:** Version 3.7 or higher
- **Internet Access:** For fetching announcements and accessing external APIs
- **Google API Credentials:**
  - `announcements/credentials.json` file with valid credentials to access the
Google Docs API
  - **Note:** Contact **Mr. Rozenberg** to obtain access to the
`credentials.json` file; his account owns the Google Cloud Platform project
associated with this system.

### Client Requirements

- **For Raspberry Pi Deployment:**
  - **Hardware:** Raspberry Pi, with some screen connected
  - **Operating System:** Raspberry Pi OS (formerly Raspbian)
  - **Internet Access:** Internal network access to the server
  - **Physical Access:** For initial setup and troubleshooting

- **For Local Development and Debugging:**
  - **Operating System:**
    - Linux (preferred)
    - macOS (possible, but not extensively tested)
  - **Browser:** Chromium or Google Chrome
  - **Internet Access:** Access to the server (can be running locally)

## Server Setup

Such a setup has already been performed, and the server is running in Room 203
on the Arch Linux desktop there. But you may wish to reconfigure it, or deploy
to a new server.

### Dependencies

Install the following packages on the server:

- **Python Packages:**
  - FastAPI
  - Uvicorn
  - Bcrypt
  - Google API Client
  - Refer to `requirements.txt` for the full list

- **System Packages:**
  - `git`
  - `jq`
  - `python3-virtualenv` or `python-virtualenv`

- **Optional:**
  - `kakoune` (text editor)

### Installation Steps

1. **Clone the Repository:**
   ```sh
   mkdir ~/src
   cd ~/src
   git clone https://github.com/a13xrzteach/a13xrzteach.github.io/
   cd a13xrzteach.github.io
   ```

2. **Configure Google API Credentials:**
   - Obtain the `credentials.json` file from Google Cloud Platform.
   - Place the file in the `announcements` directory:
     ```sh
     cp /path/to/credentials.json ./announcements/credentials.json
     ```

3. **Disable Power Saving and Screen Locks (if applicable):**
   - Adjust settings in the desktop environment (e.g., KDE) to prevent the
server from sleeping or locking the screen.

### Starting the Server

To start the server application:

1. **Navigate to the Server Directory:**
   ```sh
   cd ~/src/a13xrzteach.github.io/pi
   ```

2. **Run the Server Script:**
   ```sh
   ./server
   ```

   - The script will output the private IP address and port number on which the
server is running.
   - Example output:

     ```
     pi server: Serving /home/oboro/src/a13xrzteach.github.io on port 17860
     pi server: Private IP address: 10.242.207.207
     ```

3. **Keep the Terminal Open:**
   - Leave the terminal window running to keep the server active.

## Client Setup

### Running the Client on a Raspberry Pi

The clients (Raspberry Pis) can be set up automatically using the `client_setup`
script. If you prefer to operate it manually, look at the script for reference
on what to follow.

1. **Access the Setup Script:**
   - If the server is running and accessible, use the following command:

     ```sh
     curl 10.242.207.207:17860/setup | sh
     ```

     Replace `10.242.207.207:17860` with the actual IP address and port of the
server.

   - If the server is not accessible, fetch the script directly from GitHub:

     ```sh
     curl "https://raw.githubusercontent.com/a13xrzteach/a13xrzteach.github.io/main/pi/client_setup" | sh
     ```

2. **Script Execution:**
   - The script will perform the following actions:
     - Update and upgrade system packages.
     - Install required packages (`git`, `chromium`, `kakoune`).
     - Clone the repository into `~/src`.
     - Configure Git settings.
     - Set up the autostart script to run on boot.
     - Reboot the Raspberry Pi.

3. **Post-Reboot Behavior:**
   - Upon reboot, the Raspberry Pi will automatically start the `startup`
script, which manages the client application.

### Running the Client Locally for Development

For development and debugging purposes, you may want to run the client on your
local machine.

**Note:** Do **not** run the `client_setup` script on your local machine. It is
intended only for Raspberry Pis.

#### Steps to Run the Client Locally:

1. **Ensure Dependencies are Installed:**

   - **Linux (Preferred):** Install `git`, `chromium` or `google-chrome`, and
any necessary development tools.
   - **macOS:** Install `git` and `google-chrome`.

2. **Clone the Repository:**
   ```sh
   mkdir ~/src
   cd ~/src
   git clone https://github.com/a13xrzteach/a13xrzteach.github.io/
   cd a13xrzteach.github.io
   ```

3. **Modify the Endpoint (if necessary):**
   - In the `pi/client` script, adjust the `endpoint` variable to point to your
local server or the appropriate address.

     ```sh
     endpoint="http://localhost:17860/"
     ```

4. **Start the Server Locally (if not already running):**
   - Follow the [Server Setup](#server-setup) instructions to start the server
on your local machine.

5. **Run the Client Script Manually:**
   - Instead of using the `client_setup` script, you can run the `client` script
directly:

     ```sh
     cd ~/src/a13xrzteach.github.io/pi
     ./client
     ```

   - This will launch Chromium in kiosk mode pointing to the specified endpoint.

6. **Development Tips:**
   - **Disable Kiosk Mode:**
     - For easier debugging, you might want to disable kiosk mode by removing
the `--kiosk` flag in the `client` script.
   - **Inspect Elements:**
     - Use browser developer tools to inspect elements and debug JavaScript
code.

## Auto-Update Mechanism

- **Client Auto-Updates:**
  - The `client_manager` script ensures that clients automatically pull updates
from the GitHub repository.
  - Clients periodically restart to apply updates and refresh content.

- **Server Updates:**
  - The server does not have an auto-update mechanism.
  - To update the server, pull the latest code and restart the server script.

## Maintenance

### Updating the Server

1. **Pull Latest Changes:**

   ```sh
   cd ~/src/a13xrzteach.github.io
   git pull
   ```

2. **Restart the Server:**

   - Stop the running server process (e.g., by closing the terminal or stopping
the process).
   - Start the server again:

     ```sh
     cd pi
     ./server
     ```

### Updating the Clients

- **Raspberry Pis:**
  - Clients update themselves automatically via the `client_manager` script.
  - No manual intervention is required unless there are issues.

- **Local Development:**
  - Manually pull updates as needed:

    ```sh
    cd ~/src/a13xrzteach.github.io
    git pull
    ```

### Troubleshooting

- **Server Issues:**

  - **Server Not Responding:**
    - Ensure the server script is running.
    - Check network connectivity.
  - **Authentication Problems:**
    - Verify the `config/monitor_password.txt` contains the correct
bcrypt-hashed password.
    - Ensure that credentials are entered correctly when accessing the content
management GUI.

- **Client Issues:**

  - **Display Not Updating:**
    - Check if the Raspberry Pi has network access to the server.
    - Verify that the `client_manager` script is running.
  - **Script Errors:**
    - Access the Raspberry Pi terminal.
    - Check logs or output messages from the scripts.
    - Manually run scripts to observe any errors.

- **Development Environment:**

  - **Local Client Not Displaying Correctly:**
    - Ensure the endpoint in the `client` script points to the correct server
address.
    - Check browser console for JavaScript errors.
  - **Server Running Locally:**
    - Verify that the server is running on your local machine and accessible at
the specified port.

- **General Tips:**

  - **No SSH Access (Raspberry Pi):**
    - Physical access to Raspberry Pis is required for troubleshooting.
    - Consider connecting a keyboard and monitor to access the terminal.
  - **Logs and Output:**
    - Use terminal output for diagnosing issues.
    - Add logging statements to scripts if necessary.

## Security Considerations

- **Internal Network Operation:**
  - The system operates within the school's internal network, reducing exposure
to external threats.

- **Authentication:**
  - The content management GUI uses HTTP Basic Auth with a bcrypt-hashed password.
  - Passwords are currently transmitted over HTTP; consider using HTTPS in the
future if feasible.

- **Physical Access Risks:**
  - Physical access to the server or clients poses a security risk.
  - Ensure that devices are secured to prevent unauthorized access.

- **Password Management:**
  - Use strong, complex passwords for administrative access.
  - Store your hashed password securely in `config/monitor_password.txt`.

## Contact

For assistance or questions, please contact the maintainers through the CS Club
Discord server or visit Room 203.

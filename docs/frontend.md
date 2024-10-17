# Pi Monitor System Frontend Documentation

## Introduction

The frontend of the **Pi Monitor System** consists of HTML pages and JavaScript
code that runs on the clients (Raspberry Pis) and in the administrative GUI.
This document provides an in-depth explanation of `monitor.html` and
`monitor_update.html`, including how the JavaScript manages the DOM through
classes, functions, and event handlers.

## Table of Contents

- [Overview](#overview)
- [Monitor Interface (`monitor.html`)](#monitor-interface-monitorhtml)
  - [Structure](#structure)
  - [JavaScript Components](#javascript-components)
    - [TypeScript Compilation](#typescript-compilation)
    - [Classes and Functions](#classes-and-functions)
    - [Event Handling](#event-handling)
  - [Content Types](#content-types)
    - [Image Cycle](#image-cycle)
    - [YouTube Video/Playlist](#youtube-videoplaylist)
    - [Announcements](#announcements)
    - [Info Display](#info-display)
- [Monitor Update GUI (`monitor_update.html`)](#monitor-update-gui-monitor_updatehtml)
  - [Structure](#structure-1)
  - [JavaScript Components](#javascript-components-1)
    - [Event Handling](#event-handling-1)
  - [Form Submission](#form-submission)

## Overview

The frontend comprises two main interfaces:

1. **Monitor Interface (`monitor.html`):** Displayed on the monitors connected
to Raspberry Pis, showing dynamic content such as images, videos, announcements,
and informational displays.

2. **Monitor Update GUI (`monitor_update.html`):** An administrative interface
for updating monitor configurations via a web form.

Both interfaces rely on JavaScript for dynamic functionality and DOM
manipulation.

## Monitor Interface (`monitor.html`)

### Structure

**HTML File:** `monitor.html`

**Key Elements:**

- `<main id="main"></main>`: Main content area.
- `<footer id="footer"></footer>`: Footer section.
- `<div id="sidebar"></div>`: Sidebar section.

- `<script src="https://www.youtube.com/player_api"></script>`: Loads the
YouTube IFrame API.

- `<script src="/static/js/monitor.js"></script>`: Main JavaScript file for the
monitor.

**CSS File:** `/static/css/monitor.css`

- Defines a grid layout to position the main, footer, and sidebar sections.
- Sets background properties and dimensions for the body and sections.

### JavaScript Components

**Main Script:** `/static/js/monitor.js` (compiled from `/static/js/monitor.ts`)

#### TypeScript Compilation

- **Source File:** `/static/js/monitor.ts`
- **Compiled File:** `/static/js/monitor.js`
- **Compilation Command:** Can be handled by the `build` script, or manually.

#### Classes and Functions

The JavaScript code is organized using ES6 classes to represent different
content sections and types.

1. **`Section` (Base Class):**
   - **Purpose:** Represents a generic section on the monitor (main, footer,
sidebar).

   - **Properties:**
     - `elementId`: The ID of the DOM element.
     - `element`: The DOM element itself.

   - **Constructor:**
     - Initializes `elementId` and retrieves the DOM element using
`document.getElementById`.

2. **`ImageSection` (Extends `Section`):**
   - **Purpose:** Handles displaying a cycle of images.

   - **Properties:**
     - `images`: Array of image filenames.
     - `imageInterval`: Time interval between images (in seconds).
     - `imageIndex`: Current index in the `images` array.

   - **Methods:**
     - `getCSSImageUrl()`: Generates a CSS `background-image` URL.
     - `nextImage()`: Advances to the next image and updates the DOM.
     - `init()`: Initializes the image cycle and sets up intervals.

   - **DOM Manipulation:**
     - Updates the `style.backgroundImage` property of the section's DOM
element.

3. **`YouTubeSection` (Extends `Section`):**
   - **Purpose:** Embeds YouTube videos or playlists.
   - **Properties:**
     - `resourceId`: ID of the YouTube video or playlist.
     - `type`: Content type (`youtube_video` or `youtube_playlist`).

   - **Methods:**
     - `init()`: Sets up the YouTube player using the IFrame API.

   - **DOM Manipulation:**
     - Creates a `<div>` container for the YouTube player and appends it to the
section.
     - Initializes the YouTube player with appropriate parameters.

4. **`AnnouncementsSection` (Extends `Section`):**
   - **Purpose:** Displays announcements fetched from the server.

   - **Properties:**
     - `announcements`: Array of announcements.
     - `announcementsIndex`: Current index in the `announcements` array.
     - `textElement`: DOM element for displaying text.
     - `fetchInterval`: Interval for fetching new announcements (in
milliseconds).
     - `originalWidth`, `originalHeight`: Original dimensions of the container
for font size calculations.

   - **Methods:**
     - `updateAnnouncements()`: Fetches announcements from `/announcements`.
     - `setTextSize(fontSize)`: Adjusts font size recursively to fit the
container.
     - `setAnnouncement(text)`: Updates the announcement text.
     - `nextAnnouncement()`: Advances to the next announcement.
     - `init()`: Initializes the announcements display and sets up intervals.

   - **DOM Manipulation:**
     - Creates a `<p>` element (`textElement`) for displaying announcements.
     - Appends `textElement` to the section's DOM element.
     - Adjusts the `fontSize` style property to ensure text fits within the
container.

5. **`InfoSection` (Extends `Section`):**
   - **Purpose:** Displays time, date, and weather information.
   - **Properties:**
     - `latitude`, `longitude`: Coordinates for weather data (school location).
     - `data`: Object containing weather data.
     - `fetchInterval`: Interval for fetching weather data (in milliseconds).
     - `originalWidth`, `originalHeight`: Original dimensions for font size
calculations.

   - **Methods:**
     - `getAPIUrl()`: Constructs the Open-Meteo API URL.
     - `updateData()`: Fetches weather data from the API.
     - `addStat(ul, key, name, unit)`: Adds a statistic to the display list.
     - `setTextSize(fontSize)`: Adjusts font size to fit the container.
     - `updateDisplay()`: Updates the display with current time, date, and
weather data.
     - `init()`: Initializes the info display and sets up intervals.

   - **DOM Manipulation:**
     - Creates an unordered list (`<ul>`) to display information.
     - Appends list items (`<li>`) for each piece of data.
     - Adjusts font size to ensure content fits.

6. **`Monitor` Class:**
   - **Purpose:** Manages all sections and initializes the monitor interface.
   - **Properties:**
     - `sections`: Array of `Section` instances.

   - **Methods:**
     - `getConfig()`: Fetches the configuration from `/config`.
     - `init()`: Initializes sections based on the configuration.

   - **Initialization Flow:**
     - Fetches configuration from the server.
     - Iterates over configured sections (`main`, `footer`, `sidebar`).
     - Instantiates the appropriate section class based on the content type.

#### Event Handling

- **YouTube API Ready:**
  - Function `onYouTubePlayerAPIReady()` is called when the YouTube IFrame API
is ready.

  - This function creates a new `Monitor` instance and calls `monitor.init()`.

- **Intervals and Timeouts:**
  - **Image Cycle:** Uses `setInterval` to change images based on
`imageInterval`.

  - **Announcements:** Uses `setTimeout` and `setInterval` to cycle through
announcements and fetch updates.

  - **Info Display:** Uses `setInterval` to update weather data and display
every second.

### Content Types

#### Image Cycle

- **Configuration:**
  - Type: `image_cycle`
  - Properties:
    - `images`: Array of image filenames.
    - `image_interval`: Time interval between images (seconds).

- **Functionality:**
  - Displays images in a loop by updating the `background-image` style property.
  - Uses the `ImageSection` class to manage the image cycle.
  - Adjusts the image index to loop through the array.

#### YouTube Video/Playlist

- **Configuration:**
  - Type: `youtube_video` or `youtube_playlist`
  - Properties:
    - `resource_id`: Video or playlist ID.

- **Functionality:**
  - Embeds YouTube content using the IFrame API.
  - Uses the `YouTubeSection` class.
  - Sets player variables like autoplay, mute, controls, and looping.
  - Handles video playback and error events.

#### Announcements

- **Configuration:**
  - Type: `announcements`

- **Functionality:**
  - Fetches announcements from the server via `GET /announcements`.
  - Uses the `AnnouncementsSection` class.
  - Displays announcements one at a time with dynamic timing based on text length.
  - Adjusts font size to ensure the announcement fits the container.

#### Info Display

- **Configuration:**
  - Type: `info`

- **Functionality:**
  - Fetches weather data from the Open-Meteo API.
  - Uses the `InfoSection` class.
  - Displays current time, date, and weather statistics.
  - Updates data and display at regular intervals.

## Monitor Update GUI (`monitor_update.html`)

### Structure

**HTML File:** `monitor_update.html`

**Key Elements:**

- `<form method="POST" action="/api/update" enctype="multipart/form-data">`:
Form for submitting updates.

- `<select id="section" name="section">`: Dropdown to select the monitor section
(`A: Main`, `B: Footer`, `C: Sidebar`).

- `<select id="type" name="type">`: Dropdown to select the content type.
- `<section id="image_cycle">`: Contains fields for image cycle configuration.

- `<section id="youtube_video">`: Contains fields for YouTube video
configuration.

- `<section id="youtube_playlist">`: Contains fields for YouTube playlist
configuration.

- **Current Settings Display:**
  - `<ul id="current-main"></ul>`: Displays current settings for the main
section.

  - `<ul id="current-footer"></ul>`: Displays current settings for the footer
section.

  - `<ul id="current-sidebar"></ul>`: Displays current settings for the sidebar
section.

- `<script src="/static/js/monitor_update.js"></script>`: JavaScript file for
handling form logic and DOM updates.

**CSS Styling:**

- Inline styles are used to show/hide configuration sections based on content
type selection.

### JavaScript Components

**Main Script:** `/static/js/monitor_update.js`

#### Event Handling

- **Type Selection Change:**
  - Event listener on the `#type` select element (`sectionType` variable).
  - When the content type changes, the script:
    - Shows or hides the relevant `<section>` elements.
    - Updates the `required` attribute and `name` properties of input fields.
    - Ensures only relevant fields are submitted based on the selected content
type.

  ```javascript
  sectionType.onchange = event => {
    // Logic to show/hide sections and update input fields
  };
  ```

- **Parsing and Displaying Current Configuration:**
  - Function `parseCurrent(section, config)` displays current settings for each
section.

  - Fetches the current configuration from `/config` using `fetch`.

  - Updates the DOM elements (`#current-main`, `#current-footer`,
`#current-sidebar`) to show current settings.

  ```javascript
  async function initCurrent() {
    const raw = await fetch("/config");
    const globalConfig = await raw.json();

    ["main", "footer", "sidebar"].forEach(
      section => parseCurrent(section, globalConfig[section])
    );
  }

  initCurrent();
  ```

### Form Submission

- **Action:** Form submits data to `POST /api/update`.

- **Data Handling:**
  - Fields include:
    - `section`: Selected monitor section (`a`, `b`, or `c`).
    - `type`: Selected content type.
    - Additional fields based on content type:
      - `image_interval`, `image_files` for `image_cycle`.
      - `youtube_url` for YouTube content.
  - Input fields are dynamically required or optional based on content type
selection.

- **File Uploads:**
  - For `image_cycle`, users can upload one or more image files via the
`image_files` input.

- **Server Processing:**
  - The server validates the input, updates `config/monitor.json`, and handles
file uploads.

  - On success, the server redirects back to `/update`.

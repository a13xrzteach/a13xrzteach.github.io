"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const RNG = (min, max) => Math.round(Math.random() * (max - min)) + min;
class Section {
    constructor(elementId) {
        this.elementId = elementId;
        this.element = document.getElementById(elementId);
    }
}
class ImageSection extends Section {
    // Get a valid string to use as a background-image CSS property
    getCSSImageUrl() {
        const localPath = this.images[this.imageIndex];
        return `url(/static/img/monitor/${localPath})`;
    }
    // Increment imageIndex to loop across the images array, updating the image
    nextImage() {
        this.imageIndex = (this.imageIndex + 1) % this.images.length;
        this.element.style.backgroundImage = this.getCSSImageUrl();
    }
    init() {
        setInterval(() => this.nextImage(), this.imageInterval * 1000);
        this.element.style.backgroundSize = "contain";
        this.element.style.backgroundRepeat = "no-repeat";
        this.element.style.backgroundPosition = "center";
        // nextImage increments the index by 1 and we want to start at 0
        this.imageIndex = -1;
        this.nextImage();
    }
    constructor(elementId, config) {
        super(elementId);
        // imageIndex keeps track of the current index within the this.images array
        // of which image is displayed. This is entirely managed by the JavaScript
        // code and not extracted from the JSON.
        this.imageIndex = 0;
        this.images = config.images;
        this.imageInterval = config.image_interval;
        this.init();
    }
}
class YouTubeSection extends Section {
    init() {
        // Create a wrapper for the YouTube API to place the video inside
        const ytContainer = document.createElement("div");
        const ytContainerId = `yt-${this.elementId}`;
        ytContainer.id = ytContainerId;
        this.element.appendChild(ytContainer);
        // https://developers.google.com/youtube/player_parameters
        const playerVars = {
            // Set which second to start at - we want to play from the start of
            // the video
            start: 0,
            autoplay: 1,
            controls: 1,
            loop: 1,
            // The video has to be explicitly muted for autoplaying to work
            mute: 1,
            // Show captions by default
            cc_load_policy: 1,
        };
        if (this.type == "youtube_video") {
            // playlist has to be set to the ID as well for looping to work
            playerVars.playlist = this.resourceId;
        }
        else if (this.type == "youtube_playlist") {
            playerVars.list = this.resourceId;
            playerVars.listType = "playlist";
        }
        else
            console.error("Invalid YouTubeSection type", this.type);
        const playerOptions = {
            videoId: this.resourceId,
            playerVars: playerVars,
            events: {
                onReady: () => { },
                // https://developers.google.com/youtube/iframe_api_reference#onError
                onError: (event) => {
                    console.log("Received error from YouTube API");
                    console.log(event);
                }
            },
        };
        const player = new YT.Player(ytContainerId, playerOptions);
    }
    constructor(elementId, config) {
        super(elementId);
        this.resourceId = config.resource_id;
        this.type = config.type;
        this.init();
    }
}
class AnnouncementsSection extends Section {
    updateAnnouncements() {
        return __awaiter(this, void 0, void 0, function* () {
            const raw = yield fetch("/announcements");
            this.announcements = yield raw.json();
        });
    }
    setTextSize() {
        let fontSize = 1;
        this.textElement.style.fontSize = fontSize + "px";
        while (this.element.clientHeight <= this.originalHeight &&
            this.element.clientWidth <= this.originalWidth &&
            this.textElement.scrollWidth <= this.originalWidth &&
            this.textElement.scrollHeight <= this.originalHeight) {
            fontSize++;
            this.textElement.style.fontSize = fontSize + "px";
        }
        this.textElement.style.fontSize = (fontSize - 1) + "px";
    }
    setAnnouncement(text) {
        this.textElement.innerHTML = text;
        this.setTextSize();
    }
    nextAnnouncement() {
        this.announcementsIndex = (this.announcementsIndex + 1) % this.announcements.length;
        let text = `${this.announcementsIndex + 1}/${this.announcements.length}`;
        text = `${text}: ${this.announcements[this.announcementsIndex]}`;
        this.setAnnouncement(text);
        const updateDelay = text.length * 75 + 1000;
        setTimeout(() => this.nextAnnouncement(), updateDelay);
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            const offset = 0.25;
            yield this.updateAnnouncements();
            this.fetchInterval = this.fetchInterval * RNG(75, 125) / 100;
            setInterval(() => this.updateAnnouncements(), this.fetchInterval);
            this.element.style.display = "grid";
            this.textElement.className = "announcement";
            this.originalWidth = this.element.clientWidth;
            this.originalHeight = this.element.clientHeight;
            this.element.appendChild(this.textElement);
            this.nextAnnouncement();
        });
    }
    constructor(elementId) {
        super(elementId);
        this.announcements = [];
        this.announcementsIndex = -1;
        this.textElement = document.createElement("p");
        // Look for new announcements around every 10 minutes
        this.fetchInterval = 10 * 60 * 1000;
        // Original dimensions of the container
        // If we increase our container past them, our font size has gotten too large
        this.originalWidth = 0;
        this.originalHeight = 0;
        this.init();
    }
}
class Monitor {
    getConfig() {
        return __awaiter(this, void 0, void 0, function* () {
            const raw = yield fetch("/config");
            const config = yield raw.json();
            return config;
        });
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            const config = yield this.getConfig();
            // The only sectionIds we expect are mirrored in monitor.html:
            // main, footer, sidebar
            for (const sectionId in config) {
                let section;
                if (config[sectionId].type == "image_cycle") {
                    const sectionConfig = config[sectionId];
                    section = new ImageSection(sectionId, sectionConfig);
                }
                else if (config[sectionId].type == "youtube_video" ||
                    config[sectionId].type == "youtube_playlist") {
                    const sectionConfig = config[sectionId];
                    section = new YouTubeSection(sectionId, sectionConfig);
                }
                else if (config[sectionId].type == "announcements")
                    section = new AnnouncementsSection(sectionId);
                else {
                    alert("Error: Invalid section configuration. See the JS console.");
                    console.error(sectionId);
                    console.error(config);
                    return;
                }
                this.sections.push(section);
            }
        });
    }
    constructor() {
        this.sections = [];
    }
}
// It's easier to have everything configured together at once, so let's wait
// until the YouTube API is ready too, even if we're not using it.
// This doesn't load with an arrow function.
function onYouTubePlayerAPIReady() {
    return __awaiter(this, void 0, void 0, function* () {
        const monitor = new Monitor();
        monitor.init();
    });
}

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
class Section {
    constructor(elementId) {
        this.elementId = elementId;
        this.element = document.getElementById(elementId);
    }
}
class ImageSection extends Section {
    // Get a valid string to use as a background-image CSS property
    getCSSImageUrl() {
        const localPath = this.images[this.image_index];
        return `url(/static/img/monitor/${localPath})`;
    }
    // Increment image_index to loop across the images array, updating the image
    nextImage() {
        this.image_index = (this.image_index + 1) % this.images.length;
        this.element.style.backgroundImage = this.getCSSImageUrl();
    }
    init() {
        setInterval(() => this.nextImage(), this.image_interval * 1000);
        this.element.style.backgroundSize = "contain";
        this.element.style.backgroundRepeat = "no-repeat";
        this.element.style.backgroundPosition = "center";
        // nextImage increments the index by 1 and we want to start at 0
        this.image_index = -1;
        this.nextImage();
    }
    constructor(elementId, images, image_interval) {
        super(elementId);
        this.images = images;
        this.image_interval = image_interval;
        this.image_index = 0;
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
        // playlist has to be set to the ID as well for looping to work
        playerVars.playlist = this.videoId;
        // playerVars.list = "PLhN2KFLfxLBSjyRjwZZ6bY6PfVNSn_PW9";
        // playerVars.listType = "playlist";
        const playerOptions = {
            videoId: this.videoId,
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
    constructor(elementId, videoId) {
        super(elementId);
        this.videoId = videoId;
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
                    section = new ImageSection(sectionId, sectionConfig.images, sectionConfig.image_interval);
                }
                else if (config[sectionId].type == "youtube") {
                    const sectionConfig = config[sectionId];
                    section = new YouTubeSection(sectionId, sectionConfig.video_id);
                }
                else {
                    alert("Error: Invalid section configuration. See the JS console.");
                    console.error(sectionId);
                    console.error(config);
                    return;
                }
                this.sections.push(section);
                section.init();
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

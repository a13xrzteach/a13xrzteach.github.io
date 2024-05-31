class Section {
	elementId: string

	element: HTMLElement

	constructor(elementId: string) {
		this.elementId = elementId;
		this.element = document.getElementById(elementId)!;
	}
}

class ImageSection extends Section {
	// Local paths of images, relative to a13xrzteach.github.io/static/img/monitor
	// These will usually be "user-" followed by a UUID, generated by the
	// FastAPI backend in /update.
	// e.g. ["user-1f03d596-b1e0-4edc-9c26-0d12dbeed9e9"]
	images: string[]

	// How long to spend on an image before cycling to the next one (ms)
	image_interval: number

	// image_index keeps track of the current index within the this.images array
	// of which image is displayed. This is entirely managed by the JavaScript
	// code and not extracted from the JSON.
	image_index: number

	// Get a valid string to use as a background-image CSS property
	getCSSImageUrl() {
		const localPath = this.images[this.image_index];
		return `url(/static/img/monitor/${localPath})`;
	}

	// Increment image_index to loop across the images array, updating the image
	nextImage() {
		this.image_index = (this.image_index + 1) % this.images.length
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

	constructor(elementId: string, images: string[], image_interval: number) {
		super(elementId);

		this.images = images;
		this.image_interval = image_interval;

		this.image_index = 0;
	}
}

class YouTubeSection extends Section {
	videoId: string

	init() {
		// Create a wrapper for the YouTube API to place the video inside
		const ytContainer = document.createElement("div");
		const ytContainerId = `yt-${this.elementId}`;
		ytContainer.id = ytContainerId;
		this.element.appendChild(ytContainer);

		// https://developers.google.com/youtube/player_parameters

		const playerVars: YT.PlayerOptions["playerVars"] = {
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
		}

		// playlist has to be set to the ID as well for looping to work
		playerVars.playlist = this.videoId;

		// playerVars.list = "PLhN2KFLfxLBSjyRjwZZ6bY6PfVNSn_PW9";
		// playerVars.listType = "playlist";

		const playerOptions = {
			videoId: this.videoId,
			playerVars: playerVars,

			events: {
				onReady: () => {},

				// https://developers.google.com/youtube/iframe_api_reference#onError
				onError: (event: YT.PlayerEvent) => {
					console.log("Received error from YouTube API");
					console.log(event);
				}
			},
		}

		const player = new YT.Player(ytContainerId, playerOptions);
	}

	constructor(elementId: string, videoId: string) {
		super(elementId);
		this.videoId = videoId;
	}
}

// These interfaces describe the structure of the JSON returned by /config,
// from a13xrzteach.github.io/config/monitor.json.

interface SectionConfig {
	type: string
}

interface ImageConfig extends SectionConfig {
	images: string[]
	image_interval: number
}

interface YouTubeConfig extends SectionConfig {
	video_id: string
}

interface Config {
	[key: string]: SectionConfig
}

class Monitor {
	sections: Section[]

	async getConfig(): Promise<Config> {
		const raw = await fetch("/config");
		const config = await raw.json();
		return config;
	}

	async init() {
		const config = await this.getConfig();

		// The only sectionIds we expect are mirrored in monitor.html:
		// main, footer, sidebar
		for (const sectionId in config) {
			let section: YouTubeSection | ImageSection;

			if (config[sectionId].type == "image_cycle") {
				const sectionConfig = config[sectionId] as ImageConfig;

				section = new ImageSection(
					sectionId,
					sectionConfig.images,
					sectionConfig.image_interval
				);
			}

			else if (config[sectionId].type == "youtube") {
				const sectionConfig = config[sectionId] as YouTubeConfig;
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
	}

	constructor() {
		this.sections = [];
	}
}

// It's easier to have everything configured together at once, so let's wait
// until the YouTube API is ready too, even if we're not using it.
// This doesn't load with an arrow function.
async function onYouTubePlayerAPIReady() {
	const monitor = new Monitor();
	monitor.init();
}

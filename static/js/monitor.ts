class Section {
	elementId: string
	element: HTMLElement

	constructor(elementId: string) {
		this.elementId = elementId;
		this.element = document.getElementById(elementId)!;
	}
}

class ImageSection extends Section {
	images: string[]
	image_interval: number

	// Managed by the JavaScript and not extracted from the JSON
	image_index: number

	getCSSImageUrl() {
		const localPath = this.images[this.image_index];
		return `url(/static/img/monitor/${localPath})`;
	}

	nextImage() {
		this.image_index = (this.image_index + 1) % this.images.length
		this.element.style.backgroundImage = this.getCSSImageUrl();
	}

	init() {
		setInterval(() => this.nextImage(), this.image_interval * 1000);

		this.element.style.backgroundSize = "contain";
		this.element.style.backgroundRepeat = "no-repeat";
		this.element.style.backgroundPosition = "center";

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
		const ytContainer = document.createElement("div");
		const ytContainerId = `yt-${this.elementId}`;
		ytContainer.id = ytContainerId;
		this.element.appendChild(ytContainer);

		const player = new YT.Player(ytContainerId, {
			videoId: this.videoId,
			playerVars: {
				start: 0,
				autoplay: 1,

				// The video has to be explicitly muted for autoplaying to work
				mute: 1,

				controls: 0,
				loop: 1,

				// playlist has to be set to the ID as well for looping to work
				playlist: this.videoId,
			},
			events: {
				onReady: () => {},

				// https://developers.google.com/youtube/iframe_api_reference#onError
				onError: event => {
					console.log("Received error from YouTube API");
					console.log(event);
				}
			},
		});
	}

	constructor(elementId: string, videoId: string) {
		super(elementId);
		this.videoId = videoId;
	}
}

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

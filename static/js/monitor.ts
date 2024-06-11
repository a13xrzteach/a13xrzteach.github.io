const RNG = (min: number, max: number) =>
	Math.round(Math.random() * (max - min)) + min;

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
	imageInterval: number

	// imageIndex keeps track of the current index within the this.images array
	// of which image is displayed. This is entirely managed by the JavaScript
	// code and not extracted from the JSON.
	imageIndex = 0

	// Get a valid string to use as a background-image CSS property
	getCSSImageUrl() {
		const localPath = this.images[this.imageIndex];
		return `url(/static/img/monitor/${localPath})`;
	}

	// Increment imageIndex to loop across the images array, updating the image
	nextImage() {
		this.imageIndex = (this.imageIndex + 1) % this.images.length
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

	constructor(elementId: string, config: ImageConfig) {
		super(elementId);

		this.images = config.images;
		this.imageInterval = config.image_interval;

		this.init();
	}
}

class YouTubeSection extends Section {
	resourceId: string
	type: string

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

		if (this.type == "youtube_video") {
			// playlist has to be set to the ID as well for looping to work
			playerVars.playlist = this.resourceId;
		}
		else if (this.type == "youtube_playlist") {
			playerVars.list = this.resourceId;
			playerVars.listType = "playlist";
		}

		else console.error("Invalid YouTubeSection type", this.type);

		const playerOptions = {
			videoId: this.resourceId,
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

	constructor(elementId: string, config: YouTubeConfig) {
		super(elementId);

		this.resourceId = config.resource_id;
		this.type = config.type;

		this.init();
	}
}

class AnnouncementsSection extends Section {
	announcements: string[] = []
	announcementsIndex = -1
	textElement = document.createElement("p")

	// Look for new announcements around every 10 minutes
	fetchInterval = 10 * 60 * 1000

	// Original dimensions of the container
	// If we increase our container past them, our font size has gotten too large
	originalWidth = 0
	originalHeight = 0

	async updateAnnouncements() {
		const raw = await fetch("/announcements");
		this.announcements = await raw.json();
	}

	setTextSize() {
		let fontSize = 1;
		this.textElement.style.fontSize = fontSize + "px";

		while (
			this.element.clientHeight <= this.originalHeight &&
			this.element.clientWidth <= this.originalWidth &&
			this.textElement.scrollWidth <= this.originalWidth &&
			this.textElement.scrollHeight <= this.originalHeight
		) {
			fontSize++;
			this.textElement.style.fontSize = fontSize + "px";
		}

		this.textElement.style.fontSize = (fontSize-1) + "px";
	}

	setAnnouncement(text: string) {
		this.textElement.innerHTML = text;
		this.setTextSize();
	}

	nextAnnouncement() {
		this.announcementsIndex = (this.announcementsIndex + 1) % this.announcements.length;

		let text = `${this.announcementsIndex+1}/${this.announcements.length}`;
		text = `${text}: ${this.announcements[this.announcementsIndex]}`;
		this.setAnnouncement(text);

		const updateDelay = text.length * 75 + 1000;
		setTimeout(() => this.nextAnnouncement(), updateDelay);
	}

	async init() {
		await this.updateAnnouncements()

		this.fetchInterval = this.fetchInterval * RNG(75, 125) / 100;
		setInterval(() => this.updateAnnouncements(), this.fetchInterval);

		this.element.style.display = "grid";
		this.textElement.className = "announcement";

		this.originalWidth = this.element.clientWidth;
		this.originalHeight = this.element.clientHeight;

		this.element.appendChild(this.textElement);
		this.nextAnnouncement();
	}

	constructor(elementId: string) {
		super(elementId);

		this.init();
	}
}

interface InfoData {
	[key: string]: number
}

class InfoSection extends Section {
	// School location
	latitude = 44.03254035352888
	longitude = -79.48015624518095

	data: InfoData = {
		temperature: 0,
		relativeHumidity: 0,
		precipitationProbability: 0,
		precipitation: 0,
	}

	originalWidth = 0
	originalHeight = 0

	// Fetch every 30 minutes to avoid getting rate limited by OpenMeteo
	fetchInterval = 30 * 60 * 1000

	getAPIUrl() {
		return `https://api.open-meteo.com/v1/forecast?latitude=${this.latitude}&longitude=${this.longitude}&current=temperature_2m,relative_humidity_2m,precipitation_probability,precipitation&timezone=America%2FNew_York`;
	}

	async updateData() {
		console.log("infoSection: fetching API data");

		const raw = await fetch(this.getAPIUrl());
		let json = await raw.json();
		json = json.current;

		this.data["temperature"] = json.temperature_2m;
		this.data["relativeHumidity"] = json.relative_humidity_2m;
		this.data["precipitationProbability"] = json.precipitation_probability;
		this.data["precipitation"] = json.precipitation;
	}

	addStat(ul: HTMLElement, key: string, name: string, unit: string) {
		const li = document.createElement("li");
		ul.appendChild(li);

		const value = this.data[key];
		li.innerHTML = `${name}: ${value} ${unit}`;
	}

	setTextSize() {
		let fontSize = 1;
		this.element.style.fontSize = fontSize + "px";

		while (
			this.element.clientHeight <= this.originalHeight &&
			this.element.clientWidth <= this.originalWidth &&
			this.element.scrollWidth <= this.originalWidth &&
			this.element.scrollHeight <= this.originalHeight
		) {
			fontSize++;
			this.element.style.fontSize = fontSize + "px";
		}

		this.element.style.fontSize = (fontSize-1) + "px";
	}

	updateDisplay() {
		Array.from(this.element.children).forEach(el => el.remove());

		const ul = document.createElement("ul");
		this.element.appendChild(ul);

		let li;

		li = document.createElement("li");
		ul.appendChild(li);

		const dateOptions: Intl.DateTimeFormatOptions = {
			weekday: "long",
			year: "numeric",
			month: "long",
			day: "numeric",
		};
		li.innerHTML = new Date().toLocaleDateString("en-CA", dateOptions);

		li = document.createElement("li");
		ul.appendChild(li);
		li.innerHTML = new Date().toLocaleTimeString("en-US");

		this.addStat(ul, "temperature", "Temperature", "°C");
		this.addStat(ul, "relativeHumidity", "Relative Humidity", "%");
		this.addStat(ul, "precipitationProbability", "Probability of precipitation", "%");
		this.addStat(ul, "precipitation", "Precipitation", "mm");

		this.setTextSize();
	}

	async init() {
		this.element.className = "info";
		this.originalWidth = this.element.clientWidth;
		this.originalHeight = this.element.clientHeight;

		await this.updateData();
		this.updateDisplay();

		setInterval(() => this.updateData(), this.fetchInterval);
		setInterval(() => this.updateDisplay(), 1000);
	}

	constructor(elementId: string) {
		super(elementId);
		this.init();
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
	resource_id: string
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
			let section: Section;

			if (config[sectionId].type == "image_cycle") {
				const sectionConfig = config[sectionId] as ImageConfig;
				section = new ImageSection(sectionId, sectionConfig);
			}

			else if (
				config[sectionId].type == "youtube_video" ||
				config[sectionId].type == "youtube_playlist"
			) {
				const sectionConfig = config[sectionId] as YouTubeConfig;
				section = new YouTubeSection(sectionId, sectionConfig);
			}

			else if (config[sectionId].type == "announcements")
				section = new AnnouncementsSection(sectionId);

			else if (config[sectionId].type == "info")
				section = new InfoSection(sectionId);

			else {
				alert("Error: Invalid section configuration. See the JS console.");
				console.error(sectionId);
				console.error(config);
				return;
			}

			this.sections.push(section);
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

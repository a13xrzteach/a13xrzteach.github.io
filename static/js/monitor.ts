const sections = ["main", "footer", "sidebar"];

interface Containers {
	[key: string]: HTMLElement
}

const containers: Containers = {};

sections.forEach(section => {
	containers[section] = document.getElementById(section)!;
});

const nextImage = (section: string) => {
	const oldIdx = config[section].image_index;
	const images = config[section].images
	const newIdx = (oldIdx + 1) % images.length

	config[section].image_index = newIdx;
	containers[section].style.backgroundImage = `url(/static/img/monitor/${images[newIdx]})`;
}

const initImageCycle = (section: string) => {
	setInterval(() => nextImage(section), config[section].image_interval * 1000);

	const container = containers[section];
	container.style.backgroundSize = "contain";
	container.style.backgroundRepeat = "no-repeat";
	container.style.backgroundPosition = "center";

	config[section].image_index = -1;
	nextImage(section);
}


const initYouTube = (section: string) => {
	const sectionContainer = containers[section];

	const ytContainer = document.createElement("div");
	const ytContainerId = `yt-${section}`;
	ytContainer.id = ytContainerId;
	sectionContainer.appendChild(ytContainer);

	const ytId = config[section].video_id;
	const player = new YT.Player(ytContainerId, {
		videoId: ytId,
		playerVars: {
			start: 0,
			autoplay: 1,

			// The video has to be explicitly muted for autoplaying to work
			mute: 1,

			controls: 0,
			loop: 1,

			// playlist has to be set to the ID as well for looping to work
			playlist: ytId,
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

interface ImageDisplay {
	type: string
	images: string[]
	image_interval: number

	// Managed by the JavaScript and not set inside the JSON
	image_index: number
}

interface YouTubeDisplay {
	type: string
	video_id: string
}

interface Config {
	[key: string]: ImageDisplay | YouTubeDisplay
}

let config: Config = {};

// It's easier to have everything configured together at once, so let's wait
// until the YouTube API is ready too, even if we're not using it. This doesn't
// load with an arrow function.
async function onYouTubePlayerAPIReady() {
	const raw = await fetch("/config");
	config = await raw.json();

	sections.forEach(section => {
		if (config[section].type == "image_cycle")
			initImageCycle(section);

		if (config[section].type == "youtube")
			initYouTube(section);
	});
}

const sections = ["main", "footer", "sidebar"];
const containers = {};

sections.forEach(section => {
	containers[section] = document.getElementById(section);
});

const nextImage = section => {
	const oldIdx = config[section].image_index;
	const images = config[section].images
	const newIdx = (oldIdx + 1) % images.length

	config[section].image_index = newIdx;
	containers[section].style.backgroundImage = `url(/static/img/monitor/${images[newIdx]})`;
}

const initImageCycle = section => {
	setInterval(() => nextImage(section), config[section].image_duration * 1000);

	const container = containers[section];
	container.style.backgroundSize = "contain";
	container.style.backgroundRepeat = "no-repeat";
	container.style.backgroundPosition = "center";

	config[section].image_index = -1;
	nextImage(section);
}


const initYouTube = section => {
	const sectionContainer = containers[section];

	const ytContainer = document.createElement("div");
	const ytContainerId = `yt-${section}`;
	ytContainer.id = ytContainerId;
	sectionContainer.appendChild(ytContainer);

	const ytId = config[section].video_id;
	const player = new YT.Player(ytContainerId, {
		videoId: ytId,
		playerVars: {
			start: params.get("time") || 0,
			autoplay: 1,

			// The video has to be explicitly muted for autoplaying to work
			mute: 1,

			controls: 0,
			loop: 1,

			// playlist has to be set to the ID as well for looping to work
			playlist: ytId,
		},
		events: {
			"onReady": () => {},

			// https://developers.google.com/youtube/iframe_api_reference#onError
			"onError": event => {
				console.log("Received error from YouTube API");
				console.log(event);
			}
		},
	});
}

let config = {};

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

// monitor.js is loaded with config/monitor.js, containing the config object.

// Stored in seconds for consistency with image_cycle's image_duration
const reloadInterval = 5 * 60;

let player;
const params = new URLSearchParams(window.location.search);

function onYouTubePlayerAPIReady() {
	player = new YT.Player("yt-player", {
		videoId: ytID,
		playerVars: {
			start: params.get("time") || 0,
			autoplay: 1,

			// The video has to be explicitly muted for autoplaying to work
			mute: 1,

			controls: 0,
			loop: 1,

			// playlist has to be set to the ID as well for looping to work
			playlist: ytID,
		},
		events: {
			"onReady": onPlayerReady,
			"onError": onError
		},
	});
}

const onPlayerReady = () => {
	setTimeout(() => {
		params.set("time", Math.floor(player.getCurrentTime()));
		const url = new URL(window.location.href);
		url.search = params.toString();
		window.location.href = url.toString();

	// Add a second of delay because the YouTube frame takes a second or so to
	// load initially
	}, ytReload + 1000);
};


// https://developers.google.com/youtube/iframe_api_reference#onError
const onError = event => {
	console.log("Received error from YouTube API");
	console.log(event);
};

// Initiate the iframe player API, which gets picked up on
// onYouTubePlayerAPIReady
const ytMode = () => {
	const script = document.createElement("script");
	script.src = "https://www.youtube.com/player_api";
	document.body.appendChild(script);
};

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

sections.forEach(section => {
	if (config[section].type == "image_cycle")
		initImageCycle(section);
});

// monitor.js is loaded with ../monitor_config.js.

const cycleMode = () => {
	const imgEl = document.getElementById("img")
	let imgIdx = 0

	const update = () => {
		if (cyclesBeforeRefresh == 0)
			location.reload()

		imgEl.src = `cycle_images/${cycleImages[imgIdx]}`

		imgIdx++
		if (imgIdx == cycleImages.length) {
			imgIdx = 0

			cyclesBeforeRefresh--
		}
	}
	update()

	setInterval(() => {
		update()
	}, imgDuration)
}

let player
const params = new URLSearchParams(window.location.search)

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
		}
	})
}

const onPlayerReady = () => {
	setTimeout(() => {
		params.set("time", Math.floor(player.getCurrentTime()))
		const url = new URL(window.location.href)
		url.search = params.toString()
		window.location.href = url.toString()

	// Add a second of delay because the YouTube frame takes a second or so to
	// load initially
	}, ytReload + 1000)
}


// https://developers.google.com/youtube/iframe_api_reference#onError
const onError = event => {
	console.log("Received error from YouTube API")
	console.log(event)
}

// Initiate the iframe player API, which gets picked up on
// onYouTubePlayerAPIReady
const ytMode = () => {
	const script = document.createElement("script")
	script.src = "https://www.youtube.com/player_api"
	document.body.appendChild(script)
}

if (mode == "cycle")
	cycleMode()
else if (mode == "youtube")
	ytMode()

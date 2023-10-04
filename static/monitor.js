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
function onYouTubePlayerAPIReady() {
	player = new YT.Player("yt-player", {
		videoId: ytID,
		playerVars: {
			autoplay: 1,

			// The video has to be explicitly muted for autoplaying to work
			mute: 1,

			controls: 0,
			loop: 1,

			// playlist has to be set to the ID as well for looping to work
			playlist: ytID,
		},
		events: {
			"onReady": onPlayerReady
		}
	})
}

const onPlayerReady = () => {
	setTimeout(() => {
		window.location.reload()
	}, ytReload)
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

// monitor.js is loaded with monitor_config.js.

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

const ytMode = () => {
	const iframe = document.getElementById("iframe")
	iframe.style.display = "block"

	// playlist has to be set to the ID as well for looping to work
	iframe.src = `https://www.youtube.com/embed/${ytID}?playlist=${ytID}&autoplay=1&mute=1&loop=1&controls=0`

	setTimeout(() => {
		document.location.reload()
	}, ytReload)
}

if (mode == "cycle")
	cycleMode()
else if (mode == "youtube")
	ytMode()

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

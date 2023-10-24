const games = {
	"su": "https://studio.code.org/projects/gamelab/m_s_vS48KzojF1zB10Sp8ZDCx1dwhoqqvr_q4LyYjBo/embed",
	"zhao": "https://studio.code.org/projects/gamelab/HCu1mXW2Gr3BGearJslOAQGBgot5UXz6I_RgHNylhp8/embed",
	"som": "https://studio.code.org/projects/gamelab/aYARWyfKh0Axz43wV5fL9uwsc3LWP5l3zwldXYhl_rg/embed",
	"skyba": "https://michaelskyba.github.io/savo/public/",
}

const iframe = document.getElementById("iframe")

for (const id of Object.keys(games)) {
	const button = document.getElementById(id)
	button.onclick = () => {
		iframe.src = games[id]
	}
}

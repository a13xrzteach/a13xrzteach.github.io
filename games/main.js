const games = {
	"easey": "https://studio.code.org/projects/gamelab/dGk78rAIhnDMVr1PJRII8XoGKOJgqIGYnlRABS3bCeE/embed",
	"goad": "https://studio.code.org/projects/gamelab/DtXsiGUpTl_eKufx8RjodJ0wPD3REicubIL3L25j5uI/embed",
	"tszching": "https://studio.code.org/projects/applab/gHOyCfFt65-7hY4XXfbTQaJo2EOniy-XNQck_cSQm1M/embed",
	"kim": "https://studio.code.org/projects/gamelab/l8XNc1TRc60kCiLoYgbw7y8jxE4qm0hu7awQCTBpSQ4/embed",
	"khademazarian": "https://studio.code.org/projects/gamelab/VI-4TpyMO4VjJ65BQ4utVWiQ1w5t0bsnFnrxRxeCeGk/embed",
	"virdi": "https://studio.code.org/projects/gamelab/sWiQ5zy_Uf6YMKNeKRlZ4c8Z-RhxjH0pB9yFaqws_uo/embed",
	"kamat": "https://studio.code.org/projects/gamelab/PXcYHxlRD2isxpG2anOm8izFr_nAoi9YafotEUgbq3s/embed",
	"wang": "https://studio.code.org/projects/gamelab/gTUq2nUay6zZYv_-BKAa0ZafIM-WcX9FzKjhs5EnJww/embed",
	"morrison": "https://studio.code.org/projects/gamelab/IetQW39uNYe7g_w8mFbeLqmtoD-yWO0p5v2JiohYTTA/embed",
	"piklas": "https://studio.code.org/projects/gamelab/4nlqj59QpcvWau2_c490HS1AvjTgjA87XOjbWWnTMsA/embed",
	"su": "https://studio.code.org/projects/gamelab/m_s_vS48KzojF1zB10Sp8ZDCx1dwhoqqvr_q4LyYjBo/embed",
	"zhao": "https://studio.code.org/projects/gamelab/HCu1mXW2Gr3BGearJslOAQGBgot5UXz6I_RgHNylhp8/embed",
	"som": "https://studio.code.org/projects/gamelab/aYARWyfKh0Axz43wV5fL9uwsc3LWP5l3zwldXYhl_rg/embed",
	"skyba": "https://michaelskyba.github.io/savo/public/",
}

const iframe = document.getElementById("iframe")

for (const id of Object.keys(games)) {
	document.getElementById(id).onclick = () => {
		iframe.src = games[id]
	}
}

const RNG = (min, max) =>
	Math.round(Math.random() * (max - min)) + min

document.getElementById("random").onclick = () => {
	const keys = Object.keys(games)
	const key = keys[RNG(0, keys.length-1)]
	iframe.src = games[key]
}

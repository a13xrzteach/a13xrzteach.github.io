const sectionType = document.getElementById("type");

const sectionsArray = ["image_cycle", "youtube_video", "youtube_playlist"];
const sections = {};
sectionsArray.forEach(section => {
	sections[section] = document.getElementById(section);
});

const inputRequirements = {
	"image_cycle": ["image_interval", "image_files"],
	"youtube_video": ["youtube_video_url"],
	"youtube_playlist": ["youtube_playlist_url"],
};

sectionType.onchange = event => {
	sectionsArray.forEach(section => {
		const isSelected = event.target.value == section;
		sections[section].style.display = isSelected ? "block" : "none";

		inputRequirements[section].forEach(id => {
				const el = document.getElementById(id);
				el.required = isSelected;

				if (id == "youtube_video_url" || id == "youtube_playlist_url")
					el.setAttribute("name", isSelected ? "youtube_url" : "disabled");
			}
		);
	});
};

const parseCurrent = (section, config) => {
	const sectionEl = document.getElementById(`current-${section}`);

	const typeEl = document.createElement("li");
	typeEl.innerHTML = `Section type: ${config.type}`;
	sectionEl.appendChild(typeEl);

	if (config.type == "image_cycle") {
		const intervalEl = document.createElement("li");
		intervalEl.innerHTML = `Cycle image switch interval (seconds): ${config.image_interval}`;
		sectionEl.appendChild(intervalEl);

		config.images.forEach(image => {
			const imageLi = document.createElement("li");

			const a = document.createElement("a");
			a.href = `/static/img/monitor/${image}`;
			a.innerHTML = image;

			imageLi.appendChild(a);
			sectionEl.appendChild(imageLi);
		});
	}

	else if (config.type == "youtube_video") {
		const linkEl = document.createElement("li");

		const a = document.createElement("a");
		const url = `https://youtube.com/watch?v=${config.resource_id}`;
		a.href = url;
		a.innerHTML = url;

		linkEl.appendChild(a);
		sectionEl.appendChild(linkEl);
	}

	else if (config.type == "youtube_playlist") {
		const linkEl = document.createElement("li");

		const a = document.createElement("a");
		const url = `https://youtube.com/playlist?list=${config.resource_id}`;
		a.href = url;
		a.innerHTML = url;

		linkEl.appendChild(a);
		sectionEl.appendChild(linkEl);
	}
}

async function initCurrent() {
	const raw = await fetch("/config");
	const globalConfig = await raw.json();

	["main", "footer", "sidebar"].forEach(
		section => parseCurrent(section, globalConfig[section])
	);
}

initCurrent();

const sectionType = document.getElementById("type");

const sectionsArray = ["image_cycle", "youtube"];
const sections = {};
sectionsArray.forEach(section => {
	sections[section] = document.getElementById(section);
});

const inputRequirements = {
	"image_cycle": document.getElementById("image_files"),
	"youtube": document.getElementById("youtube_url"),
};

sectionType.onchange = event => {
	sectionsArray.forEach(section => {
		const isSelected = event.target.value == section;
		sections[section].style.display = isSelected ? "block" : "none";
		inputRequirements[section].required = isSelected;
	});
};

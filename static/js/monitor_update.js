const sectionType = document.getElementById("type");

const sectionsArray = ["youtube", "image_cycle"];
const sections = {};
sectionsArray.forEach(section => {
	sections[section] = document.getElementById(section);
});

sectionType.onchange = event => {
	sectionsArray.forEach(section => {
		const display = section == event.target.value ? "block" : "none";
		sections[section].style.display = display;
	});
}

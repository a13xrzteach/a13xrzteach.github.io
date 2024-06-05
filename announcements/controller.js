/*
Upstream URL ?
	https://script.google.com/u/1/home/projects/1vju3sgmbmqEzwtPywO2gQhyVWEMlsJOWMUxjvDGKh_eNj1rP4bwJQcrS/edit

GitHub Mirror
	https://github.com/a13xrzteach/a13xrzteach.github.io/blob/main/announcements/controller.js

Final
	Form (edit): https://docs.google.com/forms/d/1iCi6l_-v9lq6Sk1E7AUM_gnxmTDsBVbCSXr31VbLfxg/edit
	Form (submit): https://docs.google.com/forms/d/e/1FAIpQLSe4MZr1sH8dwNAB0GgNnnjbrPX9NsyLU9AT_y82Kqhry41K9A/viewform
	Database sheet: https://docs.google.com/spreadsheets/d/1CDCMp0gXfjZpQB0iDg2S-t6HRMnY9ELfi4Rak_euIn8/edit?usp=sharing
	Client view: https://docs.google.com/document/d/1-SAkIGntABdpNXewQeCFTMVo3PsIKKdPysvwAfuU0Nk/edit?usp=sharing

Testing
	Test sheet: https://docs.google.com/spreadsheets/d/1Ce1MMEp6r5VGvBWN6FKtpPwDQ0w6gb1pCBgbFEzk-Q4/edit?usp=sharing
*/

// Main controller code
function main() {
	const databaseID = "1vN68wX0hi1Jl9Cfp9vsDSvdtBGPq1KL2gpjJ5CSIoS8";
	const range = "Form Responses";
	let announcements = getSheetCells(databaseID, range);

	// Remove the first element, which is the row for the headers
	announcements.shift();

	const documentID = "15bhSjMZYsuS6XkGMgsXq2I5qZchHRfrtQEQ_X6kqYrg";
	setDocContent(documentID, announcements);
}

// https://developers.google.com/sheets/api/guides/values
// https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/get
function getSheetCells(id, range) {
	return Sheets.Spreadsheets.Values.get(id, range).values;
}

/*
https://developers.google.com/sheets/api/guides/values#writing_to_a_single_range
The values argument looks like
[
	// Row 1
	[
		Cell 1,
		Cell 2,
		Cell 3
	],
	// Row 2
	[
		Cell 1,
		Cell 2,
		Cell 3
	]
]
*/
function writeSheetCells(id, values, range) {
	let valueRange = Sheets.newValueRange();
	valueRange.values = values;

	// https://developers.google.com/sheets/api/reference/rest/v4/ValueInputOption
	const valueInputOption = "RAW";

	Sheets.Spreadsheets.Values.update(valueRange, id, range, {valueInputOption: valueInputOption});
}

function getDate() {
	const options = {
		day: "numeric",
		weekday: "short",
		year: "numeric",
		month: "long"
	};
	return new Date().toLocaleDateString("en-CA", options);
}

// Checks if a recurring announcement's weekday specification is active today
// Input can be one day ("Monday") or multiple ("Monday, Tuesday, Wednesday")
function isValidWeekday(announcement) {
	const days = announcement[7];

	// Sunday is 0 according to JS
	const weekdays = [
		"Sunday",
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday"
	];
	const today = weekdays[new Date().getDay()];

	for (const day of days.split(", ")) {
		if (day == today)
			return true;
	}
	return false;
}

// Checks if the given announcement (DB row) is supposed to be shown today
// If it's single time, this means that its set date is today's date
// If it's recurring, this means that its start date is <= today and end date is >= today
function isValidDate(announcement) {
	const type = announcement[3];

	if (type == "Recurring PA Messages") {
		let startDate = new Date(announcement[6]).getTime();
		let endDate = new Date(announcement[8]).getTime();

		// Make endDate go back one day because getTime sets it to the start of the day
		// Otherwise being in the middle of endDate would count as not today
		// We add the number of ms in a day
		endDate += 1000 * 60 * 60 * 24;

		const now = Date.now();
		return now >= startDate && now <= endDate && isValidWeekday(announcement);
	}

	else {
		const date = announcement[5];
		return new Date().toLocaleDateString("en-US") == date;
	}
}

function setDocContent(id, rows) {
	const doc = DocumentApp.openById(id);
	let body = doc.getBody();

	// Clear old content
	body.clear();

	// Add current date
	let date = getDate();
	body.appendParagraph(date).setHeading(DocumentApp.ParagraphHeading.HEADING1);

	const openingMessage = "If you are in the classroom please be seated, and if you are in the hallway please stay where you are until the end of announcements. Here are the announcements for today.";
	body.appendParagraph(openingMessage).setHeading(DocumentApp.ParagraphHeading.HEADING3);
	body.appendHorizontalRule();

	let numAnnouncements = 0;

	for (let i = 0; i < rows.length; i++) {
		if (isValidDate(rows[i])) {
			body.appendParagraph(rows[i][4]);
			body.appendHorizontalRule();
			numAnnouncements++;
		}
	}

	if (numAnnouncements == 0)
		body.appendParagraph("Never mind! There are no announcements today.");

	/*
	Demonstration from https://developers.google.com/apps-script/guides/docs

	var rowsData = [['Plants', 'Animals'], ['Ficus', 'Goat'], ['Basil', 'Cat'], ['Moss', 'Frog']]
	body.insertParagraph(0, doc.getName())
		.setHeading(DocumentApp.ParagraphHeading.HEADING1)
	table = body.appendTable(rowsData)
	table.getRow(0).editAsText().setBold(true)
	*/
}

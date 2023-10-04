/*
Note:
- All strings are case-sensitive.
- Don't arbitrarily modify non-config aspects without first understanding how
monitor.html and monitor.js work together. The monitor view would break if
cyclesBeforeRefresh was changed from "let" to "const", for example.
*/

/*
mode determines which type of view the monitor should display.
The options are...
"cycle": cycling through images
"youtube": playing a YouTube video/stream
*/
const mode = "youtube"

/*
ytID sets the YouTube embed ID to play, both for videos and livestreams. For
example, if you wanted to play https://www.youtube.com/watch?v=iY9KPkrgyhQ, ytID
should be the string "iY9KPkrgyhQ".
*/
const ytID = "yY4izYfI7g0"

/*
ytReload sets how often the page should be reloaded, if you are on youtube mode.
Every time the monitor page reloads, it will use the new monitor_config.js, so
it's necessary to have it reload somewhat frequently to make the monitor
convenient to update remotely. This nubmer is in milliseconds.
*/
const ytReload = 5 * 60 * 1000

/*
cycleImages sets the list of images to go through, which will be shown if you
are using cycle mode. These should all be in the cycle_images/ folder of the
GitHub repo. Make sure they are using the same aspect ratio as your monitor if
you want them to look right.
*/
const cycleImages = [
	"qr-git-sg-1.png",
	"sg-1.png",
	"sg-2.png",
	"sg-3.png",
	"sg-4.png",
	"sg-5.png",
	"sg-6.png",
]

/*
imgDuration sets how long each image in cycle mode should be shown, in
milliseconds.
*/
const imgDuration = 2500

/*
cyclesBeforeRefresh sets how many cycles of cycleImages should be shown before
refreshing the page to update to a new monitor_config.js. So, the total time
before a refresh in cycle mode would be
cycleImages.length * imgDuration * cyclesBeforeRefresh
The reason this isn't just hardcoded as one cycle is because after a refresh,
the first shown image has a flash of the black background before it loads
properly, which might be jarring for viewers.
*/
let cyclesBeforeRefresh = 5

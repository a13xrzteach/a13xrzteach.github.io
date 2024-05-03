const config = {}

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
// const mode = "cycle"
const mode = "youtube"

/*
ytID sets the YouTube embed ID to play, both for videos and livestreams. For
example, if you wanted to play https://www.youtube.com/watch?v=iY9KPkrgyhQ, ytID
should be the string "iY9KPkrgyhQ". Some videos are blocked even if they don't
show any blocks inside YouTube Studio, though. Test them out in a private window
locally first to check.
But make sure you're using an HTTP server like
python -m http.server
All file:// requests will be blocked by the API by default.
*/
const ytID = "4i_OY-mnkQM" // genact
// const ytID = "MOj7aLRipPo" // bitcoin price

/*
ytReload sets how often the page should be reloaded, if you are on youtube mode.
Every time the monitor page reloads, it will use the new monitor_config.js, so
it's necessary to have it reload somewhat frequently to make the monitor
convenient to update remotely. This should generally just be left at five
minutes instead of trying to adapt it to the length of your video. Videos longer
than ytReload will work fine, since the reload will remember your placement in
the video. Also, videos loop, so you could see multiple cycles if your duration
is shorter than ytReload. This number is in milliseconds.
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
	"color0524.png"
	// "SWMSS Business 2022-2023_page-0001.jpg",
	// "SWMSS Business 2022-2023_page-0002.jpg",
	// "SWMSS Business 2022-2023_page-0003.jpg",
	// "SWMSS Business 2022-2023_page-0004.jpg",
	// "SWMSS Business 2022-2023_page-0005.jpg",
	// "SWMSS Business 2022-2023_page-0006.jpg",
	// "SWMSS Business 2022-2023_page-0007.jpg",
	// "SWMSS Business 2022-2023_page-0008.jpg",
	// "SWMSS Business 2022-2023_page-0009.jpg",
	// "SWMSS Business 2022-2023_page-0010.jpg",
	// "SWMSS Business 2022-2023_page-0011.jpg",
	// "SWMSS Business 2022-2023_page-0012.jpg",
	// "SWMSS Business 2022-2023_page-0013.jpg",
	// "SWMSS Business 2022-2023_page-0015.jpg",
	// "SWMSS Business 2022-2023_page-0016.jpg",
	// "SWMSS Business 2022-2023_page-0017.jpg",
	// "SWMSS Business 2022-2023_page-0018.jpg",
	// "SWMSS Business 2022-2023_page-0019.jpg",
	// "SWMSS Business 2022-2023_page-0020.jpg",
	// "SWMSS Business 2022-2023_page-0021.jpg",
	// "SWMSS Business 2022-2023_page-0022.jpg",
	// "SWMSS Business 2022-2023_page-0023.jpg",
	// "SWMSS Business 2022-2023_page-0024.jpg",
	// "SWMSS Business 2022-2023_page-0025.jpg",
	// "SWMSS Business 2022-2023_page-0026.jpg",
	// "SWMSS Business 2022-2023_page-0027.jpg",
	// "SWMSS Business 2022-2023_page-0028.jpg",
	// "SWMSS Business 2022-2023_page-0029.jpg",
	// "SWMSS Business 2022-2023_page-0030.jpg",
	// "SWMSS Business 2022-2023_page-0031.jpg",
	// "SWMSS Business 2022-2023_page-0032.jpg",
	// "SWMSS Business 2022-2023_page-0033.jpg",
	// "SWMSS Business 2022-2023_page-0034.jpg",
]

/*
imgDuration sets how long each image in cycle mode should be shown, in
milliseconds.
*/
const imgDuration = 6000

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

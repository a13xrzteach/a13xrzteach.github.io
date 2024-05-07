# a13xrzteach.github.io
CS Club site: https://a13xrzteach.github.io

## Update Delay
When updating anything, you'll have to wait for GitHub's servers to deploy the
new site, and then for the next refresh that the monitor view makes. Under
reasonable settings in config/monitor.js, this might take around five minutes.

## Raspberry Pis
Instead of using GitHub pages, you can connect to the local server (Arch Linux
desktop in room 203). This is highly recommended if you're using a device that
you will lack physical access to after deploying, such as one of the Raspberry
Pis connected to the TV monitors. See
[pi/README.md](https://github.com/a13xrzteach/a13xrzteach.github.io/blob/main/pi/README.md).

## Monitor config.js format
The monitor's configuration is stored in ``config/monitor.js``. It is not intended
to be modified by hand. Instead, you use the GUI frontend.

TODO Reword with link

The format used is
```js
const config = {
	"main": display_obj,
	"footer": display_obj,
	"sidebar": display_obj,
};
```

``display_obj`` describes a type of display to show. There are two current types.

### Image cycle
```json
{
	"type": "image_cycle",
	"images": [
		"image1.png",
		"image2.png",
	],
	"image_duration": 1,
}
```

For image cycles, the images are stored in the ``static/img/monitor/``
directory. ``image_duration`` is a number, in seconds, specifying how long each
image should be shown for before transitioning to the next one.

### YouTube embedded video
```json
{
	"type": "youtube",
	"ytID": "4i_OY-mnkQM",
}
```

Your video can be a recorded video or an active livestream.

Some videos are blocked even if they don't show any blocks inside YouTube
Studio, though. Test them out in a private window locally first to check.

Make sure you're using an HTTP server like
``python -m http.server``
All file:// requests will be blocked by the API by default.

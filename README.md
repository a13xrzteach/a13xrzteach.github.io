# a13xrzteach.github.io
CS Club site: https://a13xrzteach.github.io

The monitor view is located at https://a13xrzteach.github.io/monitor.html.

To modify settings, edit the
[config/monitor.js](https://github.com/a13xrzteach/a13xrzteach.github.io/blob/main/config/monitor.js)
file ("the config").

## YouTube video / stream view
To enable YouTube mode, set ``mode`` to "youtube" in the config. See the
comments in the file for documentation on the other settings, like how to set
what video/stream you want to play.

## Slide Cycling
To enable cycling through images, set ``mode`` to "cycle" in the config.

To modify the cycle, add your images to the
[static/img/monitor/ folder](https://github.com/a13xrzteach/a13xrzteach.github.io/tree/main/static/img/monitor).
Then, modify ``cycleImages`` in the config.

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

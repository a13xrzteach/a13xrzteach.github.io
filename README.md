# a13xrzteach.github.io
CS Club site: https://a13xrzteach.github.io

The monitor view is located at https://a13xrzteach.github.io/monitor.html.

To modify settings, edit the
[monitor_config.js](https://github.com/a13xrzteach/a13xrzteach.github.io/blob/main/monitor_config.js)
file ("the config").

## YouTube video / stream view
To enable YouTube mode, set ``mode`` to "youtube" in the config. See the
comments in the file for documentation on the other settings, like how to set
what video/stream you want to play.

## Slide Cycling
To enable cycling through images, set ``mode`` to "cycle" in the config.

To modify the cycle, add your images to the
[cycle_images/ folder](https://github.com/a13xrzteach/a13xrzteach.github.io/tree/main/cycle_images).
Then, modify ``cycleImages`` in the config.

## Update Delay
When updating anything, you'll have to wait for GitHub's servers to deploy the
new site, and then for the next refresh that the monitor view makes. Under reasonable
settings in monitor_config.js, this might take around five minutes.

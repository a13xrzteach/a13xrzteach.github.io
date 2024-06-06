# Server
## Dependencies
- Standard Linux installation
- ``git``
- ``jq``
- ``python-virtualenv``
- ``kakoune`` for text editing (optional)

## Startup
Disable power saving and automatic screen locks in KDE's settings.

Clone the repository and run the server script:
```sh
mkdir ~/src
cd ~/src
git clone https://github.com/a13xrzteach/a13xrzteach.github.io/
cd a13xrzteach.github.io/pi
./server
```

Upstream, update the ``endpoint`` variable in the ``client`` script to match the
server's location. The ``server`` script shows you the configured private IP and
port.

The server has no auto-update functionality. Run ``git pull`` again if you make
upstream changes that you wish to be served.

# Client
## Dependencies
- Standard Raspberry Pi OS installation
- ``git``
- ``chromium``
- ``kakoune`` for text editing (optional)

## Setup
### Automatic
The ``client_setup`` script can be readily accessed from the local server, at
``/setup``. As of 2024-06-05, the IP and port are ``10.242.207.207:17860``, so
you can use
```sh
curl 10.242.207.207:17860/setup | sh
```

If the location has changed or the server's script is otherwise unavailable, you
can use the upstream URL from GitHub instead:
```sh
curl "https://raw.githubusercontent.com/a13xrzteach/a13xrzteach.github.io/main/pi/client_setup" | sh
```

Attempt 1: After rebooting, Chromium seemed to open but then close instantly. I
tried running ``client_manager`` manually and it seemed to function correctly.
Then I rebooted it manually and it worked on the next boot.

### Manual
Clone the repository, perhaps in a ``~/src`` directory:
```sh
mkdir ~/src
cd ~/src
git clone https://github.com/a13xrzteach/a13xrzteach.github.io/
```

Configure git pull (may not be required since switch to fetch and reset):
```sh
git config --global pull.rebase false
```

Now, create a desktop entry for the Raspberry Pi's LXDE to run the ``startup``
script on boot:
```sh
cp a13xrzteach.github.io/pi/startup.desktop ~
mkdir ~/.config/autostart
cd ~/.config/autostart
mv ~/startup.desktop .
```

Edit ``startup.desktop`` to specify the correct directory to the startup script.
If you're using ``~/src``, you'll only have to modify the username.

Finally, reboot the device:
```sh
reboot
```

When it boots, ``startup.desktop`` will be respected, which calls the
``startup`` script, which leads to all of the logic to schedule the necessary
client and system restarts.

If you have further physical access to the device and need to modify something,
you can manually open the terminal and, for example, put an ``exit`` at the top
of ``startup`` to prevent the regular cycle on the next reboot.

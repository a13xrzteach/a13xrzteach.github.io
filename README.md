# a13xrzteach.github.io
CS Club site: https://a13xrzteach.github.io

## Raspberry Pis
Instead of using GitHub pages, you can connect to the local server (Arch Linux
desktop in room 203). This is highly recommended if you're using a device that
you will lack physical access to after deploying, such as one of the Raspberry
Pis connected to the TV monitors. See
[pi/README.md](https://github.com/a13xrzteach/a13xrzteach.github.io/blob/main/pi/README.md).

## Monitor Configuration
The monitor's configuration is stored in ``config/monitor.json``. It is not intended
to be modified by hand. Instead, you use the GUI frontend located at ``/update``.

As of 2024-05-29, our server's private IP address and port are
``10.242.207.207`` and ``17860``, so you would visit
``http://10.242.207.207:17860/update``.

To access ``/update``, you will need to provide correct credentials.
- The username is public: ``oboro``
- The password is private. Ask Room 203 if you need access.

The monitor.json format is described in ``a13xrzteach.github.io/static/js/monitor.ts``.

Some videos are blocked even if they don't show any blocks inside YouTube
Studio. Test them out in a private window locally first to check. All file://
requests will be blocked by the API by default, so use the provided uvicorn
server.

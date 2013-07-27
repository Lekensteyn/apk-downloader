APK Downloader Chrome Extension
===============================
This original version of this Chromium extension can be found on
http://codekiem.com/2012/02/24/apk-downloader/. Improvements have been made by
Bexton.

This version is based on apkdownloader-1.3.4.zip as found on
http://forum.xda-developers.com/showthread.php?t=1809458. This project was
started because the 1.3.4 version became broken with Chromium 23 and because I
(Lekensteyn) prefer a public git repository to work on code instead of some
obscure zip package from a random forum.

Contributions are always welcome.

Installation
------------
Prior to version 1.4.1, only a source distribution was available, but since I
found out that some third parties provide a CRX file with spyware, I decided to
make a CRX available as well. For installation instructions, see:

  https://lekensteyn.nl/apk-downloader/

Changelog
---------
For changes before and including 1.3.4, see
http://forum.xda-developers.com/showthread.php?t=1809458.

For a detailed changelog from 1.4 and later, see
https://lekensteyn.nl/apk-downloader/#changelog

Known issues
------------
- No feedback when pressing icon (make it glow?).
- No useful error when a download failed (todo: decode response).
- MarketDA session cookie is not cleared when download is initiated/complete.

Credits
-------
Many thanks to [redphoenix89](http://codekiem.com/) for the original version and
[Bexton](http://forum.xda-developers.com/member.php?u=4273402) for the improved
version.

[Lekensteyn](http://lekensteyn.nl/) started cleaning the extension, fixing
header-related bugs and tried to make the options page more obvious. [Rob
W](http://rob.lekensteyn.nl/) rewrote the download code.

Other projects
--------------
While trying to find out how things work, I encountered some other projects:
Python download script: https://github.com/evilsocket/google-play-downloader
(uses the same idea as redphoenix89's Chrome extension, but implemented in
Python)

PHP script for downloading (I could not test the actual APK download process as
tcpdump did not show the necessary UserID):
http://thomascannon.net/blog/2011/06/downloading-apks-from-android-market/

License
-------
The original version (1.3.4) did not have a software license. The newly written
code is licensed under GPLv3:

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.

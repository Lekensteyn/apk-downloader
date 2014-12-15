APK Downloader Chrome Extension
===============================

_As featured on Android Police, AndroidPit, XDA & more._

**_APK Downloader_** is a simple Chrome extension that allows one to pull any 
free apk (no pirating, folks!) from Google's Play Store website - even if it's 
listed as incompatible with your device and / or country.  

About
-----

The _original_ version of this extension was developed by [redphoenix89] and can 
be found on <http://codekiem.com/2012/02/24/apk-downloader/>.

_This_ version, however, is based on [version 1.3.4]. That version was developed 
by [eyecatchUp] (a.k.a. Bexton) and is an updated and heavily improved version 
of redphoenix89's original **_APK Downloader_** version. It can be found on [XDA]. 

I - [Lekensteyn] - started this repository because changes in Chromium 23 broke 
the **_APK Downloader_** version 1.3.4 and it received no more updates. _(And 
also because I prefer a public git repository and wasn't aware of [eyecatchUp's 
repository] at this time.)_ Since then, I fixed the extension's outdated code, 
further improved it and kept it uptodate, until today.

Contributions are always welcome, of course.


Installation
------------

To install the latest version, please refer to the instructions here:  
_**Note:** Use of the extension is against the Play Store ToS - use at your own 
"risk"._ 

  - <https://lekensteyn.nl/apk-downloader/>


Changelogs
----------

  - **Version >= 1.4.0**  
    <https://lekensteyn.nl/apk-downloader/#changelog>
  - **Version >= 1.3.0 and <= 1.3.4**  
    <http://forum.xda-developers.com/showpost.php?p=29644434&postcount=1>
  - **Version <= 1.2.1**  
    <http://codekiem.com/2012/02/24/apk-downloader/>


Known Issues
------------

  - No useful client feedback when a download failed (todo: decode response).
  - MarketDA session cookie is not cleared when download is initiated/complete.


Authors / Credits
-----------------

  - **Quan Le Thanh Minh** (a.k.a. [redphoenix89])  
    _Author of the original version._
  - **Stephan Schmitz** (a.k.a. [eyecatchUp] / [Bexton])  
    _Improved / rewrote redphoenix89's version and created the [new icon] artwork._
  - **Peter Wu** (a.k.a. [Lekensteyn])  
    _Improved / rewrote eyecatchUp's version._  
  - **[Rob Wu]**  
    _Contributor to Lekensteyn's version._ 


Similar Projects
----------------

While trying to find out how things work, I encountered some other projects:
Python download script: <https://github.com/evilsocket/google-play-downloader>
(uses the same idea as redphoenix89's Chrome extension, but implemented in
Python).

PHP script for downloading (I could not test the actual APK download process as
tcpdump did not show the necessary UserID):
<http://thomascannon.net/blog/2011/06/downloading-apks-from-android-market/>.


License
-------

Version 1.3.4 did not specified a software license. The newly written
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


[redphoenix89]:http://codekiem.com/  
[Lekensteyn]:http://lekensteyn.nl/
[eyecatchUp]:http://eyecatchup.github.io/
[Bexton]:http://forum.xda-developers.com/member.php?u=4273402
[Rob Wu]:http://robwu.nl/
[XDA]:http://forum.xda-developers.com/showthread.php?t=1809458
[version 1.3.4]:https://github.com/eyecatchup/android-play-store-apk-downloader-crx  
[eyecatchUp's repository]:https://github.com/eyecatchup/android-play-store-apk-downloader-crx  
[new icon]:https://github.com/eyecatchup/android-play-store-apk-downloader-crx/commit/c3985ac757dcb6c10bf053590401f824490e96a5

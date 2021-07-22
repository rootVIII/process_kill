###### Roku Remote
<img src="" alt="mp4">
<br>
<br>

<br>
<br>
Basic remote features offered:<br>
up, down, left, right, ok, home, play/pause, back, and power
<br>
<br>
You shouldn't really need to use the power button as most
Rokus will turn on when the input receives power from the
TV. However it may be useful for turning the Roku OFF.
<br>
<br>
This code should run on any OS, but has only been tested on
MacOS Big Sur.
<br>
<br>
A network scan is performed based on your machine's IPv4
address and netmask at application start-up. Any found Roku
devices should load into the dropdown.
<br>
<br>
The remote has only been tested on the typical /24 private
network and finds available devices in under a second. The
remote has not been tested on larger networks (less than
/24 and with more hosts). It should work the same in theory.
<br>
<br>
<br>
There is a signed/Apple-notarized macOS installer found in
<a href="https://github.com/rootVIII/rokuremote/releases/tag/V1.0">Releases</a> (built on Intel Big Sur).
<br>
<br>
Otherwise use <code>npm</code> to run:
<pre>
  <code>
# Navigate to project root and run npm start (requires electron):
npm start .
# Build electron dist/ with executable (requires electron-builder)
npm run pack
  </code>
</pre>
<br>
<hr>
<b>Author: rootVIII 2020</b><br>

###### Process Kill for MacOS
<img src="" alt="mp4">
<br>
View, search, and kill long-running processes
<br>

<br>
<br>

<br>
<br>


Note that processes running as root may only be killed by running the application as root.
Via terminal:
<pre>
  <code>
sudo su root
(enter su password)
./Applications/Process\ Kill.app/Contents/MacOS/Process\ Kill  
  </code>
</pre>
<br>
<br>
<br>
There is a signed/Apple-notarized macOS installer found in
<a href="https://github.com/rootVIII/process_kill/releases/tag/v1.0">Releases</a> (built on Intel Big Sur).
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

Team 41
Name:	Minh Tuan To
	Tyson Pham
Student ID:	40114920
		40017829
Server: labs445-1.encs.concordia
Username on server: team41
Password on server: password41

HOW TO RUN THE CODE:
	1. SSH to the server with the command: ssh team41@labs445-1.encs.concordia.ca
	2. Change directory to streaming (The full path for this directory should be /home/team41/streaming/)
	3. Run PHP localhost with the command: php -S localhost:9000
	4. Open a separate tab for terminal in local machine
	5. Create an SSH tunnel with the command: ssh -L 9000:localhost:9000 team41@labs445-1.encs.concordia.ca
	6. Go to 'localhost:9000/socketServer.php' on browser to check if the tunnel is working. Blank page means it is working properly!
	7. Open a separate tab for terminal in local machine
	8. Go to the code directory and run another localhost with command: php -S localhost:5000
	9. Go to 'localhost:5000' on browser, and you should see a page for recording or uploading video
	10. Open up console
	11. Click start recording/upload a video to see how the program uploads and responds!

EXPLANATION OF THE CODE:
	- index.html: HTML page to store all the elements that is needed for video playback and video uploading
	- script.js: Handling video recording and video encoding
	- segment.js: Handling video segmenting and video uploading
		+) Here, I use the FFmpeg web assembly library to segment the video.
		+) Since FFmpeg needs server-side operation, I used a CDN from cloudflare to help me with processing ffmpeg.
		+) FFmpeg web assembly also needs SharedArrayBuffer, which is a server-side service, so I used a worker called coi-serviceworker.js to bypass this requirement.
		+) After fulfilling all FFmpeg requirements, it is loaded onto the javascript file to run segmenting operation.
		+) After segmentation, FFmpeg writes the output segments into its Emscripten file system
		+) Using the output segment names, I loop through and find all the segments within the file system for uploading.
		+) For each segment, I create an object URL and append it to a FormData object.
		+) With this FormData object, I use HTTP POST to send to socketServer.php
		+) If I get a response from the PHP file (which means the video went through), I can play it in the video player on index.html
		+) After each upload, the upload will sleep for 3.1s which is enough time for 1 segment to be played onto the video player before moving on to the next segment.
		+) After all segments are uploaded, I send a "Complete" message to the server to retrieve the list of uploaded videos from server-side
	- coi-serviceworker.js: Bypassing SharedArrayBuffer error in browser and letting FFmpeg use the SharedArrayBuffer.
	- socketServer.php: Handling file uploads and send the total file list when complete message has been received



REFERENCES:
	- Cross-origin isolation through a service worker (bypassing SharedArrayBuffer error)
	    https://github.com/gzuidhof/coi-serviceworker
	- FFmpeg CDN
	    https://cdnjs.com/libraries/ffmpeg
	- FFmpeg WebAssembly library
	    https://github.com/ffmpegwasm/ffmpeg.wasm
	- SSH tunneling
	    https://stackoverflow.com/questions/33764038/access-localhost-port-remotely
	- JavaScript sleep() function
	    https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep
	- Bypassing CORS error when accessing different localhost
	    https://stackoverflow.com/questions/18642828/origin-origin-is-not-allowed-by-access-control-allow-origin

Name:	Minh Tuan To
Student ID:	40114920
Server: Personal server (because the server provided by the professor no longer has free storage)

EXPLANATION OF THE CODE:
	- index.html: HTML page to store all the elements that is needed for video playback and video uploading
	- segment.js: All video processing will be done here
		+) Here, I use the FFmpeg web assembly library to encode and segment the video.
		+) Since FFmpeg needs server-side operation, I used a CDN from cloudflare to help me with processing ffmpeg.
		+) FFmpeg web assembly also needs SharedArrayBuffer, which is a server-side service, so I used a worker called coi-serviceworker.js to bypass this requirement.
		+) After fulfilling all FFmpeg requirements, it is loaded onto the javascript file to run segmenting operation.
		+) First, the recording function is handled. I enable start and stop recording, and I use WebM as the type of video recorded.
		+) When the "Stop Streaming" button is clicked, it will make a Blob object of the video recorded and send this Blob to FFmpeg file system.
		+) Then, the transcode() function is called to read this video from the file system and start encoding.
		+) A command line is run for ffmpeg to convert and encode the WebM video to h.264 with 5Mbps bitrate, and an mp4 video is outputted.
		+) Then, that output video is splitted into 3-second segments with each segment having h.264 encoding for video and AAC encoding for audio.
		+) After segmentation, FFmpeg writes the output segments into its Emscripten file system
		+) Using the output segment names, I loop through and find all the segments within the file system for uploading.
		+) For each segment, I create an object URL and append it to a FormData object.
		+) With this FormData object, I use HTTP POST to send to socketServer.php
		+) If I get a response from the PHP file (which means the video went through), I can play it in the video player on index.html
		+) After each upload, the upload will sleep for 3.1s which is enough time for 1 segment to be played onto the video player before moving on to the next segment.
		+) After all segments are uploaded, I send a "Complete" message to the server to retrieve the list of uploaded videos from server-side
	- coi-serviceworker.js: Bypassing SharedArrayBuffer error in browser and letting FFmpeg use the SharedArrayBuffer.
	- socketServer.php: Handling file uploads and send the total file list when complete message has been received. When user click "Load DASH", a "Create" message is sent to trigger createMPD.sh script
	- createMPD.sh: A bash script that runs ffmpeg on the server to concatenate all the segments uploaded and then compile them into an MPEG-DASH playlist with 4 quality levels. 
	- resetDash.sh: A bash script that removes all .mpd and .m4s file from the previous recordings. This script is triggered when the user record a new video.
	- dashPlayer.js: Handling of DASH playlist creation and play the DASH video on-demand




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
	- Video recording with JavaScript
	    https://usefulangle.com/post/354/javascript-record-video-from-camera
		

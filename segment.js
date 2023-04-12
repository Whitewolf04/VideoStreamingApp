const { createFFmpeg, fetchFile, FS } = FFmpeg;
const ffmpeg = createFFmpeg({ log: true });

let camera_button = document.querySelector("#start-camera");
let video = document.querySelector("#src");
let start_button = document.querySelector("#start");
let stop_button = document.querySelector("#stop");
let download_link = document.createElement('a');

let camera_stream = null;
let media_recorder = null;
let blobs_recorded = [];

camera_button.addEventListener('click', async function() {
   	camera_stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
	video.srcObject = camera_stream;
});

start_button.addEventListener('click', function() {
    // set MIME type of recording as video/webm
    media_recorder = new MediaRecorder(camera_stream, { mimeType: 'video/webm' });

    // event : new recorded video blob available 
    media_recorder.addEventListener('dataavailable', function(e) {
		blobs_recorded.push(e.data);
    });

    // event : recording stopped & all blobs sent
    media_recorder.addEventListener('stop', async function() {
    	// create local object URL from the recorded video blobs
      const recordedBlob = new Blob(blobs_recorded, { type: 'video/webm' });

      await ffmpeg.load();
      const fileData = await recordedBlob.arrayBuffer();
      const fileArray = new Uint8Array(fileData);
      await ffmpeg.FS('writeFile', './recorded_video.webm', fileArray);
      await transcode();
    });

    // start recording with each recorded blob having 1 second video
    media_recorder.start(1000);
});

stop_button.addEventListener('click', function() {
	media_recorder.stop();
});



// const { createFFmpeg, fetchFile, FS } = FFmpeg;
// const ffmpeg = createFFmpeg({ log: true });
// const transcode = async ({ target: { files } }) => {
const transcode = async () => {
  // const { name } = files[0];
  // await ffmpeg.load();
  // ffmpeg.FS('writeFile', name, await fetchFile(files[0]));
  // await ffmpeg.run('-i', name, "-vcodec", "libx264", "-acodec", "aac",  'output.mp4');
  const name = 'recorded_video.webm';
  await ffmpeg.FS('readFile', './recorded_video.webm');

  // Segment the video
  await ffmpeg.run('-i', name, "-c:v", "libx264", "-b:v", "5000k", "-acodec", "aac",  'output.mp4');
  await ffmpeg.run('-i', 'output.mp4', '-map', '0', '-segment_time', '3', '-force_key_frames', 'expr:gte(t,n_forced*3)', '-reset_timestamps', '1', '-vcodec', 'libx264', '-acodec', 'aac',  '-f', 'segment', 'output_video%d.mp4')

  // Loop through the segmented parts in the file system, and send to server
  for(let i = 0; i > -1; i++){
    const fileName = 'output_video' + i + '.mp4';
    let data = null;
    try{
      data = ffmpeg.FS('readFile', fileName);
    } catch (error) {
      console.log('Total number of segments: ' + i);
      break;
    }

    // Send the video segment to the server
    const url = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
    fetch(url)
      .then(response => response.blob())
      .then(blob => {
        const formData = new FormData()
        formData.append('video', blob, fileName)

        fetch('http://localhost:9000/socketServer.php', {
          method: 'POST',
          body: formData
        }).then(response => response.text())
        .then(textResponse => {
          console.log(textResponse)
          // Play it live onto the client
          var video = document.getElementById('player');
          video.src = url;
          video.controls = true;
          video.play();
        })
        .catch(error => {
          console.error(error);
        })
      })
      .catch(error => console.error(error))
    await sleep(3100);
  }

  const completeForm = new FormData();
  completeForm.append('complete', 'Completed');
  var options = {
      method: 'POST',
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'message=' + encodeURIComponent('Complete')
  };
  fetch('http://localhost:9000/socketServer.php', options)
  .then(response => response.text())
  .then(textResponse => {
    const fileNames = textResponse.split("\\n");
    console.log("List of mp4 files uploaded to server:")
    fileNames.forEach(function(filePath){
      const fileName = filePath.substring(filePath.lastIndexOf('/')+1, filePath.length);
      console.log(fileName);
    });
  })
  .catch(error => console.error(error))
}

// document.getElementById('uploader').addEventListener('change', transcode);

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
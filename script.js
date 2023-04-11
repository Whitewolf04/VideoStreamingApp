let video = document.getElementById('src');
let button = document.getElementById('record');
let encodeWorker = null;
let stream = null;
let videoTrack = null;

async function startRecording() {
    console.assert(button.innerText == 'Record');
    button.disabled = true;

    handle = await window.showSaveFilePicker({
        startIn: 'videos',
        suggestedName: 'myVideo.webm',
        types: [{
        description: 'Video File',
        accept: {'video/webm' :['.webm']}
        }],
    });

    videoTrack = stream.getTracks()[0];
    let trackSettings = videoTrack.getSettings();
    let trackProcessor = new MediaStreamTrackProcessor(videoTrack);
    let frameStream = trackProcessor.readable;

    // Encoder I/O and file writing happens in a Worker to keep the UI
    // responsive.
    encodeWorker = new Worker('encode-worker.js');

    // Tell the worker to start encoding the frames and writing the file.
    // NOTE: transferring frameStream and reading it in the worker is more
    // efficient than reading frameStream here and transferring VideoFrames
    // individually. This allows us to entirely avoid processing frames on the
    // main (UI) thread.
    encodeWorker.postMessage({
    type: 'start',
    fileHandle: handle,
    frameStream: frameStream,
    trackSettings: trackSettings
    }, [frameStream]);

    button.innerText = 'Stop';
    button.disabled = false;
}

function stopRecording() {
    console.assert(button.innerText == 'Stop');
    button.innerText = 'Record';
    encodeWorker.postMessage({ type: 'stop'});
    return;
}

async function onButtonClicked() {
    switch(button.innerText) {
    case 'Record':
        startRecording();
        break;
    case 'Stop':
        stopRecording();
        break;
    }
};

async function main() {
    let constraints = {
    audio: false,
    video: {width: 1280, height: 720, frameRate: 30}
    };
    stream = await window.navigator.mediaDevices.getUserMedia(constraints);
    let video = document.getElementById('src');
    video.srcObject = stream;
}

document.body.onload = main;
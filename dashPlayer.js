var player = dashjs.MediaPlayer().create();

player.updateSettings({
    streaming: {
        abr: {
            useDefaultABRRules: true,
            ABRStrategy: 'abrDynamic',
            additionalAbrRules: {
                insufficientBufferRule: true,
                switchHistoryRule: false,
                droppedFramesRule: false,
                abandonRequestsRule: false
            }
            
        }
    }
});

let loadDashButton = document.querySelector("#loadDash");
let playDashButton = document.querySelector("#playDash");

loadDashButton.addEventListener('click', function(){
    const createPlaylistRequest = new FormData();
    createPlaylistRequest.append('complete', 'Completed');
    var options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'message=' + encodeURIComponent('Create')
    };
    fetch('http://localhost:9000/socketServer.php', options)
    .then(response => response.text())
    .then(textResponse => {
        console.log(textResponse);
    })
    .catch(error => console.error(error))
});

playDashButton.addEventListener('click', function(){
    const url = 'http://74.208.130.221/videos/output.mpd';

    player.initialize(document.querySelector("#player"), url, true);
})

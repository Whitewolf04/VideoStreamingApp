<?php 
    header('Access-Control-Allow-Origin: *');

    // Video upload
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['video'])) {
        // $targetDir = '/home/team41/streaming/';
        $targetDir = '';
        $targetFile = $targetDir . basename($_FILES['video']['name']);
        if(move_uploaded_file($_FILES['video']['tmp_name'], $targetFile)){
            echo "The file " . basename($_FILES['video']['name']) . " has been uploaded.";
        } else {
            echo "Unable to upload file ". basename($_FILES['video']['name']);
        };
    }

    // Upload complete, return list of mp4 files
    if(isset($_POST['message']) && strcmp($_POST['message'], 'Complete') == 0){
        $search = '/home/team41/streaming/*.mp4';
        $files = glob($search);
        $output = '';

        if(!$files){
            echo "No file found!";
        } else {
            foreach($files as $file){
                $output = $output . $file . '\n';
            }

            echo $output;
        }

        shell_exec('./resetDash.sh');
    }

    // Create mpd playlist from uploaded mp4 files
    if(isset($_POST['message']) && strcmp($_POST['message'], 'Create') == 0){
        $output = shell_exec('./createMPD.sh');

        echo $output;
    }

?>
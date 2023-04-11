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

    //Testing file upload
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['file'])) {
        $target_dir = '/home/team41/streaming/'; // directory to save uploaded files
        $target_file = $target_dir . basename($_FILES['file']['name']);
        if (move_uploaded_file($_FILES['file']['tmp_name'], $target_file)) {
            echo "The file " . basename($_FILES['file']['name']) . " has been stored locally.";
        } else {
            echo "Sorry, there was an error storing the file locally.";
        }
    }

    // Upload complete, return list of mp4 files
    if(isset($_POST['message'])){
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
    }

?>
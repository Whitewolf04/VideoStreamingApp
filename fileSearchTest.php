<?php 

    $dir = '/home/team41/streaming/*.mp4';
    $files = glob($dir);

    if(!$files){
        echo "No file has been found!";
    } else {
        foreach($files as $file){
            echo $file;
        }
    }
    
?>
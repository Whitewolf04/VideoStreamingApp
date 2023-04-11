<?php 

    $dir = '/Users/whitewolf04/Document/COMP\ 445\ Computer\ Network/COMP445_LAB2/*.txt';
    $files = glob("*.txt");

    if(!$files){
        echo "No file has been found!";
    } else {
        foreach($files as $file){
            echo $file;
        }
    }
    
?>
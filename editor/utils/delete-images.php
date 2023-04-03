<?php

if (isset($_GET['id'])) {
    $id = $_GET['id'];
    $dir = dirname(__DIR__, 1) . "/media/user-uploads/" . $id . "/";

    if(is_dir($dir)) {
        // Delete all files in directory
        $files = glob($dir . '*'); // Get all files in directory
        foreach($files as $file){
            if(is_file($file)) {
                unlink($file); // Delete file
            }
        }
        
        // Delete directory
            rmdir($dir);
    }

} else {
    header('HTTP/1.0 404 Not Found');
}

?>
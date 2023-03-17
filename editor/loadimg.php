<?php

if (isset($_GET['img'])) {

    $img = $_GET['img'];

    // Allowed mime content types
    $allowed = array('image/jpeg', 'image/png', 'image/gif');

    $filetype = mime_content_type($img);

    if (in_array($filetype, $allowed)) {
        header('Content-Type: ' . $filetype);
        $image = readfile($img);
    } else {
        header('HTTP/1.0 404 Not Found');
    }
} else {
    header('HTTP/1.0 404 Not Found');
}

?>
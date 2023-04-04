<?php

if (isset($_GET['img']) && (isset($_GET['id']) || isset($_GET['sticker']))) {
    $img = $_GET['img'];

    if (isset($_GET['id'])) {
        $id = $_GET['id'];
        $path = dirname(__DIR__, 2) . '/media/user-uploads/' . $id . '/' . $img;
    } else if (isset($_GET['sticker'])) {
        $path = dirname(__DIR__, 2) . '/media/stickers/' . $img;
    }

    // Allowed mime content types
    $allowed = array('image/jpeg', 'image/png', 'image/gif', 'image/svg+xml', 'image/webp', 'image/bmp', 'image/tiff');

    $filetype = mime_content_type($path);

    if (in_array($filetype, $allowed)) {
        header('Content-Type: ' . $filetype); // Present self as image
        $image = readfile($path);
    } else {
        header('HTTP/1.0 404 Not Found');
    }
} else {
    header('HTTP/1.0 404 Not Found');
}

?>
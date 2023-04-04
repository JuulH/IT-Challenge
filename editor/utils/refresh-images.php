<?php

if (isset($_GET['sticker'])) {
    $dir = dirname(__DIR__, 2) . '/media/stickers/';
} else if (isset($_GET['id'])) {
    $id = $_GET['id'];
    $dir = dirname(__DIR__, 2) . '/media/user-uploads/' . $id . '/';
} else {
    header('HTTP/1.0 404 Not Found');
    exit;
}

$filetypes = array('jpg', 'png', 'gif', 'jpeg', 'webp', 'svg', 'bmp', 'tiff');
$user_uploads = array();

// Find all images in directory
foreach ($filetypes as $type) {
    $files = glob($dir . '*.' . $type);
    foreach ($files as $file) {
        array_push($user_uploads, basename($file)); // Return only filename
    }
}

$sources = array();

foreach ($user_uploads as $img) {
    $src = "utils/loadimg.php?img=$img"; // Source for DOM element
    array_push($sources, $src);
}

echo json_encode($sources);

?>
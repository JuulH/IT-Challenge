<?php

if (isset($_GET['dir'])) {
    $dir = $_GET['dir'];
    $filetypes = array('jpg', 'png', 'gif', 'jpeg', 'webp', 'svg', 'bmp', 'tiff');
    $user_uploads = array();

    foreach ($filetypes as $type) {
        $files = glob($dir . '*.' . $type);
        foreach ($files as $file) {
            array_push($user_uploads, basename($file));
        }
    }

    $sources = array();

    foreach ($user_uploads as $img) {
        $src = "loadimg.php?img=$img";
        array_push($sources, $src);
    }

    echo json_encode($sources);

} else {
    header('HTTP/1.0 404 Not Found');
}
?>
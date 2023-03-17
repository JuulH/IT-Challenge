<?php

if (isset($_GET['dir'])) {
    $dir = $_GET['dir'];
    $filetypes = array('jpg', 'png', 'gif', 'jpeg', 'webp', 'svg', 'bmp', 'tiff');
    $user_uploads = array();

    foreach ($filetypes as $type) {
        $user_uploads = array_merge($user_uploads, glob($dir . '*.' . $type));
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
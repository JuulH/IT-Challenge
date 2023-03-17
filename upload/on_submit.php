<?php

$max_size = 6; // megabytes

if(isset($_POST['submit']) && $_POST['session_id'] != ""){
    $session_id = htmlspecialchars($_POST['session_id']);
    $image = $_FILES["image"];
    $imageFileType = strtolower(pathinfo($image["name"], PATHINFO_EXTENSION));
    
    $parent_dir = dirname(__DIR__, 1);
    $target_dir = "$parent_dir/media/user-uploads/{$session_id}/"; // directory where the image will be uploaded
    $target_file = $target_dir . uniqid() . ".$imageFileType"; // If using image["name"], use basename() to remove path info

    $uploadOk = 1;

    // Error while uploading
    if ($image["error"] !== UPLOAD_ERR_OK) {
        echo "Sorry, there was an error uploading your file.\n";
        $uploadOk = 0;
    }

    // Check if file is an image
    $check = getimagesize($image["tmp_name"]);
    if($check === false) {
        echo "Sorry, file is not an image.\n";
        $uploadOk = 0;
    }

    // Allow only certain file formats
    if($imageFileType != "png" && $imageFileType != "jpg" && $imageFileType != "jpeg") {
        echo "Sorry, only PNG, JPG & JPEG allowed.\n";
        $uploadOk = 0;
    }

    // Check if file already exists
    if (file_exists($target_file)) {
        echo "Sorry, file already exists.\n";
        $uploadOk = 0;
    }

    // Check file size
    if ($image["size"] > $max_size * 1024 * 1024) {
        echo "Sorry, file is too large.\n";
        $uploadOk = 0;
    }

    // If no issues, upload file to server
    if ($uploadOk == 0) {
        echo "Sorry, your file was not uploaded.\n";
    } else {
        
        if (!is_dir($target_dir)) {
            mkdir($target_dir, 0777, true);
        }

        if (move_uploaded_file($image["tmp_name"], $target_file)) {
            echo "The file " . basename($image["name"]) . " has been uploaded.";
        } else {
            echo "Sorry, there was an error uploading your file.";
        }
    }
}

header("Location: upload.php?id=$session_id");
?>

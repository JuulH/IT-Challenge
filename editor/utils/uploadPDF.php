<?php
if(isset($_FILES['pdf']) && isset($_GET['id'])) {
    move_uploaded_file(
        $_FILES['pdf']['tmp_name'], 
        dirname(__DIR__, 2) . "/media/user-designs/" . $_GET['id'] . ".pdf"
    );
} else {
    header('HTTP/1.0 404 Not Found');
}
?>
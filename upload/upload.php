<?php
    if (!isset($_GET['id'])) {
        header('HTTP/1.0 404 Not Found');
        exit;
    }
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Voeg uw foto's toe</title>
    <script src="https://kit.fontawesome.com/74cb3809fb.js" crossorigin="anonymous"></script>
    <script defer src="upload.js"></script>
    <link rel="stylesheet" href="upload.css">
    <link rel="icon" href="../media/website/favicon.png" type="image/x-icon">
</head>

<body>
    <main>
        <form id="form" action="on_submit.php" method="POST" enctype="multipart/form-data">
            <input required type="hidden" name="session_id" value="<?php echo $_GET['id'];?>">

            <?php
                $icon = "fas fa-cloud-upload";
                if(isset($_GET['error'])) {
                    $icon = "fas fa-times-circle error";
                } else if (isset($_GET['success'])) {
                    $icon = "fas fa-check-circle success";
                }
            ?>

            <label for="image" id="image-upload">
                <span class="<?php echo $icon; ?>"></span>

                <p>Klik om uw foto's toe te voegen</p>

                <div id="upload-status">
                    <?php 
                        if (isset($_GET['error'])) {
                            echo "<p class='error'>Sorry, er is iets fout gegaan. Probeer het opnieuw.</p>";
                        }

                        if (isset($_GET['success'])) {
                            echo "<p class='success'>Uw foto's zijn succesvol geüpload. Nog een uploaden?</p>";
                        }
                    ?>
                </div>
            </label>
            <input hidden required multiple type="file" id="image" name="images[]" accept="image/*">

        </form>
    </main>
</body>
</html>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Voeg uw foto's toe</title>
    <script src="https://kit.fontawesome.com/74cb3809fb.js" crossorigin="anonymous"></script>
    <link rel="stylesheet" href="upload.css">
</head>

<body>
    <main>
        <form action="on_submit.php" method="POST" enctype="multipart/form-data">
            <input type="hidden" name="session_id" value="<?php echo $_GET['id'];?>">
        
            <label for="image">Image</label>
            <input required type="file" id="image" name="image" accept="image/*">
        
            <input type="submit" name="submit" value="Foto uploaden">
        </form>
    </main>
</body>
</html>
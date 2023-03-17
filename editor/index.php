<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Femke Reuvers - IT Challenge</title>
    <script src="https://cdn.jsdelivr.net/npm/fabric"></script>
    <script defer src="canvas.js"></script>
    <script src="https://kit.fontawesome.com/74cb3809fb.js" crossorigin="anonymous"></script>
    <script src="https://cdn.rawgit.com/davidshimjs/qrcodejs/gh-pages/qrcode.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
    <link rel="stylesheet" href="canvas.css">
</head>

<?php
$session_id = uniqid();
?>

<body>
    <main>
        <div id="toolbar" class="ui-element">
            <!-- Shape picker -->
            <div class="ui-expand-container">
                <button onclick="ToggleHide('shape-dropdown', DropdownArrow, true);" class="toolbar-item"><span class="fa-solid fa-shapes"><span class="toolbar-more fa-solid fa-angle-right"></span></span></button>
                <div id="shape-dropdown" class="ui-element ui-expand hidden">
                    <button onclick="AddSquare();" class="toolbar-item"><span class="fa-solid fa-square"></span></button>
                    <button onclick="AddCircle();" class="toolbar-item"><span class="fa-solid fa-circle"></span></button>
                    <button onclick="AddTriangle();" class="toolbar-item"><span class="fa-solid fa-play"></span></button>
                </div>
            </div>

            <!-- Text -->
            <button onclick="AddText();" class="toolbar-item"><span class="fa-solid fa-t"></span></button>

            <!-- Images -->
            <div class="ui-expand-container">
                <?php 
                $img_dir = "../media/user-uploads/$session_id/";
                $upload_link = "https://informaticaserver.ucis.nl/nc_designer/upload/upload.php?id=$session_id";
                ?>
                <button onclick="ToggleHide('image-dropdown', false, true);" class="toolbar-item"><span class="fa-solid fa-image"></span></button>
                <div id="image-dropdown" class="ui-element ui-expand hidden">
                    
                    <div id="gallery-header">
                        <p id="gallery-title">Fotogalerij</p>
                        <div id="gallery-buttons">
                            <button onclick="ToggleHide('qrcode-container')"><span class="fa-solid fa-plus"></span></button>
                            <button onclick="LoadImagesFromServer('images-container', 'image-button', 'image-single', '<?php echo $img_dir ?>')"><span class="fa-solid fa-arrows-rotate"></span></button>
                        </div>
                    </div>

                    <div id="qrcode-container">
                        <div id="qrcode" onclick="window.open('<?php echo $upload_link ?>', '_blank')"></div>
                        <a target="_blank" href="<?php echo $upload_link ?>" id="upload-link"></a>
                        <p id="qrcode-title">Scan deze QR-code om uw foto's toe te voegen</p>
                    </div>

                    <script type="text/javascript">
                        new QRCode(document.getElementById("qrcode"), {
                            text: "<?php echo $upload_link ?>",
                            width: 128,
                            height: 128,
                        });
                    </script>

                    <div id="images-container"></div>
                </div>
            </div>

            <!-- Stickers -->
            <div class="ui-expand-container">
                <button onclick="ToggleHide('sticker-dropdown', false, true);" class="toolbar-item"><span class="fa-solid fa-note-sticky"></span></button>
                <div id="sticker-dropdown" class="ui-element ui-expand hidden">
                    <div id="sticker-header">
                        <p id="sticker-title">Stickers</p>
                    </div>

                    <div id="sticker-container"></div>
                </div>
            </div>

            <!-- Trash -->
            <div id="trash-container" class="ui-expand-container">
                <button onclick="Unhide('confirm-delete', false, true);" id="trash" class="toolbar-item"><span class="fa-solid fa-trash"></span></button>
                <div id="confirm-delete" class="ui-element ui-expand hidden">
                    <button onclick="DeleteObject();" class="toolbar-item"><span class="fa-solid fa-check"></span></button>
                    <button onclick="Hide('confirm-delete');" class="toolbar-item"><span class="fa-solid fa-times"></span></button>
                </div>
            </div>

            <!-- Color picker -->
            <div id="color-container" class="ui-expand-container">
                <button onclick="ToggleHide('color-picker', OpenPicker, true);" id="color" class="toolbar-item"><span class="fa-solid fa-circle-dot"></span></button>
                <div id="color-picker" class="ui-element ui-expand hidden">
                    <input type="color" id="color-input" value="#000000">
                </div>
            </div>
            
        </div>

        <canvas id="canvas" width="500" height="500"></canvas>
    </main>
</body>
</html>
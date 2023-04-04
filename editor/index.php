<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Femke Reuvers - IT Challenge</title>

    <script src="https://cdn.jsdelivr.net/npm/fabric"></script>
    <script src="https://kit.fontawesome.com/74cb3809fb.js" crossorigin="anonymous"></script>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
    <script src="https://cdn.rawgit.com/davidshimjs/qrcodejs/gh-pages/qrcode.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/alwan/dist/css/alwan.min.css">
    <script src="https://cdn.jsdelivr.net/npm/alwan/dist/js/alwan.min.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.3/jquery.min.js"></script>

    <script defer src="canvas.js"></script>
    <script defer src="tools.js"></script>
    <script defer src="exportPDF.js"></script>
    <script defer src="pages.js"></script>

    <link rel="stylesheet" href="canvas.css">
    <link rel="icon" href="../media/website/favicon.png" type="image/x-icon">
</head>

<?php
$session_id = uniqid();
?>

<body data-session-id="<?php echo $session_id ?>">
    <main>
        <div id="toolbar" class="ui-element">
            
            <!-- Shape picker -->
            <div class="ui-expand-container">
                <button onclick="ToggleHide('shape-dropdown', false, true);" class="toolbar-item"><span class="fa-solid fa-shapes"></span></button>
                <p class="toolbar-item-title">Vormen</p>
                <div id="shape-dropdown" class="ui-element ui-expand hidden ui-expand-top">
                    <button onclick="AddSquare();" class="toolbar-item clickable"><span class="fa-solid fa-square"></span></button>
                    <button onclick="AddCircle();" class="toolbar-item clickable"><span class="fa-solid fa-circle"></span></button>
                    <button onclick="AddTriangle();" class="toolbar-item clickable"><span class="fa-solid fa-play"></span></button>
                </div>
            </div>

            <!-- Text -->
            <div class="ui-expand-container">
                <button onclick="AddText();" class="toolbar-item clickable"><span class="fa-solid fa-t"></span></button>
                <p class="toolbar-item-title">Tekst</p>
            </div>

            <!-- Images -->
            <div class="ui-expand-container">
                <?php 
                $upload_link = "https://informaticaserver.ucis.nl/nc_designer/upload/upload.php?id=$session_id";
                ?>

                <button onclick="ToggleHide('image-dropdown', false, true);" class="toolbar-item"><span class="fa-solid fa-image"></span></button>
                <p class="toolbar-item-title">Foto's</p>

                <div id="image-dropdown" class="ui-element ui-expand ui-element-big hidden">
                    
                    <div class="gallery-header">
                        <p class="gallery-title">Fotobibliotheek</p>
                        <div class="gallery-buttons">
                            <button onclick="Hide('image-dropdown')"><span class="fa-solid fa-xmark"></span></button>
                        </div>
                    </div>

                    <div id="qrcode-container">
                        <div id="qrcode" onclick="window.open('<?php echo $upload_link ?>', '_blank')"></div>
                        <a hidden target="_blank" href="<?php echo $upload_link ?>" id="upload-link"></a>
                        <p id="qrcode-title">Scan deze QR-code om uw foto's toe te voegen</p>
                    </div>

                    <script type="text/javascript">
                        new QRCode(document.getElementById("qrcode"), {
                            text: "<?php echo $upload_link ?>",
                            width: 136,
                            height: 136,
                        });
                    </script>

                    <div id="images-container"></div>
                </div>
            </div>

            <script>
            setInterval(function() { 
                LoadImagesFromServer('images-container', 'image-button', 'image-single', false, '<?php echo $session_id ?>');
            }, 1500);
            </script>

            <!-- Stickers -->
            <div class="ui-expand-container">
                <button onclick="ToggleHide('sticker-dropdown', false, true);" class="toolbar-item"><span class="fa-solid fa-note-sticky"></span></button>
                <p class="toolbar-item-title">Stickers</p>
                <div id="sticker-dropdown" class="ui-element ui-expand ui-element-big hidden">
                    <div class="gallery-header">
                        <p class="gallery-title">Stickers</p>
                        <div class="gallery-buttons">
                            <button onclick="Hide('sticker-dropdown')"><span class="fa-solid fa-xmark"></span></button>
                        </div>
                    </div>

                    <div id="sticker-container"></div>
                </div>
            </div>

            <!-- Color picker -->
            <div class="ui-expand-container">
                <div id="color-container" class="ui-expand-container">
                    <button onclick="alwan.toggle();" id="color" class="toolbar-item"><span class="fa-solid fa-circle-dot"></span></button>
                    <div id="color-picker"></div>
                </div>
                <p class="toolbar-item-title">Kleur</p>
            </div>

            <!-- Alignment -->
            <div id="align-container" class="ui-expand-container">
                <button onclick="ToggleHide('align-dropdown', false, true);" id="align" class="toolbar-item">
                    <span class="material-symbols-outlined">align_horizontal_left</span>
                </button>
                <p class="toolbar-item-title">Uitlijnen</p>

                <div id="align-dropdown" class="ui-element ui-expand ui-element-big hidden">
                    <div id="align-left-to-right">
                        <button onclick="AlignObject('left');" class="toolbar-item align-btn clickable"><span class="material-symbols-outlined">align_horizontal_left</span></button>
                        <button onclick="AlignObject('center');" class="toolbar-item align-btn clickable"><span class="material-symbols-outlined">align_horizontal_center</span></button>
                        <button onclick="AlignObject('right');" class="toolbar-item align-btn clickable"><span class="material-symbols-outlined">align_horizontal_right</span></button>
                    </div>
                    <div id="align-top-to-bottom">
                        <button onclick="AlignObject('top');" class="toolbar-item align-btn clickable"><span class="material-symbols-outlined">align_vertical_top</span></button>
                        <button onclick="AlignObject('middle');" class="toolbar-item align-btn clickable"><span class="material-symbols-outlined">align_vertical_center</span></button>
                        <button onclick="AlignObject('bottom');" class="toolbar-item align-btn clickable"><span class="material-symbols-outlined">align_vertical_bottom</span></button>
                    </div>
                </div>
            </div>

            <!-- Trash -->
            <div id="trash-container" class="ui-expand-container">
                <button onclick="Unhide('confirm-delete', false, true);" id="trash" class="toolbar-item"><span class="fa-solid fa-trash"></span></button>
                <p class="toolbar-item-title">Verwijderen</p>
                <div id="confirm-delete" class="ui-element ui-expand hidden">
                    <button onclick="DeleteObject();" class="toolbar-item clickable"><span class="fa-solid fa-check"></span></button>
                    <button onclick="Hide('confirm-delete');" class="toolbar-item clickable"><span class="fa-solid fa-times"></span></button>
                </div>
            </div>
            
        </div>

        <canvas id="canvas" width="500" height="500"></canvas>

        <div id="right-container">
            <div id="pages-container" class="ui-element">
                <button onclick="PreviousPage()" class="toolbar-item"><span class="fa-solid fa-angle-up"></span></button>
                <div id="preview-container"></div>
                <button onclick="NextPage()" class="toolbar-item"><span class="fa-solid fa-angle-down"></span></button>
            </div>

            <button onclick="Unhide('confirm-save-container')" id="save-btn" class="btn-alt">Design afronden <span class="fa-solid fa-arrow-right"></span></button>
        </div>

        <div id="confirm-save-container" class="hidden">
            <div id="confirm-save">
                <p>Weet u zeker dat uw design klaar is?</p>
                <p>U kunt deze hierna niet meer bewerken.</p>
                <div id="confirm-save-buttons">
                    <button onclick="Hide('confirm-save-container', exportPDF, false)" class="toolbar-item"><span class="fa-solid fa-check"></span></button>
                    <button onclick="Hide('confirm-save-container');" class="toolbar-item"><span class="fa-solid fa-times"></span></button>
                </div>
            </div>
        </div>

        <div id="loading-overlay" class="hidden">
            <div id="loading-container">
                <span class="loader"></span>
                <p id="loading-text">Uw kaart wordt verwerkt...</p>
            </div>

            <div id="completion-container" class="hidden">
                <a href="https://www.femkereuvers.shop/" id="completion-logo-container">
                    <img src="../media/website/logo_met_onderschrift.png" id="completion-logo" draggable="false">
                </a>
                <div id="card-preview-container"></div>
                <div id="completion-text-container">
                    <p id="completion-text">Uw kaart is succesvol verwerkt.</p>
                    <p id="completion-text">U kunt deze nu downloaden of een nieuwe kaart maken.</p>
                    <p id="completion-text">Bedankt voor het winkelen bij Femke Reuvers!</p>
                </div>
                <div id="completion-buttons">
                    <button onclick="location.reload();" class="btn-alt">Nieuwe kaart maken</button>
                    <button onclick="DownloadPDF();" class="btn-alt">Download kaart als PDF</button>
                </div>
            </div>
        </div>

    </main>
</body>
</html>
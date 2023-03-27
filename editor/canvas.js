// Get DOM elements
const DOMCanvas = document.getElementById('canvas');
const toolbar = document.getElementById('toolbar');
const qrcode_container = document.getElementById('qrcode-container');

// Get page size (in pixels)
const pageWidth  = Math.max(document.documentElement.clientWidth,  window.innerWidth  || 0);
const pageHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
const pageAspectRatio = pageWidth / pageHeight;

// Usable canvas size (in pixels)
const canvasInset = 100; // Margin around canvas (in pixels)
const canvasWidth  = pageWidth - toolbar.offsetWidth - parseFloat(getComputedStyle(toolbar)['margin-right']) - canvasInset;
const canvasHeight = pageHeight - canvasInset;  

// Create canvas & configuration
const canvas = new fabric.Canvas('canvas', {
    width: canvasWidth,
    height: canvasHeight,
    preserveObjectStacking: true
});

// Postcard size (in mm)
let postcardWidth = 135;
let postcardHeight = 135;
const postcardMargins = 3; // Cutting margins (in mm)
postcardWidth += postcardMargins * 2;
postcardHeight += postcardMargins * 2;
const aspectRatio = postcardWidth / postcardHeight;

const PPI = 300; // Pixels per inch (300 is standard for printing)
const mmToInch = 1 / 25.4;

let cssWidth = canvasWidth;
let cssHeight = canvasHeight;

if(aspectRatio >= pageAspectRatio) {
    // Postcard is wider than page
    cssHeight = canvasWidth / aspectRatio;
} else {
    // Postcard is taller than page
    cssWidth = canvasHeight * aspectRatio;
}

// Set canvas size
canvas.setWidth(postcardWidth * mmToInch * PPI);
canvas.setHeight(postcardHeight * mmToInch * PPI);

// Set canvas CSS size
canvas.setDimensions({width: `${cssWidth}px`, height: `${cssHeight}px`}, {cssOnly: true});

// Load images from server using AJAX
let activeImages = [];

function LoadImagesFromServer(target, buttonClass, imageClass, dir, sticker, sessionId) {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "refresh-images.php?dir=" + dir);
    xhr.onload = function () {
        if (xhr.status === 200) {
            let images = JSON.parse(xhr.responseText); // Parse the JSON string into an object
            if (images.length != 0 && !images.every((val, i) => val === activeImages[i])) {
                let imagesContainer = document.getElementById(target);
                if (imagesContainer.classList.contains("images-container")) { qrcode_container.classList.add("hidden") };

                images.forEach(image => { // Create DOM elements
                    if (activeImages.includes(image)) { return; }

                    if (sticker) {
                        image += "&sticker=true";
                    } else {
                        image += "&id=" + sessionId;
                    }

                    let button = document.createElement("button");
                    button.classList.add(buttonClass);
                    button.addEventListener("click", function () { AddImage(image); });

                    let img = document.createElement("img");
                    img.classList.add(imageClass);
                    img.src = image;
                    button.appendChild(img);

                    imagesContainer.appendChild(button);
                });

                activeImages = images;
            }
        } else {
            alert("Error " + xhr.status + ": " + xhr.statusText);
        }
    };
    xhr.send();
}

LoadImagesFromServer('sticker-container', 'image-button', 'sticker-single', '../media/stickers/', true);
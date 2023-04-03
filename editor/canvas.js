// Get DOM elements
const DOMCanvas = document.getElementById('canvas');
const toolbar = document.getElementById('toolbar');
const qrcode_container = document.getElementById('qrcode-container');
const save_btn = document.getElementById('save-btn');

// Get page size (in pixels)
const pageWidth  = Math.max(document.documentElement.clientWidth,  window.innerWidth  || 0);
const pageHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
const pageAspectRatio = pageWidth / pageHeight;

// Usable canvas size (in pixels)
const canvasInset = 100; // Margin around canvas (in pixels)
const canvasWidth  = pageWidth - toolbar.offsetWidth - parseFloat(getComputedStyle(toolbar)['margin-right']) - canvasInset - save_btn.offsetWidth - 200;
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
// toolbar.style.height = `calc(${cssHeight}px - 1.5rem)`;

let sessionId = document.body.getAttribute('data-session-id');

// Alwan color picker
let swatches = [
    '#000000', '#333333', '#666666', '#999999', '#CCCCCC', '#FFFFFF',
    '#3d0000', '#7a0000', '#ff0000', '#b85000', '#ff6f00', '#e5ff00',
    '#115201', '#219e02', '#33ff00', '#00ffa2', '#02dcf0', '#00aade',
    '#6800de', '#3800b0', '#2b0173', '#001b52', '#003882', '#00568f',
];

const alwan = new Alwan('#color', {
    theme: 'light',
    toggle: true,
    popover: true,
    position: 'right',
    margin: 20,
    preset: false, // Use custom button
    color: '#000',
    default: '#000',
    target: 'color', // On which element the picker will be appended
    disabled: false,
    format: 'hex', // Output format of color
    singleInput: false,
    inputs: {}, // Allow Hex, RGB, HSL inputs
    opacity: false, // Show/Hide opacity slider
    preview: true, // Show a preview of the color
    copy: false, // Copy the color to clipboard
    swatches: swatches,
    toggleSwatches: false,
    shared: false, // Shared between multiple instances

});

// Load images from server using AJAX
let activeImages = [];

function LoadImagesFromServer(target, buttonClass, imageClass, sticker, sessionId) {
    let xhr = new XMLHttpRequest();
    if (sticker) {
        xhr.open("GET", "utils/refresh-images.php?sticker=" + true);
    } else {
        xhr.open("GET", "utils/refresh-images.php?id=" + sessionId);
    }
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

LoadImagesFromServer('sticker-container', 'image-button', 'sticker-single', true);
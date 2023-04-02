// Get DOM elements
const DOMCanvas = document.getElementById('canvas');
const toolbar = document.getElementById('toolbar');
const qrcode_container = document.getElementById('qrcode-container');
const preview_container = document.getElementById('preview-container');

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
// toolbar.style.height = `calc(${cssHeight}px - 1.5rem)`;

let sessionId = document.body.getAttribute('data-session-id');

swatches = ['#000000', '#333333', '#666666', '#999999', '#CCCCCC', '#FFFFFF', '#1f77b4', '#2ca02c', '#ff7f0e', '#d62728', '#9467bd', '#8c564b', '#1e90ff', '#00bfff', '#00ced1', '#00ff7f', '#adff2f', '#ffd700', '#ff6347', '#ff4500', '#ffa07a', '#ff69b4', '#dc143c', '#a52a2a', '#008080', '#3cb371', '#32cd32', '#228b22', '#808000', '#556b2f', '#ffa500', '#ffdab9', '#f0e68c', '#fafad2', '#ffff00', '#d2b48c'];

const alwan = new Alwan('#color', {
    theme: 'light',
    toggle: true,
    popover: true,
    position: 'right',
    // Set the gap (in pixels) between the picker container and the reference element.
    margin: 20,
    // Replace the reference element with a pre-styled button.
    //  In case you set the preset to false (using your own reference element), 
    // to access the color to change its background or any other property, 
    // add the css custom property to your styles --tw-color.
    preset: false,
    // Initial color.
    color: '#000',
    // Default color.
    default: '#000',
    // Target can be a selector or an HTML element,
    // If the option popover is true, the picker container will be positionned retalive to this element,
    // instead of the reference element.
    // else if popover option is false, the picker container will be appended as a child into this element.
    target: 'color',
    disabled: false,
    format: 'hex',
    singleInput: false,
    inputs: {},
    opacity: false,
    preview: true,
    copy: false,
    // Array of color strings, invalid color strings will default to rgb(0,0,0).
    swatches: swatches,
    // Show/Hide swatches container (Make swatches container collapsible).
    toggleSwatches: false,
    // Picker widget shared between multiple instance (this is good if you have many color picker instances).
    shared: false,

});

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
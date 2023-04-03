// Get DOM elements
const colorPicker = document.getElementById('color-input');
const colorExpand = document.getElementById('color-picker');
const colorContainer = document.getElementById('color-container');
const colorIcon = document.getElementById('color');
const trash = document.getElementById('trash-container');
const trashChildren = Array.from(trash.getElementsByTagName("*"));
const colorChildren = Array.from(colorContainer.getElementsByTagName("*"));
const alignContainer = document.getElementById('align-container');
const alignChildren = Array.from(alignContainer.getElementsByTagName("*"));

// UI Controls
function ToggleHide(element, fn, hideAll) {
    let elementToHide = document.getElementById(element);
    elementToHide.classList.toggle('hidden');

    if (hideAll) {
        let elementsToHide = document.getElementsByClassName('ui-expand');
        for (element of elementsToHide) {
            if (element.id != elementToHide.id) {
                element.classList.add('hidden');
            }
        }
    }

    if (fn) {
        fn();
    }
}

function Unhide(element, fn, hideAll) {
    let elementToHide = document.getElementById(element);
    elementToHide.classList.remove('hidden');

    if (hideAll) {
        let elementsToHide = document.getElementsByClassName('ui-expand');
        for (element of elementsToHide) {
            if (element.id != elementToHide.id) {
                element.classList.add('hidden');
            }
        }
    }

    if (fn) {
        fn();
    }
}

function Hide(element, fn, hideAll) {
    let elementToHide = document.getElementById(element);
    elementToHide.classList.add('hidden');

    if (hideAll) {
        let elementsToHide = document.getElementsByClassName('ui-expand');
        for (element of elementsToHide) {
            if (element.id != elementToHide.id) {
                element.classList.add('hidden');
            }
        }
    }

    if (fn) {
        fn();
    }
}

// Alwan color picker
let swatches = [
    '#000000', '#333333', '#666666', '#999999', '#CCCCCC', '#FFFFFF',
    '#3d0000', '#7a0000', '#ff0000', '#b85000', '#ff6f00', '#e5ff00',
    '#115201', '#219e02', '#33ff00', '#00ffa2', '#02dcf0', '#00aade',
    '#6800de', '#3800b0', '#2b0173', '#001b52', '#003882', '#00568f',
];

const alwan = new Alwan('#color', {
    id: 'alwan-color-picker',
    theme: 'light',
    toggle: true,
    popover: true,
    position: 'right',
    margin: 25,
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

const alwanDOM = document.getElementsByClassName('alwan')[0];
const alwanChildren = Array.from(alwanDOM.getElementsByTagName("*"));

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
                    button.classList.add(buttonClass, 'clickable');
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

// Load stickers from server
LoadImagesFromServer('sticker-container', 'image-button', 'sticker-single', true);

// Align objects
function AlignObject(direction) {
    let selectedObjects = canvas.getActiveObjects();

    selectedObjects.forEach((object) => {
        let bounds = object.getBoundingRect();

        switch (direction) {
            case 'left':
                object.set('left', 0 + bounds.width / 2);
                break;
            case 'center':
                object.set('left', canvas.width / 2);
                break;
            case 'right':
                object.set('left', canvas.width - bounds.width / 2);
                break;
            case 'top':
                object.set('top', 0 + bounds.height / 2);
                break;
            case 'middle':
                object.set('top', canvas.height / 2);
                break;
            case 'bottom':
                object.set('top', canvas.height - bounds.height / 2);
                break;
        }
        object.setCoords();
    });

    canvas.renderAll();
}

// Add objects to canvas
function AddSquare() {
    let rect = new fabric.Rect({
        width: 200,
        height: 200,
        originX: 'center',
        originY: 'center',
        top: canvas.height / 2,
        left: canvas.width / 2,
        fill: `${currentColor}`,
    })
    canvas.add(rect);
    canvas.setActiveObject(canvas.item(canvas.getObjects().length - 1));
    canvas.renderAll();
    Hide('shape-dropdown');
} 

function AddCircle() {
    let circle = new fabric.Circle({
        radius: 100,
        originX: 'center',
        originY: 'center',
        top: canvas.height / 2,
        left: canvas.width / 2,
        fill: `${currentColor}`,
    })
    canvas.add(circle);
    canvas.setActiveObject(canvas.item(canvas.getObjects().length - 1));
    canvas.renderAll();
    Hide('shape-dropdown');
}

function AddTriangle() {
    let rect = new fabric.Triangle({
        width: 200,
        height: 200,
        originX: 'center',
        originY: 'center',
        top: canvas.height / 2,
        left: canvas.width / 2,
        fill: `${currentColor}`,
    })
    canvas.add(rect);
    canvas.setActiveObject(canvas.item(canvas.getObjects().length - 1));
    canvas.renderAll();
    Hide('shape-dropdown');
}

function AddText() {
    canvas.add(new fabric.IText('Dubbelklik om te typen', {
        fontFamily: 'Helvetica',
        originX: 'center',
        originY: 'center',
        left: canvas.width / 2,
        top: canvas.height / 2,
        fill: `${currentColor}`,
        fontSize: 90,
    }));
    canvas.setActiveObject(canvas.item(canvas.getObjects().length - 1));
    canvas.renderAll();
}

function AddImage(url) {
    fabric.Image.fromURL(url, function (img) {
        let imgWidth = img.width;
        let imgHeight = img.height;
        let aspectRatio = imgWidth / imgHeight;

        if (aspectRatio >= 1) {
            // Image is wider than it is tall
            img.scaleToWidth(canvas.width / 2);
        } else {
            // Image is taller than it is wide
            img.scaleToHeight(canvas.height / 2);
        }

        img.set({
            originX: 'center',
            originY: 'center',
            top: canvas.height / 2,
            left: canvas.width / 2,
        });

        canvas.add(img);
        canvas.setActiveObject(canvas.item(canvas.getObjects().length - 1));
        canvas.renderAll();
    });

    Hide('image-dropdown');
    Hide('sticker-dropdown');
}

// Delete objects
function DeleteObject() {
    Hide('confirm-delete');

    let selectedObjects = canvas.getActiveObjects();
    selectedObjects.forEach(object => {
        if (object.constructor === fabric.IText && object.isEditing) {
            return;
        }

        canvas.remove(object);
        canvas.discardActiveObject(); // Deselect objects
    });

    canvas.renderAll();
}

// Set color
let currentColor = 'black';
colorIcon.style.color = currentColor;

function SetColor(color) {
    currentColor = color;
    colorIcon.style.color = color;

    let activeObjects = canvas.getActiveObjects();
    activeObjects.forEach(object => {
        object.set({ fill: `${currentColor}` });
    });

    canvas.renderAll();
}

alwan.on('color', function (color) {
    SetColor(color.hex());
});

// Keyboard controls
document.addEventListener('keydown', (event) => {
    if (event.key == 'Delete' || event.key == 'Backspace') {
        DeleteObject();
    }

    if (event.key == 'ArrowUp') {
        canvas.bringForward(canvas.getActiveObject());
    } else if (event.key == 'ArrowDown') {
        canvas.sendBackwards(canvas.getActiveObject());
    }

});

// Custom object selection
fabric.Object.prototype.transparentCorners = false;
fabric.Object.prototype.cornerColor = 'blue';
fabric.Object.prototype.cornerStyle = 'circle';
fabric.Object.prototype.borderColor = 'blue';
fabric.Object.prototype.cornerSize = 20;
//fabric.Object.prototype.borderDashArray = [10, 5];

// Create layer icons
let layerUpIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.3.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path fill="${fabric.Object.prototype.cornerColor}" d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM377 271c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-87-87-87 87c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9L239 167c9.4-9.4 24.6-9.4 33.9 0L377 271z"/></svg>`;
let layerUpBlob = new Blob([layerUpIcon], { type: 'image/svg+xml;charset=utf-8' });
let layerUpImg = new Image();
layerUpImg.src = URL.createObjectURL(layerUpBlob);

let layerDownIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.3.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path fill="${fabric.Object.prototype.cornerColor}" d="M256 0a256 256 0 1 0 0 512A256 256 0 1 0 256 0zM135 241c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l87 87 87-87c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9L273 345c-9.4 9.4-24.6 9.4-33.9 0L135 241z"/></svg>`;
let layerDownBlob = new Blob([layerDownIcon], { type: 'image/svg+xml;charset=utf-8' });
let layerDownImg = new Image();
layerDownImg.src = URL.createObjectURL(layerDownBlob);

// Move layer up or down
function moveLayer(transform, forward) {
    let target = transform.target;
    let canvas = target.canvas;

    if (forward) {
        canvas.bringForward(target);
    } else {
        canvas.sendBackwards(target);
    }
}

// Create custom controls
fabric.Object.prototype.controls.layerUp = new fabric.Control({
    x: 0.5,
    y: 0,
    offsetX: 30,
    offsetY: -22,
    cursorStyle: 'pointer',
    mouseUpHandler: function(eventData, transform) { moveLayer(transform, true); },
    render: renderIcon(layerUpImg),
    cornerSize: 28
});

fabric.Object.prototype.controls.layerDown = new fabric.Control({
    x: 0.5,
    y: 0,
    offsetX: 30,
    offsetY: 22,
    cursorStyle: 'pointer',
    mouseUpHandler: function (eventData, transform) { moveLayer(transform, false); },
    render: renderIcon(layerDownImg),
    cornerSize: 28
});

function renderIcon(icon) {
    return function renderIcon(ctx, left, top, fabricObject) {
        let size = this.cornerSize;
        ctx.save();
        ctx.translate(left, top);
        ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
        ctx.drawImage(icon, -size / 2, -size / 2, size, size);
        ctx.restore();
    }
}

// Deselect object when clicking outside of canvas, except trash or color
document.addEventListener('mousedown', function(event) {
    if(event.target != canvas.upperCanvasEl && !trashChildren.includes(event.target) && !colorChildren.includes(event.target) && !alignChildren.includes(event.target) && !alwanChildren.includes(event.target)) {
        canvas.discardActiveObject();
        canvas.renderAll();
    }
});
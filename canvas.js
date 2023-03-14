// Get DOM elements
const DOMCanvas = document.getElementById('canvas');
const toolbar = document.getElementById('toolbar');
const shapeDropdownArrow = document.getElementsByClassName('toolbar-more')[0];
const colorPicker = document.getElementById('color-input');
const colorContainer = document.getElementById('color-picker');
const colorIcon = document.getElementById('color');

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

fabric.Object.prototype.transparentCorners = false;
fabric.Object.prototype.cornerColor = 'blue';
fabric.Object.prototype.cornerStyle = 'circle';
fabric.Object.prototype.borderColor = 'blue';

var layerUpIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.3.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path fill="${fabric.Object.prototype.cornerColor}" d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM377 271c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-87-87-87 87c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9L239 167c9.4-9.4 24.6-9.4 33.9 0L377 271z"/></svg>`;
var layerUpImg = document.createElement('img');
layerUpImg.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(layerUpIcon);

var layerDownIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.3.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path fill="${fabric.Object.prototype.cornerColor}" d="M256 0a256 256 0 1 0 0 512A256 256 0 1 0 256 0zM135 241c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l87 87 87-87c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9L273 345c-9.4 9.4-24.6 9.4-33.9 0L135 241z"/></svg>`;
var layerDownImg = document.createElement('img');
layerDownImg.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(layerDownIcon);

function moveLayer(transform, forward) {
    var target = transform.target;
    var canvas = target.canvas;

    if (forward) {
        canvas.bringForward(target);
    } else {
        canvas.sendBackwards(target);
    }
}

fabric.Object.prototype.controls.layerUp = new fabric.Control({
    x: 0.5,
    y: 0,
    offsetX: 16,
    offsetY: -24,
    cursorStyle: 'pointer',
    mouseUpHandler: function(eventData, transform) { moveLayer(transform, true); },
    render: renderIcon(layerUpImg),
    cornerSize: 24
});

fabric.Object.prototype.controls.layerDown = new fabric.Control({
    x: 0.5,
    y: 0,
    offsetX: 16,
    offsetY: 24,
    cursorStyle: 'pointer',
    mouseUpHandler: function (eventData, transform) { moveLayer(transform, false); },
    render: renderIcon(layerDownImg),
    cornerSize: 24
});

function renderIcon(icon) {
    return function renderIcon(ctx, left, top, fabricObject) {
        var size = this.cornerSize;
        ctx.save();
        ctx.translate(left, top);
        ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
        ctx.drawImage(icon, -size / 2, -size / 2, size, size);
        ctx.restore();
    }
}

// Postcard size (in mm)
const postcardMargins = 3; // Cutting margins around postcard (in mm)
let postcardWidth = 100;
let postcardHeight = 100;
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

// UI Control
function ToggleHide(element, fn, hideAll) {
    let elementToHide = document.getElementById(element);
    elementToHide.classList.toggle('hidden');

    if (hideAll) {
        let elementsToHide = document.getElementsByClassName('ui-expand');
        for (element of elementsToHide) {
            if (element.id != elementToHide.id) {
                element.classList.add('hidden');
                
                // Close dropdown arrow (slightly funky)
                let toolbarMore = element.previousElementSibling.firstChild.firstChild;
                if(toolbarMore && toolbarMore.classList.contains('toolbar-more')) {
                    element.previousElementSibling.firstChild.firstChild.classList.remove('fa-angle-left');
                    element.previousElementSibling.firstChild.firstChild.classList.add('fa-angle-right');
                }
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

                // Close dropdown arrow (slightly funky)
                let toolbarMore = element.previousElementSibling.firstChild.firstChild;
                if (toolbarMore && toolbarMore.classList.contains('toolbar-more')) {
                    element.previousElementSibling.firstChild.firstChild.classList.remove('fa-angle-left');
                    element.previousElementSibling.firstChild.firstChild.classList.add('fa-angle-right');
                }
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

                // Close dropdown arrow (slightly funky)
                let toolbarMore = element.previousElementSibling.firstChild.firstChild;
                if (toolbarMore && toolbarMore.classList.contains('toolbar-more')) {
                    element.previousElementSibling.firstChild.firstChild.classList.remove('fa-angle-left');
                    element.previousElementSibling.firstChild.firstChild.classList.add('fa-angle-right');
                }
            }
        }
    }

    if (fn) {
        fn();
    }
}

// Add shapes
function DropdownArrow() {
    shapeDropdownArrow.classList.toggle('fa-angle-right');
    shapeDropdownArrow.classList.toggle('fa-angle-left');
}

function AddSquare() {
    let rect = new fabric.Rect({
        width: 100,
        height: 100,
        originX: 'center',
        originY: 'center',
        top: canvas.height / 2,
        left: canvas.width / 2,
        fill: `${currentColor}`,
    })
    canvas.add(rect);
    canvas.renderAll();
    Hide('shape-dropdown', DropdownArrow);
}

function AddCircle() {
    let circle = new fabric.Circle({
        radius: 50,
        originX: 'center',
        originY: 'center',
        top: canvas.height / 2,
        left: canvas.width / 2,
        fill: `${currentColor}`,
    })
    canvas.add(circle);
    canvas.renderAll();
    Hide('shape-dropdown', DropdownArrow);
}

function AddTriangle() {
    let rect = new fabric.Triangle({
        width: 100,
        height: 100,
        originX: 'center',
        originY: 'center',
        top: canvas.height / 2,
        left: canvas.width / 2,
        fill: `${currentColor}`,
    })
    canvas.add(rect);
    canvas.renderAll();
    Hide('shape-dropdown', DropdownArrow);
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
    canvas.renderAll();
}

function AddImage(url) {
    fabric.Image.fromURL(url, function(img) {
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
        canvas.renderAll();
    });

    Hide('image-dropdown');
}

// Delete items
function DeleteObject() {
    Hide('confirm-delete');
    
    let selectedObjects = canvas.getActiveObjects();
    selectedObjects.forEach(object => {
        canvas.remove(object);
    });

    canvas.discardActiveObject(); // Deselect objects
    canvas.renderAll();
}

// Set color
let currentColor = 'black';
colorIcon.style.color = currentColor;

function OpenPicker() {
    setTimeout(() => {
        if (!colorContainer.classList.contains('hidden')) {
            colorPicker.focus();
            colorPicker.click();
        }
    }, 0);
}

function SetColor(color) {
    currentColor = color;
    colorIcon.style.color = color;

    let activeObjects = canvas.getActiveObjects();
    activeObjects.forEach(object => {
        object.set({ fill: `${currentColor}`});
    });

    canvas.renderAll();
}

colorPicker.addEventListener('input', (event) => {
    SetColor(event.target.value);
});

colorPicker.addEventListener('blur', () => {
    Hide('color-picker');
});
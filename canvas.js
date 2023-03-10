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

// Create canvas
const canvas = new fabric.Canvas('canvas', {
    width: canvasWidth,
    height: canvasHeight,
    preserveObjectStacking: false
});

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
function ToggleHide(element, fn) {
    let elementToHide = document.getElementById(element);
    elementToHide.classList.toggle('hidden');

    if (fn) {
        fn();
    }
}

function Unhide(element, fn) {
    let elementToHide = document.getElementById(element);
    elementToHide.classList.remove('hidden');

    if (fn) {
        fn();
    }
}

function Hide(element, fn) {
    let elementToHide = document.getElementById(element);
    elementToHide.classList.add('hidden');

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
    canvas.add(new fabric.IText('Tap and Type', { 
        fontFamily: 'Helvetica',
            originX: 'center',
            originY: 'center',
            left: canvas.width / 2,
            top: canvas.height / 2,
            fill: `${currentColor}`,
            fontSize: 100,
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
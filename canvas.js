// Get DOM elements
const DOMCanvas = document.getElementById('canvas');
const toolbar = document.getElementById('toolbar');
const shapeDropdown = document.getElementById('shape-dropdown');
const shapeDropdownArrow = document.getElementsByClassName('toolbar-more')[0];
const confirmDelete = document.getElementById('confirm-delete');
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

// Add shapes
function ToggleDropdown() {
    shapeDropdown.classList.toggle('hidden');
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
    ToggleDropdown();
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
    ToggleDropdown();
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
    ToggleDropdown();
}

function AddText() {
    canvas.add(new fabric.IText('Tap and Type', { 
        fontFamily: 'Comic Sans MS',
            originX: 'center',
            originY: 'center',
            left: canvas.width / 2,
            top: canvas.height / 2,
            fill: `${currentColor}`,
    }));
}

// Delete items
function ConfirmDelete() {
    confirmDelete.classList.remove('hidden');
}

function DeleteItem() {
    canvas.remove(canvas.getActiveObject());
    confirmDelete.classList.add('hidden');
}

function CancelDelete() {
    confirmDelete.classList.add('hidden');
}

// Set color
let currentColor = 'black';
colorIcon.style.color = currentColor;

function SelectColor() {
    colorContainer.classList.toggle('hidden');
    if (!colorContainer.classList.contains('hidden')) {
        colorPicker.focus();
        colorPicker.click();
    }
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
    colorContainer.classList.add('hidden');
});
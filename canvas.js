// Get DOM elements
const DOMCanvas = document.getElementById('canvas');
const toolbar = document.getElementById('toolbar');
const shapeDropdown = document.getElementById('shape-dropdown');
const shapeDropdownArrow = document.getElementsByClassName('toolbar-more')[0];
const confirmDelete = document.getElementById('confirm-delete');

// Set canvas size
const pageWidth  = Math.max(document.documentElement.clientWidth,  window.innerWidth  || 0);
const pageHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);  

const canvasWidth  = pageWidth - toolbar.offsetWidth - parseFloat(getComputedStyle(toolbar)['margin-left']);
const canvasHeight = pageHeight;  

const canvas = new fabric.Canvas('canvas', {
    width: canvasWidth,
    height: canvasHeight
});

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
        fill: 'red',
    })
    canvas.add(rect);
}

function AddCircle() {
    let circle = new fabric.Circle({
        radius: 50,
        originX: 'center',
        originY: 'center',
        top: canvas.height / 2,
        left: canvas.width / 2,
        fill: 'red',
    })
    canvas.add(circle);
}

function AddTriangle() {
    let rect = new fabric.Triangle({
        width: 100,
        height: 100,
        originX: 'center',
        originY: 'center',
        top: canvas.height / 2,
        left: canvas.width / 2,
        fill: 'red',
    })
    canvas.add(rect);
}

function AddText() {
    canvas.add(new fabric.IText('Tap and Type', { 
        fontFamily: 'Comic Sans MS',
            originX: 'center',
            originY: 'center',
            left: canvas.width / 2,
            top: canvas.height / 2,
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
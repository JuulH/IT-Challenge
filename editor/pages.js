const previewContainer = document.getElementById('preview-container');

let maxPages = 3;
let pages = new Array(maxPages);
let ctxs = new Array(maxPages);
let activePage = 0;
let loading = false;

function LoadPage(i) {
    loading = true;
    UpdatePreview();
    pages[activePage] = canvas.toJSON();
    
    if (pages[i]) {
        canvas.loadFromJSON(pages[i]);
    } else {
        canvas.clear();
    }

    activePage = i;
    loading = false;
}

// Create canvases
const previewWidth = 150;
const previewHeight = 150;

for (let i = 0; i < maxPages; i++) {
    let pCanvas = document.createElement('canvas');
    pCanvas.width = previewWidth;
    pCanvas.height = previewHeight;
    
    let pButton = document.createElement('div');
    pButton.onclick = () => LoadPage(i);
    pButton.className = 'preview-button';
    pButton.appendChild(pCanvas);
    previewContainer.appendChild(pButton);

    ctxs[i] = pCanvas.getContext('2d');
    ctxs[i].fillStyle = "#ffffff";
    ctxs[i].fillRect(0, 0, previewWidth, previewHeight);
}

function HideControls() {
    let activeObject = canvas.getActiveObject();
    if(activeObject) {
        activeObject.hasControls = false;
        activeObject.hasBorders = false;
        canvas.renderAll();
    }
}

function ShowControls() {
    let activeObject = canvas.getActiveObject();
    if (activeObject) {
        activeObject.hasControls = true;
        activeObject.hasBorders = true;
        canvas.renderAll();
    }
}

function UpdatePreview() {
    if (loading) return;
    // Set background
    ctxs[activePage].clearRect(0, 0, previewWidth, previewHeight);
    ctxs[activePage].fillStyle = "#ffffff";
    ctxs[activePage].fillRect(0, 0, previewWidth, previewHeight);

    HideControls();
    canvas.renderAll();
    ctxs[activePage].drawImage(canvas.lowerCanvasEl, 0, 0, previewWidth, previewHeight); // Copy canvas to preview
    ShowControls();
}

// For a full list of events, see https://github.com/fabricjs/fabric.js/wiki/Working-with-events or http://fabricjs.com/docs/fabric.Canvas.html#events
canvas.on({
    'object:modified': UpdatePreview,
    'object:added': UpdatePreview,
    'object:removed': UpdatePreview,
});

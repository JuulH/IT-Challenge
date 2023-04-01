const previewContainer = document.getElementById('preview-container');

let maxPages = 3;
let pages = new Array(maxPages);
let ctxs = new Array(maxPages);
let activePage = 0;
let loading = false;

const pageDescriptors = [
    "Voor",
    "Links",
    "Rechts",
    "Achter"
];

const factor = 10;
const previewWidth = cssWidth / factor;
const previewHeight = cssHeight / factor;

function LoadPage(i) {
    loading = true;
    UpdatePreview();
    pages[activePage] = canvas.toJSON();
    
    if (pages[i]) {
        canvas.loadFromJSON(pages[i]);
    } else {
        canvas.clear();
    }

    ctxs[activePage].canvas.parentElement.classList.remove('active');
    ctxs[i].canvas.parentElement.classList.add('active');

    activePage = i;
    loading = false;
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

// Create canvases
if (maxPages > 1) {
    for (let i = 0; i < maxPages; i++) {
        let pCanvas = document.createElement('canvas');
        pCanvas.width = previewWidth;
        pCanvas.height = previewHeight;

        let pButton = document.createElement('div');
        pButton.onclick = () => LoadPage(i);
        pButton.className = 'preview-button';
        pButton.appendChild(pCanvas);
        pButton.setAttribute('data-tooltip', pageDescriptors[i]);
        previewContainer.appendChild(pButton);

        ctxs[i] = pCanvas.getContext('2d');
        ctxs[i].fillStyle = "#ffffff";
        ctxs[i].fillRect(0, 0, previewWidth, previewHeight);
    }

    // For a full list of events, see https://github.com/fabricjs/fabric.js/wiki/Working-with-events or http://fabricjs.com/docs/fabric.Canvas.html#events
    canvas.on({
        'object:modified': UpdatePreview,
        'object:added': UpdatePreview,
        'object:removed': UpdatePreview,
        'object:moving': UpdatePreview,
        'object:scaling': UpdatePreview,
        'object:rotating': UpdatePreview,
        'object:skewing': UpdatePreview,
    });
}

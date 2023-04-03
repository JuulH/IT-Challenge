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

const factor = 5;
const cssFactor = 1.9;
const previewWidth = cssWidth / factor;
const previewHeight = cssHeight / factor;

// Cutting lines
const cuttingLineOptions = {
    stroke: 'blue',
    strokeWidth: 3,
    strokeDashArray: [5, 5],
    selectable: false,
    evented: false,
    opacity: 0.5,
};

const insetPixels = postcardMargins * mmToInch * PPI;
const cuttingLineTop = new fabric.Line([0, insetPixels, canvas.width, insetPixels], cuttingLineOptions);
const cuttingLineBottom = new fabric.Line([0, canvas.height - insetPixels, canvas.width, canvas.height - insetPixels], cuttingLineOptions);
const cuttingLineLeft = new fabric.Line([insetPixels, 0, insetPixels, canvas.height], cuttingLineOptions);
const cuttingLineRight = new fabric.Line([canvas.width - insetPixels, 0, canvas.width - insetPixels, canvas.height], cuttingLineOptions);

const cuttingLineLayer = new fabric.Group([cuttingLineTop, cuttingLineBottom, cuttingLineLeft, cuttingLineRight], {
    selectable: false,
    evented: false,
});

canvas.add(cuttingLineLayer);

function LoadPage(i) {
    loading = true;
    canvas.remove(cuttingLineLayer);
    UpdatePreview();
    pages[activePage] = canvas.toJSON(); // Save current page
    
    if (pages[i]) {
        canvas.loadFromJSON(pages[i]);
    } else {
        canvas.clear();
    }

    ctxs[activePage].canvas.parentElement.classList.remove('active');
    ctxs[i].canvas.parentElement.classList.add('active');

    canvas.add(cuttingLineLayer);

    activePage = i;
    loading = false;
}

function PreviousPage() {
    if (activePage > 0) {
        LoadPage(activePage - 1);
    }
}

function NextPage() {
    if (activePage < maxPages - 1) {
        LoadPage(activePage + 1);
    }
}

// Hide controls when rendering preview
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
    cuttingLineLayer.visible = false;
    canvas.renderAll();
    ctxs[activePage].drawImage(canvas.lowerCanvasEl, 0, 0, previewWidth, previewHeight); // Copy canvas to preview
    ShowControls();
    cuttingLineLayer.visible = true;
}

// Create canvases
if (maxPages > 1) {
    for (let i = 0; i < maxPages; i++) {
        let pCanvas = document.createElement('canvas');
        pCanvas.width = previewWidth;
        pCanvas.height = previewHeight;

        pCanvas.style.width = previewWidth / cssFactor + 'px';
        pCanvas.style.height = previewHeight / cssFactor + 'px';

        let pButton = document.createElement('div');
        pButton.onclick = () => LoadPage(i);
        pButton.className = 'preview-button';
        if(i == 0) pButton.classList.add('active');
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

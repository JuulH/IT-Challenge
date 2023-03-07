const DOMCanvas = document.getElementById('canvas');
const toolbar = document.getElementById('toolbar');

const pageWidth  = Math.max(document.documentElement.clientWidth,  window.innerWidth  || 0);
const pageHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);  

const canvasWidth  = pageWidth - toolbar.offsetWidth - parseFloat(getComputedStyle(toolbar)['margin-left']);
const canvasHeight = pageHeight;  

const canvas = new fabric.Canvas('canvas', {
    width: canvasWidth,
    height: canvasHeight
});


function AddRect() {
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

function AddText() {
    canvas.add(new fabric.IText('Tap and Type', { 
        fontFamily: 'Comic Sans MS',
            originX: 'center',
            originY: 'center',
            left: canvas.width / 2,
            top: canvas.height / 2,
    }));
}
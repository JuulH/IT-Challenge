const pageWidth  = Math.max(document.documentElement.clientWidth,  window.innerWidth  || 0);
const pageHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);  

const canvas = new fabric.Canvas('canvas', {
    width: pageWidth,
    height: pageHeight
});

const rect = new fabric.Rect({
    top: 100,
    left: 100,
    width: 60,
    height: 70,
    fill: 'red',
});

canvas.add(rect);
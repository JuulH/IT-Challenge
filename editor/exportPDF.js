// Export the canvas to a PDF file
document.getElementById('export-pdf').addEventListener('click', function() {
    window.jsPDF = window.jspdf.jsPDF;

    // Create a new jsPDF instance
    var doc = new jsPDF({
      //orientation: 'landscape',
      unit: 'mm',
      format: [100,100]
    });
  
    // Get the width and height of the canvas
    var width = canvas.width;
    var height = canvas.height;
  
    // Set the resolution of the canvas to 300 DPI
    // var dpi = 1;
    canvas.setDimensions({
      backstoreOnly: true
    });
    canvas.renderAll(); 
    
    canvas.crossOrigin = "anonymous";

    // Convert the canvas to a data URL with a quality of 1.0
    var dataUrl = canvas.toDataURL();
  
    // Add the data URL as an image to the PDF with a quality of 1.0
    doc.addImage(dataUrl, 'PNG', 0, 0, width, height);
  
    // Save the PDF file
    doc.save('canvas.pdf');
  
    // Restore the original canvas dimensions and resolution
    canvas.setDimensions({
      width: width,
      height: height
    }, {
      backstoreOnly: true
    });
    canvas.renderAll();
  });
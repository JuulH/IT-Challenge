// Export the canvas to a PDF file
async function exportPDF() {

	// Create a new jsPDF instance
	window.jsPDF = window.jspdf.jsPDF;

	// Set card properties, get variables from canvas.js and pages.js
	// All dimensions are in mm
	let width = postcardWidth;
	let height = postcardHeight;
	let margin = postcardMargins;
	let backImage = "../media/website/logo_met_onderschrift.png";
	// Format: 					[x,	y]
	let backImageLocation = [5, 120];
	let backImageSize = [47, 15];
	let fileName = sessionId + ".pdf";


	// PDF file settings
	var doc = new jsPDF({
		orientation: 'portrait',
		unit: 'mm',
		format: [width, height],
		putOnlyUsedFonts: true,
		compress: true
	});

	doc.setProperties({
		title: "Card Designer Export",
		author: "Femke Reuvers",
		creator: "Digital Card Designer"
	})

	// Save current page and remove cutting lines
	cuttingLineLayer.visible = false;
	pages[activePage] = canvas.toJSON();

	// Enable loading overlay
	Unhide("loading-overlay");
	loading = true;

	for (let currentPage = 0; currentPage < maxPages; currentPage++) {
		// Create a new page if current page is not the first
		if (currentPage != 0) {
			doc.addPage();
		}

		// Load canvas if it exists and wait untill all elements are loaded
		if (pages[currentPage]) {
			await canvas.loadFromJSON(pages[currentPage]);
		} else {
			canvas.clear();
		}

		// Wait a short time to make sure the canvas loads
		await new Promise(res => setTimeout(res, 500));

		// Refresh graphics
		canvas.renderAll();

		// Convert the canvas to PNG
		canvasData = canvas.toDataURL("png");

		// Add the PNG as an image to the PDF
		doc.addImage(canvasData, 0, 0, width, height);
	};

	// Add backside of card with preset image
	doc.addPage();
	doc.addImage(backImage, backImageLocation[0], backImageLocation[1], backImageSize[0], backImageSize[1]);

	// Restore view to active page
	canvas.loadFromJSON(pages[activePage]);

	// Save the PDF file
	// doc.save(fileName);
	// outputFile = doc.output("blob");
	// console.log(outputFile);

	// // Save PDF to server
	// var data = new FormData();
	// data.append("pdf", outputFile);

	// let xhr = new XMLHttpRequest();
	// xhr.open("POST", "uploadPDF.php");
	// // xhr.setRequestHeader("Content-type", "application/pdf")
	// xhr.onload = function () {
	// 	if (xhr.status == 200) {
	// 		xhr.send(data);	
	// 		console.log(xhr.responseText);
	// 	}
	// 	else {
	// 		alert("Error " + xhr.status + ": " + xhr.statusText);
	// 	}
	// };

	// Disable loading overlay 
	Hide("loading-overlay");
	loading = false;
};
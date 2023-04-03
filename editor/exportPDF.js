pageImages = [];
let maxArc = 25; // Preview image arc in degrees
let blob;
const card_preview_container = document.getElementById("card-preview-container");

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
	let backImageLocation = [5, 120]; // [x, y]
	let backImageSize = [47, 15]; // [width, height]

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
		pageImages.push(canvasData);

		// Add the PNG as an image to the PDF
		doc.addImage(canvasData, 0, 0, width, height);
	};

	// Add backside of card with preset image
	doc.addPage();
	doc.addImage(backImage, backImageLocation[0], backImageLocation[1], backImageSize[0], backImageSize[1]);

	// Restore view to active page
	canvas.loadFromJSON(pages[activePage]);

	blob = doc.output('blob');

	let formData = new FormData();
	formData.append('pdf', blob);

	$.ajax('utils/uploadPDF.php?id='+sessionId,
		{
			method: 'POST',
			data: formData,
			processData: false,
			contentType: false,
			success: function (data) { console.log(data) },
			error: function (data) { console.log(data) }
		});

	// Disable loading overlay 
	Hide("loading-container");
	loading = false;
	Unhide("completion-container");

	// Show preview of images
	for (let i = 0; i < pageImages.length; i++) {
		let preview = document.createElement("img");
		preview.src = pageImages[i];
		preview.classList.add("preview-img");
		preview.style.setProperty('--rotation', (-maxArc / 2 + i * (maxArc / (maxPages - 1))) + 'deg'); // Set rotation of image preview
		preview.draggable = false; // Disable dragging of image preview
		card_preview_container.appendChild(preview);
	}

	DeleteUserImages();
};

// Download PDF to client
function DownloadPDF() {
	if (blob) {
		const link = document.createElement('a');
		link.href = URL.createObjectURL(blob);
		link.download = 'kaart-' + sessionId + '.pdf';
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}
}

// Delete all user uploaded images from server after design is complete
function DeleteUserImages() {
	$.ajax('utils/delete-images.php?id='+sessionId,
		{
			method: 'GET',
			success: function (data) { console.log(data) },
			error: function (data) { console.log(data) }
		});
}
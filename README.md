<div align="center">

# IT-Challenge: Card Designer
<img width="800px" src="https://user-images.githubusercontent.com/31242537/229386992-8d3aaae1-6dc5-4d0e-afab-e7c0dda959ae.png" alt="Card example">

The Card Designer is an IT-Challenge project for [Femke Reuvers](https://www.femkereuvers.shop/), a shop specialized in making personalized presents.

</div>

## Features

The designer allows users to:
- Add shapes, text
- Upload their own images through a mobile QR code or use preset "stickers"
- Apply colors to objects
- Align objects
- Design multiple sides of the card
- Export the result as a PDF

## Dependencies

The designer depends on:
- [Fabric.js](https://github.com/fabricjs/fabric.js) (high-level canvas usage)
- [QRCode.js](https://github.com/davidshimjs/qrcodejs) (generating QR codes at runtime)
- [jsPDF](https://github.com/parallax/jsPDF) (exporting card as PDF)
- [alwan](https://github.com/SofianChouaib/alwan) (customizable color picker)
- [jQuery](https://github.com/jquery/jquery) (AJAX requests & PDF upload)

## Code Structure

[:open_file_folder: editor](/editor/)
- [index.php](/editor/index.php) Editor front-end
- [canvas.js](/editor/canvas.js) Canvas setup & options
- [pages.js](/editor/pages.js) Card pages & previews
- [tools.js](/editor/tools.js) Tools (e.g. shapes, text, images, etc.)
- [:open_file_folder: utils](/editor/utils) PHP helper functions

[:open_file_folder: upload](/upload/)
- [upload.php](/upload/upload.php) Mobile upload front-end
- [on_submit.php](/upload/on_submit.php) Server-side file upload handling

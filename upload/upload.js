const form = document.getElementById('form');
const fileInput = document.getElementById('image');

// Submit form when file is selected
fileInput.addEventListener('change', () => {
    if (fileInput.files.length > 0) {
        form.submit();
    }
});
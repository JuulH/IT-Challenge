const form = document.getElementById('form');
const fileInput = document.getElementById('image');

fileInput.addEventListener('change', () => {
    if (fileInput.files.length > 0) {
        form.submit();
    }
});
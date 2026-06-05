const form = document.getElementById('videoUploadForm');
const titleInput = document.getElementById('title');
const qualitySelect = document.getElementById('quality');
const publishDate = document.getElementById('publishDate');
const videoFile = document.getElementById('videoFile');
const thumbFile = document.getElementById('thumbFile');
const successMsg = document.getElementById('successMsg');

const description = document.getElementById('description');
const titleError = document.getElementById('titleError');
const qualityError = document.getElementById('qualityError');
const dateError = document.getElementById('dateError');
const videoError = document.getElementById('videoError');

function showError(input, errorElement) {
    if (!input) return;
    // File inputs are hidden; style the visible label instead
    if (input.type === 'file') {
        const label = input.closest('.upload-drop') || input.closest('.upload-thumb');
        if (label) label.classList.add('invalid');
    } else {
        input.style.border = '2px solid #ff0000';
    }
    if (errorElement) errorElement.style.display = 'block';
}

function hideError(input, errorElement) {
    if (!input) return;
    if (input.type === 'file') {
        const label = input.closest('.upload-drop') || input.closest('.upload-thumb');
        if (label) label.classList.remove('invalid');
    } else {
        input.style.border = '';
    }
    if (errorElement) errorElement.style.display = 'none';
}

titleInput.addEventListener('input', () => {
    if (titleInput.value.trim() !== '') {
        hideError(titleInput, titleError);
    }
});

qualitySelect.addEventListener('change', () => {
    if (qualitySelect.value !== '') {
        hideError(qualitySelect, qualityError);
    }
});

publishDate.addEventListener('change', () => {
    if (publishDate.value !== '') {
        hideError(publishDate, dateError);
    }
});

videoFile.addEventListener('change', () => {
    if (videoFile.files.length > 0) {
        hideError(videoFile, videoError);
        const video = document.getElementById('previewVideo');
        const file = videoFile.files[0];
        const url = URL.createObjectURL(file);
        video.src = url;
        video.style.display = 'block';
        const label = videoFile.closest('.upload-drop');
        if (label) label.classList.add('has-preview');
        video.addEventListener('loadedmetadata', () => {
            URL.revokeObjectURL(url);
        });
    }
});

thumbFile.addEventListener('change', () => {
    if (thumbFile.files.length > 0) {
        const img = document.getElementById('previewThumb');
        const file = thumbFile.files[0];
        const url = URL.createObjectURL(file);
        img.src = url;
        img.style.display = 'block';
        const label = thumbFile.closest('.upload-thumb');
        if (label) label.classList.add('has-preview');
        img.onload = () => {
            URL.revokeObjectURL(url);
        };
    }
});

form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Validate one field at a time: title -> quality -> publish date -> video
    if (titleInput.value.trim() === '') {
        // clear others
        hideError(qualitySelect, qualityError);
        hideError(publishDate, dateError);
        hideError(videoFile, videoError);
        showError(titleInput, titleError);
        titleInput.focus();
        return;
    }
    hideError(titleInput, titleError);

    if (qualitySelect.value === '') {
        hideError(publishDate, dateError);
        hideError(videoFile, videoError);
        showError(qualitySelect, qualityError);
        qualitySelect.focus();
        return;
    }
    hideError(qualitySelect, qualityError);

    if (publishDate.value === '') {
        hideError(videoFile, videoError);
        showError(publishDate, dateError);
        publishDate.focus();
        return;
    }
    hideError(publishDate, dateError);

    if (videoFile.files.length === 0) {
        showError(videoFile, videoError);
        return;
    }
    hideError(videoFile, videoError);

    // all good -> submit
    const formData = new FormData(form);
    fetch('/add-video', { method: 'POST', body: formData })
    .then(response => {
        console.log('Response status:', response.status);
        if (response.redirected || response.status === 302) {
            successMsg.style.display = 'block';
            setTimeout(() => { window.location.href = '/dashboard'; }, 1500);
        } else if (response.ok) {
            successMsg.style.display = 'block';
            setTimeout(() => { window.location.href = '/dashboard'; }, 1500);
        } else if (response.status === 400 || response.status === 500) {
            return response.text().then(text => { throw new Error(text); });
        } else {
            return response.text().then(text => { throw new Error(text); });
        }
    })
    .catch(err => {
        console.error('Upload error:', err);
        alert('Upload failed: ' + err.message);
    });
});
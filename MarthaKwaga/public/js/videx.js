const form = document.getElementById('uploadForm');

const videoInput = document.getElementById('videoInput');
const videoPreview = document.getElementById('videoPreview');
const videoPlaceholder = document.getElementById('videoPlaceholder');

const thumbnailInput = document.getElementById('thumbnailInput');
const thumbnailPreview = document.getElementById('thumbnailPreview');
const thumbnailPlaceholder = document.getElementById('thumbnailPlaceholder');

// Show selected video before uploading
videoInput.addEventListener('change', function () {
  const file = videoInput.files[0];

  if (file) {
    const videoUrl = URL.createObjectURL(file);

    videoPreview.src = videoUrl;
    videoPreview.hidden = false;
    videoPlaceholder.hidden = true;

    removeError(videoInput);
  }
});

// Show selected thumbnail before uploading
thumbnailInput.addEventListener('change', function () {
  const file = thumbnailInput.files[0];

  if (file) {
    const imageUrl = URL.createObjectURL(file);

    thumbnailPreview.src = imageUrl;
    thumbnailPreview.hidden = false;
    thumbnailPlaceholder.hidden = true;

    removeError(thumbnailInput);
  }
});

// Remove red border when user starts typing or selecting
const allFields = form.querySelectorAll('input, textarea, select');

allFields.forEach(function (field) {
  field.addEventListener('input', function () {
    removeError(field);
  });

  field.addEventListener('change', function () {
    removeError(field);
  });
});

// Check form before submitting
form.addEventListener('submit', function (event) {
  let hasError = false;

  const title = form.querySelector('input[name="title"]');
  const quality = form.querySelector('select[name="quality"]');
  const publishingDate = form.querySelector('input[name="publishingDate"]');

  if (title.value.trim() === '') {
    showError(title);
    hasError = true;
  }

  if (quality.value === '') {
    showError(quality);
    hasError = true;
  }

  if (publishingDate.value === '') {
    showError(publishingDate);
    hasError = true;
  }

  if (videoInput.files.length === 0) {
    showError(videoInput);
    hasError = true;
  }

  if (thumbnailInput.files.length === 0) {
    showError(thumbnailInput);
    hasError = true;
  }

  if (hasError) {
    event.preventDefault();
  }
});

function showError(field) {
  let errorTarget;

  if (field.type === 'file') {
    errorTarget = field.parentElement;
  } else {
    errorTarget = field;
  }

  errorTarget.classList.add('is-invalid-custom');

  const nextElement = errorTarget.nextElementSibling;

  if (!nextElement || !nextElement.classList.contains('frontend-error')) {
    const errorMessage = document.createElement('small');
    errorMessage.className = 'text-danger ms-1 frontend-error';
    errorMessage.innerText = 'Required field';

    errorTarget.insertAdjacentElement('afterend', errorMessage);
  }
}

function removeError(field) {
  let errorTarget;

  if (field.type === 'file') {
    errorTarget = field.parentElement;
  } else {
    errorTarget = field;
  }

  errorTarget.classList.remove('is-invalid-custom');

  const nextElement = errorTarget.nextElementSibling;

  if (nextElement && nextElement.classList.contains('frontend-error')) {
    nextElement.remove();
  }
}
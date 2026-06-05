// verification js
document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.upload-form');
  if (!form) return;

  // error remove for specific fields
  const clearError = (el) => {
    el.classList.remove('error-field');
    const err = el.parentElement.querySelector('.error-message');
    if (err) {
      err.remove();
    }
  };

  // add error message at the bottom of the field
  const showError = (el, message) => {
    el.classList.add('error-field');
    const error = document.createElement('div');
    error.className = 'error-message';
    error.textContent = message;
    // insert error message after the field's parent container
    if (el.classList.contains('dropzone')) {
      el.parentElement.insertBefore(error, el.nextSibling);
    } else {
      el.parentElement.insertBefore(error, el.nextSibling);
    }
  };

  // dropzone form handling
  document.querySelectorAll('.dropzone').forEach(zone => {
    const input = zone.querySelector('input[type="file"]');
    zone.addEventListener('click', () => input.click());
    input.addEventListener('change', (e) => {
      if (e.target.files.length) {
        zone.querySelector('p').textContent = e.target.files[0].name;
        zone.style.borderColor = '#4caf50';
        zone.style.backgroundColor = '#f1f8e9';
        clearError(zone);
      }
    });
  });

  // real-time validation for title field
  const titleField = form.querySelector('[name="title"]');
  if (titleField) {
    titleField.addEventListener('input', function() {
      if (this.value.trim()) {
        clearError(this);
      }
    });
  }

  // real-time validation for quality field
  const qualityField = form.querySelector('[name="quality"]');
  if (qualityField) {
    qualityField.addEventListener('change', function() {
      if (this.value) {
        clearError(this);
      }
    });
  }

  // real-time validation for date field
  const dateField = form.querySelector('[name="dateOfPublishing"]');
  if (dateField) {
    dateField.addEventListener('change', function() {
      if (this.value) {
        clearError(this);
      }
    });
  }

  // video preview
  const videoInput = document.querySelector('input[name="video"]');
  const videoPreview = document.getElementById('videoPreview');
  if (videoInput) {
    videoInput.addEventListener('change', (e) => {
      if (e.target.files.length) {
        const file = e.target.files[0];
        const videoURL = URL.createObjectURL(file);
        videoPreview.src = videoURL;
        videoPreview.style.display = 'block';
        const zone = document.querySelector('.video-drop');
        zone.querySelector('p').style.display = 'none';
        zone.querySelector('i').style.display = 'none';
        zone.style.padding = '10px';
        zone.style.backgroundColor = '#f1f8e9';
        zone.style.borderColor = '#4caf50';
        clearError(zone);
      }
    });
  }

   // thumbnail preview functionality
  const thumbnailInput = document.querySelector('input[name="thumbnail"]');
  const thumbnailPreview = document.getElementById('thumbnailPreview');
  if (thumbnailInput) {
    thumbnailInput.addEventListener('change', (e) => {
      if (e.target.files.length) {
        const file = e.target.files[0];
        const thumbnailURL = URL.createObjectURL(file);
        thumbnailPreview.src = thumbnailURL;
        thumbnailPreview.style.display = 'block';
        const zone = document.querySelector('.thumbnail-drop');
        zone.querySelector('p').style.display = 'none';
        zone.querySelector('i').style.display = 'none';
        zone.style.backgroundColor = '#f1f8e9';
        zone.style.borderColor = '#4caf50';
        clearError(zone);
      }
    });
  }

  // form validation
  form.addEventListener('submit', (e) => {
    // remove existing errors before validating
    document.querySelectorAll('.error-message').forEach(err => err.remove());
    document.querySelectorAll('.error-field').forEach(f => f.classList.remove('error-field'));

    // define required fields and their validation rules
    const fields = [
      { el: form.querySelector('[name="title"]'), msg: 'Required field' },
      { el: form.querySelector('[name="quality"]'), msg: 'Required field' },
      { el: form.querySelector('[name="dateOfPublishing"]'), msg: 'Required field' },
      { el: form.querySelector('[name="video"]'), msg: 'Required field', isFile: true }
    ];

    let isValid = true;
    fields.forEach(({ el, msg, isFile }) => {
      // check if field is empty (file field needs special handling)
      const isInvalid = isFile ? !el.files.length : !el.value.trim();
      if (isInvalid) {
        // show error on video dropzone for file field, otherwise on the input element
        showError(isFile ? document.querySelector('.video-drop') : el, msg);
        isValid = false;
      }
    });

    // prevent form submission and scroll to first error if validation fails
    if (!isValid) {
      e.preventDefault();
      document.querySelector('.error-field')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
});
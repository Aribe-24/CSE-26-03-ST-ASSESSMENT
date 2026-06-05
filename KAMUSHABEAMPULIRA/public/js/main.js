const videoInput = document.getElementById('videoFileInput');
const videoZone = document.getElementById('videoZone');
const videoZoneInner = document.getElementById('videoZoneInner');

if (videoInput) {
  videoInput.addEventListener('change', function () {
    const file = this.files[0];
    if (!file) return;
    clearError(videoZone, 'upload-zone-error');
    const url = URL.createObjectURL(file);
    videoZoneInner.innerHTML = '';
    const vid = document.createElement('video');
    vid.src = url; vid.controls = true;
    vid.style.cssText = 'width:100%;height:100%;object-fit:contain;background:#000';
    videoZone.appendChild(vid);
  });
}

const thumbInput = document.getElementById('thumbnailInput');
const thumbZone = document.getElementById('thumbZone');
const thumbZoneInner = document.getElementById('thumbZoneInner');

if (thumbInput) {
  thumbInput.addEventListener('change', function () {
    const file = this.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    thumbZoneInner.innerHTML = '';
    const img = document.createElement('img');
    img.src = url;
    img.style.cssText = 'width:100%;height:100%;object-fit:cover';
    thumbZone.appendChild(img);
  });
}

const uploadForm = document.getElementById('uploadForm');
const qualitySelect = document.getElementById('qualitySelect');
if (qualitySelect) {
  qualitySelect.addEventListener('change', function () {
    this.classList.add('has-value');
    clearError(this.closest('.select-wrapper'), 'select-error');
  });
  if (qualitySelect.value) qualitySelect.classList.add('has-value');
}

const dateInput = document.getElementById('dateInput');
if (dateInput) {
  function updateDateColor() {
    dateInput.classList.toggle('has-value', !!dateInput.value);
    if (dateInput.value) clearError(dateInput.closest('.date-wrapper'), 'date-error');
  }
  dateInput.addEventListener('change', updateDateColor);
  updateDateColor();
}

const titleInput = document.getElementById('titleInput');
if (titleInput) {
  titleInput.addEventListener('input', function () {
    if (this.value.trim()) clearError(this, 'input-error');
  });
}

if (videoZone) {
  videoZone.addEventListener('dragover', e => { e.preventDefault(); videoZone.style.borderColor = '#ff0000'; });
  videoZone.addEventListener('dragleave', () => { videoZone.style.borderColor = ''; });
  videoZone.addEventListener('drop', e => {
    e.preventDefault(); videoZone.style.borderColor = '';
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('video/')) {
      const dt = new DataTransfer(); dt.items.add(file);
      videoInput.files = dt.files;
      videoInput.dispatchEvent(new Event('change'));
    }
  });
}

if (thumbZone) {
  thumbZone.addEventListener('dragover', e => { e.preventDefault(); thumbZone.style.borderColor = '#ff0000'; });
  thumbZone.addEventListener('dragleave', () => { thumbZone.style.borderColor = ''; });
  thumbZone.addEventListener('drop', e => {
    e.preventDefault(); thumbZone.style.borderColor = '';
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const dt = new DataTransfer(); dt.items.add(file);
      thumbInput.files = dt.files;
      thumbInput.dispatchEvent(new Event('change'));
    }
  });
}

if (thumbInput) {
  thumbInput.addEventListener('change', function () {
    clearError(thumbZone, 'upload-zone-error');
  });
}

if (videoInput) {
  videoInput.addEventListener('change', function () {
    clearError(videoZone, 'upload-zone-error');
  });
}

function addFieldError(target, className) {
  if (!target) return;
  target.classList.add(className);
  const fieldGroup = target.closest('.field-group');
  if (!fieldGroup) return;
  let errorSpan = fieldGroup.querySelector('.field-error');
  if (!errorSpan) {
    errorSpan = document.createElement('span');
    errorSpan.className = 'field-error';
    fieldGroup.appendChild(errorSpan);
  }
  errorSpan.textContent = 'Required field';
}

function clearError(target, className) {
  if (!target) return;
  target.classList.remove(className);
  const fieldGroup = target.closest('.field-group');
  if (!fieldGroup) return;
  const errorSpan = fieldGroup.querySelector('.field-error');
  if (errorSpan) errorSpan.remove();
}

function validateUploadForm(event) {
  let hasError = false;

  if (titleInput && !titleInput.value.trim()) {
    addFieldError(titleInput, 'input-error');
    hasError = true;
  }

  if (qualitySelect && !qualitySelect.value) {
    addFieldError(qualitySelect.closest('.select-wrapper'), 'select-error');
    hasError = true;
  }

  if (dateInput && !dateInput.value) {
    addFieldError(dateInput.closest('.date-wrapper'), 'date-error');
    hasError = true;
  }

  if (videoZone && (!videoInput.files || videoInput.files.length === 0)) {
    addFieldError(videoZone, 'upload-zone-error');
    hasError = true;
  }

  if (thumbZone && (!thumbInput.files || thumbInput.files.length === 0)) {
    addFieldError(thumbZone, 'upload-zone-error');
    hasError = true;
  }

  if (hasError) {
    event.preventDefault();
    const firstError = document.querySelector('.input-error, .select-error, .date-error, .upload-zone-error');
    if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

if (uploadForm) {
  uploadForm.addEventListener('submit', validateUploadForm);
}

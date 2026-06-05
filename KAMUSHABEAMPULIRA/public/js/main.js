const videoInput = document.getElementById('videoFileInput');
const videoZone = document.getElementById('videoZone');
const videoZoneInner = document.getElementById('videoZoneInner');

if (videoInput) {
  videoInput.addEventListener('change', function () {
    const file = this.files[0];
    if (!file) return;
    videoZone.classList.remove('upload-zone-error');
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

const qualitySelect = document.getElementById('qualitySelect');
if (qualitySelect) {
  qualitySelect.addEventListener('change', function () {
    this.classList.add('has-value');
    this.closest('.select-wrapper').classList.remove('select-error');
  });
  if (qualitySelect.value) qualitySelect.classList.add('has-value');
}

const dateInput = document.getElementById('dateInput');
if (dateInput) {
  function updateDateColor() {
    dateInput.classList.toggle('has-value', !!dateInput.value);
    if (dateInput.value) dateInput.closest('.date-wrapper').classList.remove('date-error');
  }
  dateInput.addEventListener('change', updateDateColor);
  updateDateColor();
}

const titleInput = document.getElementById('titleInput');
if (titleInput) {
  titleInput.addEventListener('input', function () {
    if (this.value.trim()) this.classList.remove('input-error');
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
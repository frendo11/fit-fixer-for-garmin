// public/js/main.js

const socket = io();

const uploadForm = document.getElementById('uploadForm');
const fitFileInput = document.getElementById('fitFile');
const progressContainer = document.getElementById('progressContainer');
const progressBar = document.getElementById('progressBar');
const downloadLink = document.getElementById('downloadLink');

let currentFileId = null;

uploadForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const file = fitFileInput.files[0];
    if (!file) {
        alert('Please select a .fit file to upload.');
        return;
    }

    // Reset UI
    progressBar.style.width = '0%';
    progressContainer.style.display = 'block';
    downloadLink.style.display = 'none';

    // Prepare FormData
    const formData = new FormData();
    formData.append('fitFile', file);

    // Append the current socket ID
    formData.append('socketId', socket.id);

    // Send the file via fetch
    fetch('/api/files/upload', {
        method: 'POST',
        body: formData,
    })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                throw new Error(data.error);
            }
            console.log(data.message);
            currentFileId = data.fileId;
        })
        .catch(err => {
            alert(err.message);
            progressContainer.style.display = 'none';
        });
});

// Listen for processingStarted event (optional, handled via fileId from upload response)
socket.on('processingStarted', (data) => {
    console.log('Processing started:', data);
    currentFileId = data.fileId;
});

// Listen for processingProgress event
socket.on('processingProgress', (data) => {
    if (data.fileId !== currentFileId) return;
    progressBar.style.width = `${data.progress}%`;
});

// Listen for processingComplete event
socket.on('processingComplete', (data) => {
    if (data.fileId !== currentFileId) return;
    progressBar.style.width = `100%`;
    downloadLink.href = `/api/files/download/${data.fileId}`;
    downloadLink.style.display = 'block';
    downloadLink.textContent = 'Download Processed File';
});

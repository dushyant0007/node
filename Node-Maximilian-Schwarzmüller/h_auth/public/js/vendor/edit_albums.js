let albums = [];

function createAlbum() {
    const albumName = document.getElementById('albumName').value;
    const serviceId = document.getElementById('serviceId').value;

    if (albumName) {
        const existingAlbum = albums.find(album => album.name === albumName);
        if (existingAlbum) {
            alert('Album already exists!');
            return;
        }
        const album = { name: albumName, files: [], existingFiles: [], serviceId };
        albums.push(album);
        renderAlbums();
        document.getElementById('albumName').value = '';
    }
}

function renderAlbums() {
    const albumsContainer = document.getElementById('albums');
    albumsContainer.innerHTML = '';
    albums.forEach((album, index) => {
        const albumElement = document.createElement('div');
        albumElement.className = 'album';
        albumElement.innerHTML = `
            <h2>${album.name}</h2>
            <div class="album-section upload-section">
                <h3>Add New Memories</h3>
                <div class="file-input-wrapper">
                    <button class="btn-file-input">Choose Files</button>
                    <input type="file" id="fileInput${index}" multiple accept="image/*,video/*" onchange="uploadFiles(${index}, this.files)">
                </div>
                <div class="preview"></div>
                <button onclick="uploadAlbum(${index})">Upload New Files</button>
            </div>
            <div class="album-section existing-section">
                <h3>Cherished Moments</h3>
                <div class="existing-images"></div>
            </div>
        `;
        albumsContainer.appendChild(albumElement);
        renderPreview(index);
        renderExistingImages(index);
    });
}

function uploadFiles(albumIndex, files) {
    const album = albums[albumIndex];
    album.files = [...album.files, ...Array.from(files)];
    renderPreview(albumIndex);
    document.getElementById(`fileInput${albumIndex}`).value = '';
}

function renderPreview(albumIndex) {
    const album = albums[albumIndex];
    const previewElement = document.querySelectorAll('.preview')[albumIndex];
    previewElement.innerHTML = '';
    album.files.forEach((file, fileIndex) => {
        const fileContainer = document.createElement('div');
        fileContainer.className = 'file-container';

        const fileElement = document.createElement(file.type.startsWith('image/') ? 'img' : 'video');
        fileElement.src = URL.createObjectURL(file);
        if (fileElement.tagName === 'VIDEO') {
            fileElement.setAttribute('controls', '');
        }

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'X';
        deleteButton.className = 'delete-button';
        deleteButton.onclick = (e) => {
            e.stopPropagation();
            deleteFile(albumIndex, fileIndex);
        };

        fileContainer.appendChild(fileElement);
        fileContainer.appendChild(deleteButton);
        previewElement.appendChild(fileContainer);
    });
}

function renderExistingImages(albumIndex) {
    const album = albums[albumIndex];
    const existingImagesElement = document.querySelectorAll('.existing-images')[albumIndex];
    existingImagesElement.innerHTML = '';
    album.existingFiles.forEach((file, fileIndex) => {
        const fileContainer = document.createElement('div');
        fileContainer.className = 'file-container';

        const fileElement = document.createElement(file.type.startsWith('video') ? 'video' : 'img');
        fileElement.src = file.path;
        if (fileElement.tagName === 'VIDEO') {
            fileElement.setAttribute('controls', '');
        }

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'X';
        deleteButton.className = 'delete-button';
        deleteButton.onclick = (e) => {
            e.stopPropagation();
            deleteExistingFile(albumIndex, fileIndex);
        };

        fileContainer.appendChild(fileElement);
        fileContainer.appendChild(deleteButton);
        existingImagesElement.appendChild(fileContainer);
    });
}

function deleteFile(albumIndex, fileIndex) {
    albums[albumIndex].files.splice(fileIndex, 1);
    renderPreview(albumIndex);
}

function deleteExistingFile(albumIndex, fileIndex) {
    const album = albums[albumIndex];
    const file = album.existingFiles[fileIndex];

    console.log(album.name, album.serviceId,file.name) 

    fetch(`/vendor/dashboard/update-album`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            serviceId: pageData.serviceId,
            albumName: album.name,
            fileName: file.name,
        })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('File deleted successfully:', data);
            album.existingFiles.splice(fileIndex, 1);
            renderExistingImages(albumIndex);
        })
        .catch(error => {
            console.error('Error deleting file:', error);
            alert('Error deleting file. Please try again.');
        });
}

function uploadAlbum(albumIndex) {
    const album = albums[albumIndex];
    const formData = new FormData();

    formData.append('albumName', album.name);
    formData.append('serviceId', album.serviceId);

    album.files.forEach((file, index) => {
        formData.append('files', file);
    });

    fetch('/vendor/dashboard/update-album', {
        method: 'POST',
        body: formData
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Album uploaded successfully:', data);
            alert('Album uploaded successfully!');
            album.files = [];
            refreshAlbum(albumIndex);
        })
        .catch(error => {
            console.error('Error uploading album:', error);
            alert('Error uploading album. Please try again.');
        });
}

async function refreshAlbum(albumIndex) {
    const album = albums[albumIndex];
    try {
        const response = await fetch(`/vendor/dashboard/get-albums/${album.serviceId}`);
        const allAlbums = await response.json();

        if (allAlbums[album.name]) {
            album.existingFiles = allAlbums[album.name].map(file => ({
                name: file,
                type: file.endsWith('.mp4') ? 'video/mp4' : 'image/jpeg',
                path: `/service_albums/${pageData.userId}/${album.serviceId}/${album.name}/${file}`
            }));
        } else {
            album.existingFiles = [];
        }

        renderAlbums();
    } catch (error) {
        console.error('Error refreshing album:', error);
    }
}

async function loadExistingAlbums() {
    try {
        const response = await fetch(`/vendor/dashboard/get-albums/${pageData.serviceId}`);
        const response_albums = await response.json();
        console.log(response_albums);

        albums = Object.entries(response_albums).map(([name, files]) => ({
            name,
            files: [],
            existingFiles: files.map(file => ({
                name: file,
                type: file.endsWith('.mp4') ? 'video/mp4' : 'image/jpeg',
                path: `/service_albums/${pageData.userId}/${pageData.serviceId}/${name}/${file}`
            })),
            serviceId: `${pageData.serviceId}`
        }));

        renderAlbums();
    } catch (error) {
        console.error('Error loading existing albums:', error);
    }
}

loadExistingAlbums();
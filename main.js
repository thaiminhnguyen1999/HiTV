import axios from 'https://cdn.jsdelivr.net/npm/axios@1.7.4/+esm';

const repoUrl = 'https://api.github.com/repos/thaiminhnguyen1999/HiTV/contents/';

async function fetchRepoContents(path = '') {
  try {
    const response = await axios.get(`${repoUrl}${path}`);
    displayContents(response.data, path);
  } catch (error) {
    console.error('Error fetching repository contents:', error);
  }
}

function displayContents(contents, currentPath) {
  const container = document.querySelector('.directory-list');
  container.innerHTML = '';
  contents.forEach(item => {
    if (!item.name.includes('web-project-files')) {
      const listItem = document.createElement('li');
      listItem.className = 'directory-item';

      const icon = document.createElement('img');
      icon.className = item.type === 'dir' ? 'folder-icon' : 'file-icon';
      icon.src = item.type === 'dir' ? '/icon/folder-icon.svg' : getFileIcon(item.name);

      const link = document.createElement('a');
      link.textContent = item.name;
      if (item.type === 'dir') {
        link.href = `/${currentPath}${item.name}/`;
        link.addEventListener('click', (e) => {
          e.preventDefault();
          window.history.pushState(null, '', link.href);
          fetchRepoContents(`${currentPath}${item.name}/`);
        });
      } else {
        link.href = item.download_url;
        link.addEventListener('click', (e) => {
          e.preventDefault();
          showFileContent(item);
        });
      }

      const sizeInfo = document.createElement('div');
      sizeInfo.className = 'file-info';
      sizeInfo.textContent = `Size: ${item.size} bytes`;

      listItem.appendChild(icon);
      listItem.appendChild(link);
      listItem.appendChild(sizeInfo);
      container.appendChild(listItem);
    }
  });
}

function getFileIcon(fileName) {
  if (fileName.endsWith('.md')) return '/icon/md-icon.svg';
  if (fileName.match(/\.(png|jpg|jpeg|gif|svg|ico)$/)) return '/icon/image-icon.svg';
  if (fileName.match(/\.(mp4|webm|ogg|m3u8|m4v|mpeg|dash)$/)) return '/icon/video-icon.svg';
  return '/icon/file-icon.svg';
}

function showFileContent(file) {
  const existingContentArea = document.querySelector('.file-content');
  if (existingContentArea) {
    existingContentArea.remove();
  }

  const contentArea = document.createElement('div');
  contentArea.className = 'file-content';

  const fileHeader = document.createElement('div');
  fileHeader.className = 'file-header';

  const fileTitle = document.createElement('span');
  fileTitle.innerHTML = `Content of <strong>${file.name}</strong>`;

  const downloadBtn = document.createElement('a');
  downloadBtn.className = 'download-btn';
  downloadBtn.href = file.download_url;
  downloadBtn.textContent = 'Download';

  const closeBtn = document.createElement('button');
  closeBtn.className = 'close-btn';
  closeBtn.innerHTML = '<img src="/icon/close-icon.svg" alt="Close">';

  closeBtn.addEventListener('click', () => {
    contentArea.remove();
  });

  fileHeader.appendChild(fileTitle);
  fileHeader.appendChild(downloadBtn);
  fileHeader.appendChild(closeBtn);

  contentArea.appendChild(fileHeader);

  const fileViewer = document.createElement('pre');
  fileViewer.id = 'file-viewer';

  if (file.name.endsWith('.md')) {
    const mdContainer = document.createElement('div');
    mdContainer.className = 'md-container';

    const formattedContent = document.createElement('div');
    formattedContent.className = 'md-formatted';
    fetch(file.download_url)
      .then(response => response.text())
      .then(data => {
        formattedContent.innerHTML = marked(data);
      });

    const rawContent = document.createElement('pre');
    rawContent.className = 'md-raw';
    fetch(file.download_url)
      .then(response => response.text())
      .then(data => {
        rawContent.textContent = data;
      });

    mdContainer.appendChild(formattedContent);
    mdContainer.appendChild(rawContent);
    contentArea.appendChild(mdContainer);

  } else if (file.name.match(/\.(png|jpg|jpeg|gif|svg|ico)$/)) {
    const img = document.createElement('img');
    img.src = file.download_url;
    contentArea.appendChild(img);

  } else if (file.name.match(/\.(mp4|webm|ogg|m3u8|m4v|mpeg|dash)$/)) {
    const video = document.createElement('video');
    video.src = file.download_url;
    video.controls = true;
    contentArea.appendChild(video);

  } else {
    fetch(file.download_url)
      .then(response => response.text())
      .then(data => {
        fileViewer.textContent = data;
      });

    contentArea.appendChild(fileViewer);
  }

  document.body.appendChild(contentArea);
}

fetchRepoContents();

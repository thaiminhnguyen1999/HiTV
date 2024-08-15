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
      icon.src = item.type === 'dir' ? '/folder-icon.svg' : '/file-icon.svg';

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

function showFileContent(file) {
  const existingContentArea = document.querySelector('.file-content');
  if (existingContentArea) {
    existingContentArea.remove();
  }

  const contentArea = document.createElement('div');
  contentArea.className = 'file-content';
  contentArea.innerHTML = `
        <button class="close-btn">X</button>
        <div class="file-header">
            <span>Content of <strong>${file.name}</strong></span>
            <a href="${file.download_url}" class="download-btn">Download</a>
        </div>
        <pre id="file-viewer"></pre>
    `;

  document.body.appendChild(contentArea);

  document.querySelector('.close-btn').addEventListener('click', () => {
    contentArea.remove();
  });

  fetch(file.download_url)
    .then(response => response.text())
    .then(data => {
      const fileViewer = document.getElementById('file-viewer');
      fileViewer.textContent = data;
    });
}

fetchRepoContents();

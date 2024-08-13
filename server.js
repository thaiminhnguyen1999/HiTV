const express = require('express');
const fetch = require('node-fetch'); // Nếu bạn sử dụng Node.js 18+, fetch đã được tích hợp sẵn
const path = require('path');

const app = express();
const PORT = 3000;

const GITHUB_REPO = 'https://api.github.com/repos/thaiminhnguyen1999/HiTV/contents/';
const GITHUB_TOKEN = process.env.GITHUB_ACCESS_TOKEN;

app.use(express.static(__dirname));

app.get('/file-tree', async (req, res) => {
    try {
        const response = await fetch(GITHUB_REPO, {
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`
            }
        });
        const data = await response.json();

        const filteredData = data.filter(file => !['index.html', 'content.html', 'server.js', 'package.json', 'package-lock.json'].includes(file.name));

        res.json(buildFileTree(filteredData));
    } catch (error) {
        console.error('Error fetching repository content:', error);
        res.status(500).send('Error fetching repository content');
    }
});

function buildFileTree(items) {
    const fileTree = {};
    items.forEach(item => {
        if (item.type === 'dir') {
            fileTree[item.name] = {};
        } else {
            fileTree[item.name] = item.path;
        }
    });
    return fileTree;
}

app.get('/content.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'content.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

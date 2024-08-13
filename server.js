const express = require('express');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = 3000;

const GITHUB_REPO = 'https://api.github.com/repos/thaiminhnguyen1999/HiTV/contents/';
const GITHUB_TOKEN = process.env.GITHUB_ACCESS_TOKEN;

app.use(cors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
}));

app.use(express.static(__dirname));

app.get('/file-tree', async (req, res) => {
    try {
        console.log('Fetching repository content from GitHub...');
        const response = await fetch(GITHUB_REPO, {
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`
            }
        });

        console.log(`GitHub API response status: ${response.status} ${response.statusText}`);
        
        if (!response.ok) {
            const errorDetails = await response.text();
            console.error(`GitHub API request failed: ${response.status} - ${response.statusText}\n${errorDetails}`);
            return res.status(response.status).send('Error fetching repository content from GitHub.');
        }

        const data = await response.json();

        const filteredData = data.filter(file => !['index.html', 'content.html', 'server.js', 'package.json', 'package-lock.json'].includes(file.name));

        res.json(buildFileTree(filteredData));
    } catch (error) {
        console.error('Unexpected error fetching repository content:', error);
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

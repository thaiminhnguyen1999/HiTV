const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;
const rootDir = path.join(__dirname);

app.use(express.static(rootDir));
app.get('/file-tree', (req, res) => {
    const fileTree = buildFileTree(rootDir);
    res.json(fileTree);
});

app.get('/content.html', (req, res) => {
    const filePath = path.join(rootDir, req.query.file);
    if (fs.existsSync(filePath)) {
        res.sendFile(path.join(rootDir, 'content.html'));
    } else {
        res.status(404).send('File not found');
    }
});

function buildFileTree(dir, baseDir = '') {
    const fileTree = {};
    fs.readdirSync(dir).forEach(file => {
        const filePath = path.join(dir, file);
        const relativePath = path.join(baseDir, file);
        if (fs.statSync(filePath).isDirectory()) {
            fileTree[file] = buildFileTree(filePath, relativePath);
        } else {
            fileTree[file] = relativePath;
        }
    });
    return fileTree;
}

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

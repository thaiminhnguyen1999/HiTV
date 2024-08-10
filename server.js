const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;
const rootDir = path.join(__dirname);

app.use(express.static(rootDir));

// Route để cung cấp cây thư mục dưới dạng JSON
app.get('/file-tree', (req, res) => {
    const fileTree = buildFileTree(rootDir);
    res.json(fileTree);
});

// Route để phục vụ nội dung tệp
app.get('/content', (req, res) => {
    const filePath = path.join(rootDir, req.query.file);

    // Kiểm tra nếu file tồn tại
    if (fs.existsSync(filePath)) {
        // Gửi lại nội dung của trang content.html để hiển thị file
        res.sendFile(path.join(rootDir, 'content.html'));
    } else {
        res.status(404).send('File not found');
    }
});

// Hàm xây dựng cây thư mục
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

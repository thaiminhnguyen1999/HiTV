const fetch = require('node-fetch');

const GITHUB_REPO = 'https://api.github.com/repos/thaiminhnguyen1999/HiTV/contents/';
const GITHUB_TOKEN = process.env.GITHUB_ACCESS_TOKEN;

export default async (req, res) => {
    try {
        const response = await fetch(GITHUB_REPO, {
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`
            }
        });

        if (!response.ok) {
            const errorDetails = await response.text();
            return res.status(response.status).send('Error fetching repository content from GitHub.');
        }

        const data = await response.json();
        const filteredData = data.filter(file =>
            !['api/file-tree.js', 'public/index.html', 'public/content.html', 'package.json', 'package-lock.json'].includes(file.path)
        );

        res.json(buildFileTree(filteredData));
    } catch (error) {
        res.status(500).send('Error fetching repository content');
    }
};

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

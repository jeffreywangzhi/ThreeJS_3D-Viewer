// node js server program
const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    // Map requested URL to the file path
    const filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);

    // Read the file and serve it
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('File not found');
        } else {
            res.writeHead(200, { 'Content-Type': getContentType(filePath) });
            res.end(data);
        }
    });
});

const port = process.env.PORT || 46097;

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Helper function to determine content type based on file extension
function getContentType(filePath) {
    const extname = path.extname(filePath);
    switch (extname) {
        case '.html':
            return 'text/html';
        case '.js':
            return 'text/javascript';
        case '.jpg':
        case '.jpeg':
            return 'image/jpeg';
        // Add more cases as needed for other file types
        default:
            return 'application/octet-stream';
    }
}

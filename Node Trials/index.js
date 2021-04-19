const http = require('http');
const fs = require('fs');

const hostname = '127.0.0.1';
const port = 3000;

fs.readFile('home.html', (err, html) => {
    if (err) throw err;

    const server = http.createServer((req, res) => {
        res.statusCode = 200;
        res.setHeader('content-type', 'text/html');
        res.write(html);
        res.end("");
    });

    server.listen(port, hostname, () => {
        process.stdout.write("\nServer is Running...");
    });
});
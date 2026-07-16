const http = require("http");
const fs = require("fs");
const path = require("path");

const port = 5500;
const root = __dirname;

const mimeTypes = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".txt": "text/plain",
  ".xml": "application/xml",
};

const server = http.createServer((req, res) => {
  let filePath = req.url === "/" ? "/index.html" : req.url;
  filePath = filePath.split("?")[0];

  const safePath = path.normalize(filePath).replace(/^(\.\.[/\\])+/, "");
  const fullPath = path.join(root, safePath);

  fs.readFile(fullPath, (err, content) => {
    if (err) {
      fs.readFile(path.join(root, "404.html"), (notFoundErr, notFoundContent) => {
        res.writeHead(404, { "Content-Type": "text/html" });
        res.end(notFoundErr ? "404 Not Found" : notFoundContent);
      });
      return;
    }

    const ext = path.extname(fullPath).toLowerCase();
    res.writeHead(200, {
      "Content-Type": mimeTypes[ext] || "application/octet-stream",
    });
    res.end(content);
  });
});

server.listen(port, () => {
  console.log(`TRP portfolio running at http://localhost:${port}`);
});

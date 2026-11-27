import { createServer } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, extname } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = Number(process.env.PORT ?? 8080);

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".png": "image/png",
  ".css": "text/css",
  ".js": "text/javascript",
  ".json": "application/json",
  ".md": "text/markdown; charset=utf-8",
};

const server = createServer((req, res) => {
  const path = req.url === "/" ? "/frontpage.html" : (req.url ?? "/frontpage.html").split("?")[0];
  const file = join(__dirname, path);
  if (!file.startsWith(__dirname) || !existsSync(file) || !statSync(file).isFile()) {
    res.writeHead(404, { "content-type": "text/plain" });
    res.end("not found");
    return;
  }
  res.writeHead(200, { "content-type": MIME[extname(file)] ?? "application/octet-stream" });
  res.end(readFileSync(file));
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`serving ${__dirname} at http://127.0.0.1:${PORT}/`);
});

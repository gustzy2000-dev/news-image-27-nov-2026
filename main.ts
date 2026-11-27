import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const srcPath = join(__dirname, "entry.png");
const dstPath = join(outDir, "entry.png");

const data = readFileSync(srcPath);

if (data.length < 33 || data[0] !== 0x89 || data[1] !== 0x50 || data[2] !== 0x4e || data[3] !== 0x47) {
  throw new Error("entry.png is not a PNG file");
}

// First chunk must be IHDR (bytes 12-15 spell "IHDR").
const chunkName = data.subarray(12, 16).toString("ascii");
if (chunkName !== "IHDR") {
  throw new Error(`entry.png first chunk is ${chunkName}, expected IHDR`);
}

const width = data.readUInt32BE(16);
const height = data.readUInt32BE(20);

if (width !== 1024 || height !== 1024) {
  throw new Error(`entry.png must be 1024x1024, got ${width}x${height}`);
}

mkdirSync(outDir, { recursive: true });
writeFileSync(dstPath, data);
console.log(`wrote ${dstPath} (${data.length} bytes, 1024x1024)`);

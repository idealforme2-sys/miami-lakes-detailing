import { createReadStream, existsSync } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, join, normalize, resolve } from "node:path";

const root = process.cwd();
const port = Number(process.env.PORT || 5173);

const types = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".mp4": "video/mp4",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp",
};

function safePath(base, requestPath) {
  const decoded = decodeURIComponent(requestPath.split("?")[0]);
  const cleaned = normalize(decoded).replace(/^(\.\.[/\\])+/, "");
  const filePath = resolve(base, cleaned === "/" ? "index.html" : cleaned.slice(1));
  return filePath.startsWith(resolve(base)) ? filePath : null;
}

async function resolveFile(url) {
  const rootPath = safePath(root, url);
  const publicPath = safePath(join(root, "public"), url);
  const fallback = join(root, "public", "index.html");
  const candidates = [publicPath, rootPath, fallback].filter(Boolean);

  for (const candidate of candidates) {
    if (!existsSync(candidate)) continue;
    const info = await stat(candidate);
    if (info.isFile()) return candidate;
  }

  return fallback;
}

createServer(async (request, response) => {
  try {
    const filePath = await resolveFile(request.url || "/");
    response.writeHead(200, {
      "Content-Type": types[extname(filePath)] || "application/octet-stream",
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      "Pragma": "no-cache",
      "Expires": "0",
    });
    createReadStream(filePath).pipe(response);
  } catch (error) {
    response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    response.end(`Server error: ${error.message}`);
  }
}).listen(port, "127.0.0.1", () => {
  console.log(`Miami Lakes Detailing running at http://127.0.0.1:${port}`);
});

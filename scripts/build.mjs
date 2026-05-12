import { cp, mkdir, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const dist = join(root, "dist");
const publicDir = join(root, "public");
const skipPublic = new Set(["index.html", "script.js", "styles.css"]);

async function copyPublic() {
  if (!existsSync(publicDir)) return;

  await cp(publicDir, dist, {
    recursive: true,
    filter: (source) => !skipPublic.has(source.split(/[\\/]/).at(-1)),
  });
}

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
await copyPublic();
await cp(join(root, "index.html"), join(dist, "index.html"));
await cp(join(root, "src"), join(dist, "src"), { recursive: true });

console.log("Build successful: dist/ is ready.");

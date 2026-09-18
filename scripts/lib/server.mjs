import fs from "node:fs/promises";
import path from "node:path";
import http from "node:http";

const types = {
    ".html": "text/html; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".mjs": "text/javascript; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".json": "application/json",
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp",
    ".woff": "font/woff",
    ".woff2": "font/woff2",
    ".ttf": "font/ttf",
    ".mp3": "audio/mpeg",
    ".m4a": "audio/mp4",
    ".wasm": "application/wasm",
};

export async function startServer(root, port = 0) {
    const server = http.createServer(async (request, response) => {
        try {
            const pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
            if (
                pathname.split("/").some((segment) => segment.startsWith(".")) ||
                pathname.startsWith("/node_modules/")
            ) {
                response.writeHead(403).end();
                return;
            }
            const file = path.resolve(
                root,
                `.${pathname.endsWith("/") ? pathname + "index.html" : pathname}`,
            );
            if (!file.startsWith(`${root}${path.sep}`)) {
                response.writeHead(403).end();
                return;
            }
            const contents = await fs.readFile(file);
            response.writeHead(200, {
                "Content-Type": types[path.extname(file)] || "application/octet-stream",
                "Cache-Control": "no-store",
            });
            response.end(request.method === "HEAD" ? undefined : contents);
        } catch (error) {
            response.writeHead(error.code === "ENOENT" ? 404 : 500).end();
        }
    });
    await new Promise((resolve, reject) => {
        server.once("error", reject);
        server.listen(port, "127.0.0.1", resolve);
    });
    return {
        url: `http://127.0.0.1:${server.address().port}/`,
        close: () => new Promise((resolve) => server.close(resolve)),
    };
}

import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { appIdPattern, loadApps, projectRoot, read } from "./lib/project.mjs";

const htmlEscape = (value) =>
    value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");

export async function createApp({ id, label, root = projectRoot }) {
    if (!appIdPattern.test(id || "")) throw new Error("App id must use lowercase kebab-case, e.g. notes");
    if (
        typeof label !== "string" ||
        !label.trim() ||
        [...label].some((character) => character.charCodeAt(0) < 32)
    )
        throw new Error("Provide a one-line display name");
    const apps = await loadApps(root);
    const destination = path.join(root, "src/apps", id);
    if (await fs.stat(destination).catch(() => null))
        throw new Error(`App ${id} already exists; nothing was overwritten`);
    const used = new Set(apps.map((app) => app.shortcut));
    const shortcut = "1234567890".split("").find((key) => !used.has(key)) || null;
    const manifest = JSON.parse(await read(root, "src/apps/_template/manifest.json"));
    const replace = (value, displayName = label) =>
        value
            .replaceAll("__APP_ID__", id)
            .replaceAll("__APP_LABEL__", displayName)
            .replaceAll("__DATE__", new Date().toISOString().slice(0, 10));
    // Replace JSON values after parsing, so quotes/backslashes in names remain data.
    const expand = (value) =>
        typeof value === "string"
            ? replace(value)
            : value && typeof value === "object"
              ? Object.fromEntries(Object.entries(value).map(([key, child]) => [key, expand(child)]))
              : value;
    const newManifest = {
        ...expand(manifest),
        order: Math.max(...apps.map((app) => app.order)) + 1,
        shortcut,
    };
    const staging = await fs.mkdtemp(path.join(root, "src/apps/.scaffold-"));
    try {
        await fs.cp(path.join(root, "src/apps/_template"), staging, { recursive: true });
        for (const file of ["controller.js", "view.html", "styles.css", "window.css", "README.md"]) {
            const contents = await fs.readFile(path.join(staging, file), "utf8");
            await fs.writeFile(
                path.join(staging, file),
                replace(contents, file.endsWith(".html") ? htmlEscape(label) : label),
            );
        }
        await fs.writeFile(path.join(staging, "manifest.json"), JSON.stringify(newManifest, null, 4) + "\n");
        await fs.rename(staging, destination);
    } catch (error) {
        await fs.rm(staging, { recursive: true, force: true });
        throw error;
    }
    return { id, directory: destination, shortcut };
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
    const [id, label = id] = process.argv.slice(2);
    const result = await createApp({ id, label });
    console.log(
        `Created ${result.directory}${result.shortcut ? ` (⌥${result.shortcut})` : ""}. Edit its files, then run npm run build && npm run check.`,
    );
}

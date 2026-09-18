import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
export const read = (root, file) => fs.readFile(path.join(root, file), "utf8");
export const appIdPattern = /^[a-z][a-z0-9-]*$/;

export async function loadApps(root = projectRoot) {
    const folders = await fs.readdir(path.join(root, "src/apps"), { withFileTypes: true });
    const apps = [];
    const orders = new Set();
    const shortcuts = new Set();
    for (const folder of folders) {
        if (!folder.isDirectory() || folder.name.startsWith("_") || folder.name.startsWith(".")) continue;
        const source = `src/apps/${folder.name}`;
        const app = JSON.parse(await read(root, `${source}/manifest.json`));
        const require = (condition, message) => {
            if (!condition) throw new Error(`${source}/manifest.json: ${message}`);
        };
        require(appIdPattern.test(app.id) &&
            app.id === folder.name, "id must match the kebab-case folder name");
        require(Number.isInteger(app.order) &&
            app.order >= 0 &&
            !orders.has(app.order), "order must be a unique non-negative integer");
        orders.add(app.order);
        require(app.shortcut === null ||
            (/^[0-9]$/.test(app.shortcut) &&
                !shortcuts.has(app.shortcut)), "shortcut must be null or a unique digit");
        if (app.shortcut !== null) shortcuts.add(app.shortcut);
        for (const field of ["appLabel", "group", "keywords"])
            require(typeof app[field] === "string" && app[field].trim(), `${field} is required`);
        for (const field of ["title", "subtitle", "dockLabel"]) {
            require(typeof app[field]?.zh === "string" &&
                app[field].zh.trim() &&
                typeof app[field]?.en === "string" &&
                app[field].en.trim(), `${field} needs zh and en text`);
        }
        require(typeof app.icon?.src === "string" &&
            app.icon.src &&
            app.icon.className &&
            app.icon.background, "icon needs src, className, and background");
        const iconPath = path.resolve(root, app.icon.src.split(/[?#]/)[0]);
        require(iconPath.startsWith(`${root}${path.sep}`), "icon must be a local site asset");
        await fs.access(iconPath);
        if (!app.icon.symbol) {
            const { canvas, x, y, size } = app.icon.crop || {};
            require([canvas, x, y, size].every(Number.isInteger) &&
                canvas > 0 &&
                size > 0 &&
                x >= 0 &&
                y >= 0 &&
                x + size <= canvas &&
                y + size <= canvas, "icon needs a valid square source crop");
        }
        for (const file of ["controller.js", "view.html", "styles.css", "window.css", "README.md"])
            await fs.access(path.join(root, source, file));
        apps.push({ ...app, source });
    }
    if (!apps.length) throw new Error("No enabled App folders found");
    return apps.sort((a, b) => a.order - b.order);
}

export async function sourceFiles(root = projectRoot, directory = "src") {
    const result = [];
    for (const entry of await fs.readdir(path.join(root, directory), { withFileTypes: true })) {
        if (entry.name.startsWith("_") || entry.name.startsWith(".")) continue;
        const relative = `${directory}/${entry.name}`;
        if (entry.isDirectory()) result.push(...(await sourceFiles(root, relative)));
        else result.push(relative);
    }
    return result.sort();
}

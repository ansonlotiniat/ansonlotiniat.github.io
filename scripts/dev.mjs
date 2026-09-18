import { watch } from "node:fs";
import { buildSite } from "./build.mjs";
import { projectRoot } from "./lib/project.mjs";
import { startServer } from "./lib/server.mjs";

await buildSite();
const server = await startServer(projectRoot, Number(process.env.PORT || 4173));
console.log(`AnsonOS preview: ${server.url} — save src/ changes, then reload the page.`);
let timer;
let building = false;
let queued = false;
async function rebuild() {
    if (building) {
        queued = true;
        return;
    }
    building = true;
    try {
        const { version } = await buildSite();
        console.log(`Rebuilt ${version}`);
    } catch (error) {
        console.error(error.message);
    } finally {
        building = false;
        if (queued) {
            queued = false;
            void rebuild();
        }
    }
}
const watchers = ["src", "scripts"].map((directory) =>
    watch(`${projectRoot}/${directory}`, { recursive: true }, () => {
        clearTimeout(timer);
        timer = setTimeout(rebuild, 150);
    }),
);
for (const signal of ["SIGINT", "SIGTERM"])
    process.once(signal, async () => {
        clearTimeout(timer);
        watchers.forEach((watcher) => watcher.close());
        await server.close();
        process.exit(0);
    });

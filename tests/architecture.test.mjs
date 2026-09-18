import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { test } from "node:test";
import { chromium } from "playwright";
import { createAppRegistry } from "../src/shared/app-registry.js";
import { createApp } from "../scripts/create-app.mjs";
import { buildSite, compileSite } from "../scripts/build.mjs";
import { loadApps, projectRoot } from "../scripts/lib/project.mjs";
import { scopeAppStyles } from "../scripts/lib/css.mjs";
import { validateArchitecture } from "../scripts/validate-architecture.mjs";
import { startServer } from "../scripts/lib/server.mjs";

test("App lifecycle mounts once, isolates roots, and preserves state across reopen", () => {
    const roots = { '[data-window="one"]': {}, '[data-window="two"]': {} };
    const received = [];
    let mounts = 0;
    const registry = createAppRegistry([{ id: "one" }, { id: "two" }], {
        one: ({ root }) => {
            assert.equal(root, roots['[data-window="one"]']);
            mounts++;
            return {
                open: () => received.push("one-open"),
                close: () => received.push("one-close"),
                languageChanged: () => received.push("one-language"),
            };
        },
        two: ({ root }) => {
            assert.equal(root, roots['[data-window="two"]']);
            mounts++;
            return {
                open: () => received.push("two-open"),
                languageChanged: () => received.push("two-language"),
            };
        },
    });
    const documentRoot = { querySelector: (selector) => roots[selector] };
    registry.mountAll({}, documentRoot);
    registry.mountAll({}, documentRoot);
    registry.notify("one", "open");
    registry.notify("one", "close");
    registry.notify("one", "open");
    registry.languageChanged();
    registry.notify("missing", "open");
    assert.equal(mounts, 2);
    assert.deepEqual(received, ["one-open", "one-close", "one-open", "one-language", "two-language"]);
});

test(
    "A new App builds and runs from its folder on file and HTTP without shell edits",
    { timeout: 120000 },
    async () => {
        const root = await fs.mkdtemp(path.join(os.tmpdir(), "anson-app-contract-"));
        let browser;
        let server;
        try {
            await fs.cp(path.join(projectRoot, "src"), path.join(root, "src"), { recursive: true });
            for (const file of [
                "assets",
                "vendor",
                "JetBrainsMono-Variable.woff2",
                "macao-diary-colophon.png",
            ])
                await fs.symlink(path.join(projectRoot, file), path.join(root, file));
            const before = await fs.readFile(path.join(root, "src/shell/start.js"), "utf8");
            const created = await createApp({ root, id: "contract-notes", label: 'Notes & "Ideas"' });
            assert.equal(created.shortcut, "8");
            await assert.rejects(
                createApp({ root, id: "contract-notes", label: "Overwrite" }),
                /already exists/,
            );
            await assert.rejects(createApp({ root, id: "../escape", label: "Invalid" }), /kebab-case/);
            const { outputs } = await buildSite({ root });
            await buildSite({ root, check: true });
            assert.deepEqual(
                [...outputs],
                [...(await compileSite(root)).outputs],
                "Build output must be deterministic",
            );
            assert.equal(await fs.readFile(path.join(root, "src/shell/start.js"), "utf8"), before);
            assert.equal((await validateArchitecture(root)).apps, 9);

            const executablePath =
                process.env.PLAYWRIGHT_CHROME_EXECUTABLE ||
                (process.platform === "darwin"
                    ? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
                    : undefined);
            browser = await chromium.launch({
                headless: true,
                ...(executablePath ? { executablePath } : {}),
            });
            server = await startServer(root);
            for (const url of [
                pathToFileURL(path.join(root, "index.html")).href,
                `${server.url}index.html`,
            ]) {
                const page = await browser.newPage({
                    viewport: { width: 375, height: 900 },
                    reducedMotion: "reduce",
                });
                const errors = [];
                page.on("pageerror", (error) => errors.push(error.message));
                // The embedded vendor runtime has its own audit. This test isolates scaffolding.
                await page.route("**/assets/vscode-oss/**", (route) => route.abort());
                await page.goto(url);
                await page.locator("body.is-ready").waitFor();
                assert.equal(await page.locator(".dock .launcher-plate").count(), 11);
                assert.equal(await page.locator(".launchpad-app").count(), 9);
                assert.equal(await page.locator("[data-explore-result]").count(), 9);
                const dock = await page.locator(".dock").boundingBox();
                assert.ok(
                    dock.x >= 0 && dock.x + dock.width <= 375,
                    "New App must not overflow the mobile Dock",
                );
                await page.locator('[data-dock-app="contract-notes"]').click();
                const app = page.locator('[data-window="contract-notes"]');
                await app.waitFor({ state: "visible" });
                await app.locator("[data-contract-notes-action]").click();
                assert.match(await app.locator("[data-contract-notes-status]").textContent(), /1/);
                await app.locator('[data-window-action="close"]').click();
                await page.locator('[data-dock-app="contract-notes"]').click();
                await app.locator("[data-contract-notes-action]").click();
                assert.match(await app.locator("[data-contract-notes-status]").textContent(), /2/);
                await page.setViewportSize({ width: 1440, height: 900 });
                await page.locator("[data-language-toggle]").first().click();
                assert.equal(
                    await app.locator("[data-contract-notes-status]").textContent(),
                    "Clicked 2 times",
                );

                // Generic selectors must style this App only, including pseudo-elements.
                const beforeColor = await page
                    .locator(".dock")
                    .evaluate((node) => getComputedStyle(node).color);
                await page.addStyleTag({
                    content: scopeAppStyles(
                        ".dock, button { color: rgb(1, 2, 3) !important; } button::before { content: 'scope'; }",
                        "contract-notes",
                    ),
                });
                await page.waitForFunction(
                    () =>
                        getComputedStyle(document.querySelector("[data-contract-notes-action]")).color ===
                        "rgb(1, 2, 3)",
                );
                assert.equal(
                    await app
                        .locator("[data-contract-notes-action]")
                        .evaluate((node) => getComputedStyle(node).color),
                    "rgb(1, 2, 3)",
                );
                assert.equal(
                    await page.locator(".dock").evaluate((node) => getComputedStyle(node).color),
                    beforeColor,
                );
                assert.deepEqual(errors, []);
                await page.close();
            }
            await fs.appendFile(path.join(root, "main.js"), "\n// stale\n");
            await assert.rejects(buildSite({ root, check: true }), /stale/);
            const controllerPath = path.join(root, "src/apps/contract-notes/controller.js");
            await fs.writeFile(
                controllerPath,
                'import "../../shell/copy.js";\n' + (await fs.readFile(controllerPath, "utf8")),
            );
            await assert.rejects(validateArchitecture(root), /imports outside its App/);
            const manifestPath = path.join(root, "src/apps/contract-notes/manifest.json");
            const manifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));
            manifest.shortcut = "0";
            await fs.writeFile(manifestPath, JSON.stringify(manifest));
            await assert.rejects(loadApps(root), /shortcut/);
        } finally {
            await browser?.close();
            await server?.close();
            await fs.rm(root, { recursive: true, force: true });
        }
    },
);

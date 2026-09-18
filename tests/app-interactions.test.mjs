import assert from "node:assert/strict";
import { test } from "node:test";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "playwright";
import { projectRoot } from "../scripts/lib/project.mjs";
import { startServer } from "../scripts/lib/server.mjs";

test(
    "App-local controllers preserve tabs, documents, search, menus, and locale",
    { timeout: 90000 },
    async () => {
        const executablePath =
            process.env.PLAYWRIGHT_CHROME_EXECUTABLE ||
            (process.platform === "darwin"
                ? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
                : undefined);
        const browser = await chromium.launch({
            headless: true,
            ...(executablePath ? { executablePath } : {}),
        });
        const server = await startServer(projectRoot);
        try {
            for (const url of [pathToFileURL(path.join(projectRoot, "index.html")).href, server.url]) {
                const page = await browser.newPage({
                    viewport: { width: 1440, height: 1000 },
                    reducedMotion: "reduce",
                });
                const errors = [];
                page.on("pageerror", (error) => errors.push(error.message));
                await page.route("**/assets/vscode-oss/**", (route) => route.abort());
                await page.goto(url);
                await page.locator("body.is-ready").waitFor();
                async function open(id) {
                    await page.locator(`[data-dock-app="${id}"]`).click();
                    const root = page.locator(`[data-window="${id}"]`);
                    await root.waitFor({ state: "visible" });
                    return root;
                }
                async function close(root) {
                    await root.locator('[data-window-action="close"]').click();
                }

                const xcode = await open("xcode");
                await xcode.locator('[data-xcode-file="debate"]').click();
                assert.equal(await xcode.locator('[data-xcode-panel="debate"]').isVisible(), true);
                assert.equal(await xcode.locator('[data-xcode-panel="sports"]').isVisible(), false);
                await close(xcode);

                const overleaf = await open("overleaf");
                await overleaf.locator('[data-overleaf-doc="poem"]').click();
                assert.equal(await overleaf.locator('[data-overleaf-preview="poem"]').isVisible(), true);
                assert.equal(await overleaf.locator("[data-current-tex]").textContent(), "between-bells.tex");
                await overleaf.locator("[data-compile-button]").click();
                await page.waitForFunction(
                    () => !document.querySelector("[data-compile-button]").classList.contains("is-compiling"),
                );
                assert.equal(await overleaf.locator("[data-compile-status]").textContent(), "PDF 已更新");
                await close(overleaf);

                const notes = await open("goodnotes");
                await notes.locator('[data-gn-document="calculus"]').first().click();
                await notes.locator('[data-gn-view="editor"]').waitFor({ state: "visible" });
                const firstTitle = await notes.locator("[data-gn-page-title]").textContent();
                await notes.locator("[data-gn-page-toggle]").click();
                await notes.locator('[data-gn-page-number="2"]').click();
                assert.notEqual(await notes.locator("[data-gn-page-title]").textContent(), firstTitle);
                const pages = await notes.locator("[data-gn-page-number]").count();
                await notes.locator("[data-gn-add-page]").click();
                assert.equal(await notes.locator("[data-gn-page-number]").count(), pages + 1);
                await close(notes);

                const books = await open("books");
                await books.locator('[data-books-open="wuthering"]').first().click();
                await books.locator('[data-books-view="reader"]').waitFor({ state: "visible" });
                assert.equal(await books.locator("[data-books-reader-progress]").textContent(), "39%");
                await books.locator("[data-books-reader-back]").click();
                assert.equal(await books.locator('[data-books-view="home"]').isVisible(), true);
                await close(books);

                const netflix = await open("netflix");
                const cards = netflix.locator(".netflix-card");
                assert.equal(await cards.count(), 4);
                await netflix.locator('[data-netflix-view="films"]').click();
                assert.equal(await cards.count(), 1);
                await netflix.locator('[data-netflix-view="home"]').click();
                // The native search field expands on focus.
                await netflix.locator("[data-netflix-search]").focus();
                await netflix.locator("[data-netflix-search]").fill("Suits");
                assert.equal(await cards.count(), 1);
                await netflix.locator("[data-netflix-profile]").click();
                assert.equal(await netflix.locator("[data-netflix-profile-menu]").isVisible(), true);
                await netflix.press("Escape");
                assert.equal(await netflix.locator("[data-netflix-profile-menu]").isVisible(), false);
                await page.locator("[data-language-toggle]").first().click();
                assert.equal(
                    await netflix.locator("[data-netflix-search]").getAttribute("placeholder"),
                    "Titles, people, or genres",
                );
                assert.equal(await overleaf.locator("[data-compile-status]").textContent(), "PDF up to date");
                assert.deepEqual(errors, []);
                await page.close();
            }
        } finally {
            await browser.close();
            await server.close();
        }
    },
);

#!/usr/bin/env node

import fs from "node:fs";
import http from "node:http";
import os from "node:os";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";
import { verifyLauncherContract } from "./launcher-contract.mjs";

const require = createRequire(import.meta.url);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const runtimeModules = path.resolve(path.dirname(process.execPath), "..", "node_modules");
const loadRuntimeModule = (name) => {
    try {
        return require(name);
    } catch {
        return require(path.join(runtimeModules, name));
    }
};
const { chromium } = loadRuntimeModule("playwright");
const { PNG } = loadRuntimeModule("pngjs");

const chromeCandidates = [
    process.env.PLAYWRIGHT_CHROME_EXECUTABLE,
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
].filter(Boolean);
const chromeExecutable = chromeCandidates.find((candidate) => fs.existsSync(candidate));

function invariant(condition, message) {
    if (!condition) throw new Error(message);
}

function near(actual, expected, tolerance, message) {
    invariant(Math.abs(actual - expected) <= tolerance, `${message}: ${actual} vs ${expected}`);
}

function mimeType(file) {
    return ({
        ".css": "text/css; charset=utf-8",
        ".gif": "image/gif",
        ".html": "text/html; charset=utf-8",
        ".ico": "image/x-icon",
        ".jpeg": "image/jpeg",
        ".jpg": "image/jpeg",
        ".js": "text/javascript; charset=utf-8",
        ".json": "application/json; charset=utf-8",
        ".mjs": "text/javascript; charset=utf-8",
        ".mp3": "audio/mpeg",
        ".png": "image/png",
        ".svg": "image/svg+xml",
        ".woff2": "font/woff2",
    })[path.extname(file).toLowerCase()] || "application/octet-stream";
}

async function startStaticServer() {
    const server = http.createServer((request, response) => {
        try {
            const pathname = decodeURIComponent(new URL(request.url || "/", "http://127.0.0.1").pathname);
            let target = path.resolve(root, `.${pathname}`);
            if (target !== root && !target.startsWith(`${root}${path.sep}`)) {
                response.writeHead(403).end("Forbidden");
                return;
            }
            if (fs.existsSync(target) && fs.statSync(target).isDirectory()) target = path.join(target, "index.html");
            if (!fs.existsSync(target) || !fs.statSync(target).isFile()) {
                response.writeHead(404).end("Not found");
                return;
            }
            response.writeHead(200, {
                "Cache-Control": "no-store",
                "Content-Type": mimeType(target),
            });
            fs.createReadStream(target).pipe(response);
        } catch (error) {
            response.writeHead(500).end(String(error));
        }
    });
    await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
    const address = server.address();
    return {
        baseUrl: `http://127.0.0.1:${address.port}/index.html`,
        close: () => new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve())),
    };
}

function filePortfolioUrl(hash = "music") {
    const url = pathToFileURL(path.join(root, "index.html"));
    url.hash = hash;
    return url.href;
}

async function addAudioProbe(context) {
    await context.addInitScript(() => {
        const NativeAudio = window.Audio;
        window.__ansonAudioInstances = [];
        window.Audio = function Audio(...argumentsList) {
            const audio = new NativeAudio(...argumentsList);
            window.__ansonAudioInstances.push(audio);
            return audio;
        };
        window.Audio.prototype = NativeAudio.prototype;
        Object.setPrototypeOf(window.Audio, NativeAudio);
    });
}

async function waitForWindowOpen(page, appId) {
    await page.waitForFunction((id) => {
        const appWindow = document.querySelector(`[data-window="${id}"]`);
        const surface = appWindow?.querySelector(".window-surface");
        if (!surface || appWindow.hidden || appWindow.dataset.minimized === "true") return false;
        const style = getComputedStyle(surface);
        return style.transform === "none" && Number(style.opacity) === 1;
    }, appId, { timeout: 10000 });
}

async function verifyMusicLayout(page, url, width, height) {
    await page.setViewportSize({ width, height });
    await page.goto(url, { waitUntil: "load" });
    await waitForWindowOpen(page, "music");
    const geometry = await page.evaluate(() => {
        const rect = (element) => element?.getBoundingClientRect().toJSON();
        const player = document.querySelector(".music-player");
        const playerRect = rect(player);
        const progressRect = rect(document.querySelector(".music-progress"));
        const firstAlbum = document.querySelector(".music-album");
        const albumRect = rect(firstAlbum);
        const controls = [...document.querySelectorAll(".music-player-actions [data-music-control]")]
            .filter((element) => getComputedStyle(element).display !== "none")
            .map((element) => ({ name: element.dataset.musicControl, rect: rect(element) }));
        return {
            controls,
            main: rect(document.querySelector(".music-main")),
            album: albumRect,
            albumHitTarget: firstAlbum?.contains(document.elementFromPoint(
                albumRect.left + albumRect.width / 2,
                albumRect.top + albumRect.height / 2,
            )),
            player: playerRect,
            playerClientWidth: player.clientWidth,
            playerScrollWidth: player.scrollWidth,
            progress: progressRect,
            rootClientWidth: document.documentElement.clientWidth,
            rootScrollWidth: document.documentElement.scrollWidth,
        };
    });
    invariant(geometry.rootScrollWidth === geometry.rootClientWidth, `${width}px page has horizontal overflow`);
    invariant(geometry.playerScrollWidth === geometry.playerClientWidth, `${width}px player has internal overflow`);
    invariant(geometry.main.width > 0 && geometry.main.height > 0, `${width}px Music library collapsed`);
    invariant(geometry.album.width > 0 && geometry.albumHitTarget, `${width}px first album is not visible and clickable`);
    if (width >= 1001) {
        near(geometry.player.width, 700, 0.05, `${width}px desktop player width`);
        near(geometry.player.height, 54, 0.05, `${width}px desktop player height`);
    }
    for (const control of geometry.controls) {
        invariant(control.rect.left >= geometry.player.left - 0.05, `${width}px ${control.name} escapes player left`);
        invariant(control.rect.right <= geometry.player.right + 0.05, `${width}px ${control.name} escapes player right`);
    }
    const sorted = geometry.controls.toSorted((a, b) => a.rect.left - b.rect.left);
    for (let index = 1; index < sorted.length; index += 1) {
        invariant(sorted[index - 1].rect.right <= sorted[index].rect.left + 0.05, `${width}px actions overlap`);
    }
    if (width <= 900 && sorted.length) {
        invariant(geometry.progress.right <= sorted[0].rect.left + 0.05, `${width}px progress overlaps ${sorted[0].name}`);
    }
}

async function verifyResponsiveMatrix(browser, baseUrl, label) {
    const context = await browser.newContext({ viewport: { width: 1459, height: 1050 } });
    const page = await context.newPage();
    const matrix = [
        [1459, 1050],
        [1120, 850],
        [1001, 800],
        [1000, 800],
        [900, 800],
        [761, 800],
        [760, 800],
        [700, 800],
        [480, 800],
    ];
    for (const [width, height] of matrix) await verifyMusicLayout(page, `${baseUrl}#music`, width, height);
    await context.close();
    console.log(`✓ Music responsive matrix (${label})`);
}

async function verifyDockGeometry(browser) {
    const widths = [1459, 1001, 1000, 761, 760, 480];
    for (const width of widths) {
        const context = await browser.newContext({ viewport: { width, height: 800 } });
        const page = await context.newPage();
        await page.goto(filePortfolioUrl("music"), { waitUntil: "load" });
        await waitForWindowOpen(page, "music");
        await page.waitForFunction(() => !window.gsap
            || window.gsap.getTweensOf(document.querySelectorAll(".dock, .dock-item"))
                .every((tween) => tween.totalProgress() === 1));
        await page.evaluate(() => document.querySelectorAll(".dock-item").forEach((item) => item.classList.add("is-open")));
        const musicIcon = await page.locator('[data-dock-app="music"] .dock-icon').boundingBox();
        await page.mouse.move(musicIcon.x + musicIcon.width / 2, musicIcon.y + musicIcon.height / 2);
        await page.waitForTimeout(620);
        const geometry = await page.evaluate(() => {
            const rect = (element) => element.getBoundingClientRect();
            const records = [...document.querySelectorAll(".dock-item")].map((item) => {
                const icon = rect(item.querySelector(".dock-icon"));
                const visual = rect(item.querySelector(".dock-visual"));
                const dotElement = item.querySelector(".dock-indicator");
                const dot = dotElement ? rect(dotElement) : null;
                return {
                    app: item.dataset.dockApp || "fixed",
                    iconCenter: icon.left + icon.width / 2,
                    iconWidth: icon.width,
                    visualCenter: visual.left + visual.width / 2,
                    dotCenter: dot ? dot.left + dot.width / 2 : null,
                    dotWidth: dot?.width ?? null,
                };
            });
            const glass = rect(document.querySelector(".dock-glass"));
            const icons = [...document.querySelectorAll(".dock-icon")].map(rect);
            const label = document.querySelector(".dock-hover-label");
            const labelRect = rect(label);
            const music = records.find((record) => record.app === "music");
            return {
                glassLeft: glass.left,
                glassRight: glass.right,
                iconLeft: Math.min(...icons.map((icon) => icon.left)),
                iconRight: Math.max(...icons.map((icon) => icon.right)),
                labelCenter: labelRect.left + labelRect.width / 2,
                labelDisplay: getComputedStyle(label).display,
                labelText: label.textContent,
                musicCenter: music.iconCenter,
                records,
            };
        });
        const maximumWidth = Math.max(...geometry.records.map((record) => record.iconWidth));
        if (width > 760) near(maximumWidth, 128, 0.05, `${width}px Dock maximum`);
        else near(maximumWidth, musicIcon.width, 0.05, `${width}px reduced Dock maximum`);
        for (const record of geometry.records) {
            near(record.visualCenter, record.iconCenter, 0.5, `${width}px ${record.app} visual centre`);
            if (record.dotCenter !== null) {
                near(record.dotCenter, record.iconCenter, 0.5, `${width}px ${record.app} dot centre`);
                near(record.dotWidth, 4, 0.05, `${width}px ${record.app} dot size`);
            }
        }
        invariant(geometry.glassLeft <= geometry.iconLeft + 0.05, `${width}px Dock glass misses its first icon`);
        invariant(geometry.glassRight >= geometry.iconRight - 0.05, `${width}px Dock glass misses its last icon`);
        if (width > 760) {
            invariant(geometry.labelText === "Music", `${width}px Dock label did not follow Music`);
            near(geometry.labelCenter, geometry.musicCenter, 0.5, `${width}px Dock label centre`);
        }
        await context.close();
    }
    console.log("✓ Dock pointer sweep and magnification geometry");
}

function pixelAt(image, x, y) {
    const offset = (y * image.width + x) * 4;
    return [image.data[offset], image.data[offset + 1], image.data[offset + 2]];
}

function isGlyphPixel(pixel) {
    return Math.max(...pixel.map((channel) => Math.abs(channel - 247))) > 12;
}

function regionMask(image, region) {
    const [left, top, right, bottom] = region;
    const mask = [];
    for (let y = top; y < bottom; y += 1) {
        for (let x = left; x < right; x += 1) mask.push(isGlyphPixel(pixelAt(image, x, y)));
    }
    return { mask, width: right - left, height: bottom - top };
}

function maskBounds(maskData) {
    const points = [];
    for (let y = 0; y < maskData.height; y += 1) {
        for (let x = 0; x < maskData.width; x += 1) {
            if (maskData.mask[y * maskData.width + x]) points.push([x, y]);
        }
    }
    return {
        left: Math.min(...points.map(([x]) => x)),
        top: Math.min(...points.map(([, y]) => y)),
        right: Math.max(...points.map(([x]) => x)),
        bottom: Math.max(...points.map(([, y]) => y)),
    };
}

function registeredMaskDifference(reference, actual) {
    let best = Number.POSITIVE_INFINITY;
    for (let shiftY = -1; shiftY <= 1; shiftY += 1) {
        for (let shiftX = -1; shiftX <= 1; shiftX += 1) {
            let difference = 0;
            for (let y = 0; y < reference.height; y += 1) {
                for (let x = 0; x < reference.width; x += 1) {
                    const actualX = x - shiftX;
                    const actualY = y - shiftY;
                    const actualPixel = actualX >= 0 && actualX < actual.width && actualY >= 0 && actualY < actual.height
                        ? actual.mask[actualY * actual.width + actualX]
                        : false;
                    if (reference.mask[y * reference.width + x] !== actualPixel) difference += 1;
                }
            }
            best = Math.min(best, difference);
        }
    }
    return best;
}

function dominantGlyphColour(image, region) {
    const [left, top, right, bottom] = region;
    const counts = new Map();
    for (let y = top; y < bottom; y += 1) {
        for (let x = left; x < right; x += 1) {
            const pixel = pixelAt(image, x, y);
            if (Math.max(...pixel.map((channel) => Math.abs(channel - 247))) <= 20) continue;
            const key = pixel.join(",");
            counts.set(key, (counts.get(key) || 0) + 1);
        }
    }
    return [...counts.entries()].toSorted((a, b) => b[1] - a[1])[0][0].split(",").map(Number);
}

async function verifyMusicVisualAndPlayback(browser, url, label) {
    const context = await browser.newContext({ viewport: { width: 1459, height: 1050 }, deviceScaleFactor: 2 });
    await addAudioProbe(context);
    const page = await context.newPage();
    const pageErrors = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));
    await page.goto(`${url}#music`, { waitUntil: "load" });
    await waitForWindowOpen(page, "music");
    await page.locator("[data-music-sidebar-toggle]").click();
    invariant(await page.locator(".music-app").evaluate((element) => element.classList.contains("is-sidebar-hidden")), `${label} Music sidebar did not hide`);
    invariant((await page.locator(".music-main").boundingBox()).width > 0, `${label} hidden sidebar collapsed the library`);
    await page.locator(".music-album").first().click();
    await page.locator("[data-music-sidebar-toggle]").click();
    await page.waitForFunction(() => {
        const audio = window.__ansonAudioInstances.at(-1);
        return audio && !audio.paused && audio.readyState === 4 && audio.currentTime > 0.15;
    }, null, { timeout: 12000 });
    const firstTitle = await page.locator("[data-music-player-title]").textContent();
    await page.locator('[data-music-control="next"]').click();
    await page.waitForFunction((title) => {
        const audio = window.__ansonAudioInstances.at(-1);
        return document.querySelector("[data-music-player-title]").textContent !== title
            && audio && !audio.paused && audio.readyState === 4;
    }, firstTitle, { timeout: 12000 });
    invariant(await page.locator('[data-music-control="play"]').evaluate((element) => element.classList.contains("is-playing")), `${label} next did not continue playback`);
    invariant(pageErrors.length === 0, `${label} Music emitted application errors: ${pageErrors.join(" | ")}`);
    await page.mouse.move(800, 200);
    await page.waitForTimeout(80);

    const screenshotPath = path.join(os.tmpdir(), `anson-music-player-${process.pid}-${label}.png`);
    await page.locator(".music-player").screenshot({ path: screenshotPath });
    if (label === "file") {
        const reference = PNG.sync.read(fs.readFileSync(path.join(root, "tests/fixtures/music-player-latest-reference.png")));
        const actual = PNG.sync.read(fs.readFileSync(screenshotPath));
        invariant(actual.width === reference.width && actual.height === reference.height, "Music fixture dimensions changed");
        const regions = {
            shuffle: [25, 30, 68, 78],
            previous: [72, 30, 130, 78],
            pause: [140, 25, 190, 82],
            next: [202, 30, 260, 78],
            repeat: [265, 30, 310, 78],
            more: [1008, 35, 1065, 75],
            lyrics: [1095, 25, 1158, 82],
            queue: [1174, 30, 1230, 78],
            airplay: [1247, 25, 1305, 82],
            volume: [1315, 25, 1380, 82],
        };
        let silhouetteDifference = 0;
        for (const [name, region] of Object.entries(regions)) {
            const expectedMask = regionMask(reference, region);
            const actualMask = regionMask(actual, region);
            const expectedBounds = maskBounds(expectedMask);
            const actualBounds = maskBounds(actualMask);
            for (const edge of ["left", "top", "right", "bottom"]) {
                near(actualBounds[edge], expectedBounds[edge], 1, `${name} ${edge} device-pixel bound`);
            }
            silhouetteDifference += registeredMaskDifference(expectedMask, actualMask);
            const expectedColour = dominantGlyphColour(reference, region);
            const actualColour = dominantGlyphColour(actual, region);
            invariant(
                Math.max(...expectedColour.map((channel, index) => Math.abs(channel - actualColour[index]))) <= 3,
                `${name} core colour differs: ${actualColour.join(",")} vs ${expectedColour.join(",")}`,
            );
        }
        const silhouetteRatio = silhouetteDifference / (reference.width * reference.height);
        invariant(silhouetteRatio <= 0.005, `Music registered silhouette diff is ${(silhouetteRatio * 100).toFixed(3)}%`);
    }
    fs.unlinkSync(screenshotPath);
    await context.close();
    console.log(`✓ Music one-click playback and visual contract (${label})`);
}

async function verifyWindowSmoke(browser, url) {
    const context = await browser.newContext({ viewport: { width: 1459, height: 1050 } });
    const page = await context.newPage();
    await page.goto(url, { waitUntil: "load" });
    await page.waitForTimeout(220);
    const appIds = await page.evaluate(() => [...document.querySelectorAll("[data-dock-app]")].map((item) => item.dataset.dockApp));
    for (const appId of appIds) {
        await page.locator(`[data-dock-app="${appId}"]`).evaluate((element) => element.click());
        await waitForWindowOpen(page, appId);
        const window = page.locator(`[data-window="${appId}"]`);
        invariant(await window.isVisible(), `${appId} did not open`);
        invariant(await window.evaluate((element) => element.classList.contains("is-focused")), `${appId} did not focus`);
        const before = await window.boundingBox();
        invariant(
            before.x >= -0.5 && before.y >= 30
                && before.x + before.width <= 1459.5
                && before.y + before.height <= 1050.5,
            `${appId} opened outside the desktop`,
        );

        const dragHandle = window.locator("[data-drag-handle]").first();
        const dragPoint = await dragHandle.evaluate((element) => {
            const rect = element.getBoundingClientRect();
            for (let y = rect.top + 4; y < rect.bottom; y += 6) {
                for (let x = rect.left + 4; x < rect.right; x += 6) {
                    const target = document.elementFromPoint(x, y);
                    if (target && element.contains(target) && !target.closest("button, a, input, label, [role='button']")) return { x, y };
                }
            }
            return null;
        });
        invariant(dragPoint, `${appId} has no usable drag point`);
        await page.mouse.move(dragPoint.x, dragPoint.y);
        await page.mouse.down();
        await page.mouse.move(dragPoint.x + 8, dragPoint.y + 6, { steps: 3 });
        await page.mouse.up();
        const afterDrag = await window.boundingBox();
        invariant(Math.abs(afterDrag.x - before.x) >= 2 || Math.abs(afterDrag.y - before.y) >= 2, `${appId} did not drag`);

        await window.locator('[data-window-action="minimize"]').click();
        await page.waitForTimeout(460);
        invariant(await window.getAttribute("data-minimized") === "true", `${appId} did not minimize`);
        const dockItem = page.locator(`[data-dock-app="${appId}"]`);
        invariant(await dockItem.evaluate((element) => element.classList.contains("is-minimized")), `${appId} Dock state missed minimize`);
        await dockItem.evaluate((element) => element.click());
        await waitForWindowOpen(page, appId);
        invariant(await window.isVisible() && await window.getAttribute("data-minimized") === "false", `${appId} did not restore`);
        await window.locator('[data-window-action="close"]').click();
        await page.waitForTimeout(260);
        invariant(await window.isHidden(), `${appId} did not close`);
    }
    invariant(await page.evaluate(() => document.documentElement.scrollWidth === document.documentElement.clientWidth), "Desktop smoke pass introduced horizontal overflow");
    await context.close();

    const mobile = await browser.newContext({ viewport: { width: 480, height: 800 } });
    const mobilePage = await mobile.newPage();
    await mobilePage.goto(url, { waitUntil: "load" });
    for (const appId of appIds) {
        await mobilePage.locator(`[data-dock-app="${appId}"]`).evaluate((element) => element.click());
        await mobilePage.waitForTimeout(80);
        const bounds = await mobilePage.locator(`[data-window="${appId}"]`).boundingBox();
        invariant(bounds.x >= -0.5 && bounds.x + bounds.width <= 480.5, `${appId} mobile window escapes horizontally`);
        invariant(await mobilePage.evaluate(() => document.documentElement.scrollWidth === document.documentElement.clientWidth), `${appId} mobile view overflows root`);
        await mobilePage.locator(`[data-window="${appId}"] [data-window-action="close"]`).click();
    }
    await mobile.close();
    console.log("✓ All App open/focus/drag/minimize/restore/close smoke pass");
}

const server = await startStaticServer();
const browser = await chromium.launch({
    headless: true,
    ...(chromeExecutable ? { executablePath: chromeExecutable } : {}),
});

try {
    await verifyLauncherContract(browser, filePortfolioUrl().split("#")[0], "file", PNG);
    await verifyLauncherContract(browser, server.baseUrl, "http", PNG);
    if (process.env.ANSON_TEST_GROUP !== "icons") {
        await verifyResponsiveMatrix(browser, filePortfolioUrl().split("#")[0], "file");
        await verifyResponsiveMatrix(browser, server.baseUrl, "http");
        await verifyDockGeometry(browser);
        await verifyMusicVisualAndPlayback(browser, filePortfolioUrl().split("#")[0], "file");
        await verifyMusicVisualAndPlayback(browser, server.baseUrl, "http");
        await verifyWindowSmoke(browser, server.baseUrl);
    }
    console.log("UI runtime audit passed.");
} finally {
    await browser.close();
    await server.close();
}

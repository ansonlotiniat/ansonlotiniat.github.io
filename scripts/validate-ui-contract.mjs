#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const failures = [];
const check = (condition, message) => {
    if (!condition) failures.push(message);
};

const index = read("index.html");
const main = read("main.js");
const apps = read("apps.config.js");
const style = read("style.css");
const macos = read("macos.css");
const dock = read("dock.css");
const music = read("music.css");
const icons = read("icons.css");
const ownerSelector = /\.(?:dock|music)(?:\b|-)/;

for (const [file, css] of [["style.css", style], ["macos.css", macos]]) {
    check(!ownerSelector.test(css), `${file} contains Dock/Music-owned selectors`);
}
check(!/\.music(?:\b|-)/.test(dock), "dock.css contains a Music-owned selector");
check(!/\.dock(?:\b|-)/.test(music), "music.css contains a Dock-owned selector");
check(!ownerSelector.test(icons), "icons.css contains launcher-container geometry owned by Dock/Music");

for (const match of music.matchAll(/:(?:nth-child|first-child|last-child)\b/g)) {
    const start = Math.max(music.lastIndexOf("}", match.index), music.lastIndexOf("{", match.index)) + 1;
    const end = music.indexOf("{", match.index);
    const selector = music.slice(start, end < 0 ? match.index : end).trim();
    check(
        !/\.music-(?:transport|player-actions)\b/.test(selector),
        `Music player control depends on DOM order: ${selector}`,
    );
}

const semanticControlScopes = [
    ".netflix-navigation",
    ".gn-note-toolbar",
    ".gn-library-toolbar",
    ".books-reader-toolbar",
    ".books-primary-nav",
];
for (const [file, css] of [["style.css", style], ["macos.css", macos]]) {
    for (const match of css.matchAll(/:(?:nth-child|nth-of-type|first-child|last-child)\b/g)) {
        const start = Math.max(css.lastIndexOf("}", match.index), css.lastIndexOf("{", match.index)) + 1;
        const end = css.indexOf("{", match.index);
        const selector = css.slice(start, end < 0 ? match.index : end).trim();
        check(
            !semanticControlScopes.some((scope) => selector.includes(scope)),
            `${file} control depends on DOM order: ${selector}`,
        );
    }
}

for (const match of music.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const [, selector, declarations] = match;
    if (/\.music-player-actions\b/.test(selector)) {
        check(!/margin-(?:left|right)\s*:/.test(declarations), `Music action uses a margin chain: ${selector.trim()}`);
    }
}

const playerMarkup = index.match(/<footer class="music-player"[\s\S]*?<\/footer>/)?.[0] || "";
const requiredControls = ["shuffle", "previous", "play", "next", "repeat", "autoplay", "more", "lyrics", "queue", "airplay", "volume"];
const controls = [...playerMarkup.matchAll(/data-music-control="([^"]+)"/g)].map((match) => match[1]);
check(
    controls.length === requiredControls.length && requiredControls.every((control) => controls.includes(control)),
    `Music controls differ from the contract: ${controls.join(", ") || "none"}`,
);
check(new Set(controls).size === controls.length, "Music controls contain duplicate data-music-control values");

check(main.includes('visual.className = "dock-visual"'), "Dock visual wrapper is not constructed");
check(main.includes("getDockVisualRect(dockButton)"), "Dock animation endpoint bypasses getDockVisualRect()");
check(main.includes('dockMetric("--dock-maximum-size"'), "Dock maximum size is not read from CSS");
check(!main.includes("128 / 58"), "Dock magnification contains the retired 128/58 constant chain");
check(dock.includes("--dock-resting-size:"), "dock.css is missing --dock-resting-size");
check(dock.includes("--dock-slot-size:"), "dock.css is missing --dock-slot-size");
check(dock.includes("--dock-maximum-size:"), "dock.css is missing --dock-maximum-size");
check(!apps.includes('className: "music-icon"'), "The Apple Music App icon collides with the Music SVG class");
check(main.includes('plate.className = "launcher-plate"'), "Launchers are missing their shared artwork plate");
check(main.includes("appIcon(window.ANSON_SHELL_ICONS.apps") && main.includes("appIcon(window.ANSON_SHELL_ICONS.mail"), "Fixed launchers bypass shared icon rendering");
check(icons.includes("round(nearest,"), "Launcher plates are not snapped to integer pixels");
for (const [file, css] of [["style.css", style], ["macos.css", macos], ["dock.css", dock]]) {
    check(!/\.(?:netflix|overleaf)-icon(?:\s|:|\{)/.test(css), `${file} contains a retired per-icon geometry override`);
}

const contractVersion = index.match(/<meta name="anson-ui-contract-version" content="([^"]+)">/)?.[1];
check(Boolean(contractVersion), "index.html is missing the UI contract version meta tag");
for (const asset of ["style.css", "macos.css", "dock.css", "music.css", "icons.css", "apps.config.js", "main.js"]) {
    const escaped = asset.replace(".", "\\.");
    const version = index.match(new RegExp(`(?:href|src)="${escaped}\\?v=([^"]+)"`))?.[1];
    check(version === contractVersion, `${asset} cache version ${version || "missing"} does not match ${contractVersion || "the contract"}`);
}

if (failures.length) {
    console.error(`UI contract failed (${failures.length}):`);
    for (const failure of failures) console.error(`- ${failure}`);
    process.exit(1);
}

console.log("UI contract passed: Dock and Music ownership, structure, semantics, and cache versions are consistent.");

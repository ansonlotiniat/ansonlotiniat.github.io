#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const configPath = path.join(root, "apps.config.js");
const htmlPath = path.join(root, "index.html");
const mainPath = path.join(root, "main.js");
const errors = [];

const source = fs.readFileSync(configPath, "utf8");
const sandbox = { window: {} };
vm.runInNewContext(source, sandbox, { filename: configPath });

const apps = sandbox.window.ANSON_APP_MANIFEST;
const html = fs.readFileSync(htmlPath, "utf8");
const main = fs.readFileSync(mainPath, "utf8");
const fixedShellAssets = [
    "assets/app-icons/apps.png",
    "assets/app-icons/home-folder.png",
    "assets/app-icons/mail.png",
];

if (!Array.isArray(apps) || apps.length === 0) {
    errors.push("apps.config.js must expose a non-empty window.ANSON_APP_MANIFEST array.");
}

const ids = new Set();
const shortcuts = new Set();
const requiredLocalizedFields = ["title", "subtitle", "dockLabel"];

for (const [index, app] of (apps || []).entries()) {
    const location = `manifest item ${index + 1}`;

    if (!app.id || !/^[a-z][a-z0-9-]*$/.test(app.id)) {
        errors.push(`${location}: id must use lowercase kebab-case.`);
    } else if (ids.has(app.id)) {
        errors.push(`${location}: duplicate id "${app.id}".`);
    } else {
        ids.add(app.id);
    }

    if (!app.appLabel || !app.group || !app.keywords) {
        errors.push(`${location}: appLabel, group, and keywords are required.`);
    }

    if (!app.shortcut || !/^[0-9]$/.test(app.shortcut)) {
        errors.push(`${location}: shortcut must be one digit.`);
    } else if (shortcuts.has(app.shortcut)) {
        errors.push(`${location}: duplicate shortcut "⌥${app.shortcut}".`);
    } else {
        shortcuts.add(app.shortcut);
    }

    for (const field of requiredLocalizedFields) {
        if (!app[field]?.zh || !app[field]?.en) {
            errors.push(`${location}: ${field}.zh and ${field}.en are required.`);
        }
    }

    if (!app.icon?.src || !app.icon?.className) {
        errors.push(`${location}: icon.src and icon.className are required.`);
    } else if (!fs.existsSync(path.join(root, app.icon.src))) {
        errors.push(`${location}: icon does not exist at "${app.icon.src}".`);
    }
}

const windowIds = new Set(
    [...html.matchAll(/\bdata-window="([^"]+)"/g)].map((match) => match[1]),
);
const exploreFilterValues = [
    ...html.matchAll(/\bdata-explore-filter="([^"]*)"/g),
].map((match) => match[1].trim().toLocaleLowerCase());

for (const id of ids) {
    if (!windowIds.has(id)) {
        errors.push(`manifest app "${id}" has no matching data-window="${id}".`);
    }
}

for (const id of windowIds) {
    if (!ids.has(id)) {
        errors.push(`data-window="${id}" has no matching manifest entry.`);
    }
}

if (!html.includes("data-dock")) {
    errors.push("index.html is missing the data-dock launcher mount.");
}

if (!html.includes("data-explore-results")) {
    errors.push("index.html is missing the data-explore-results mount.");
}

if (!html.includes('id="explore"')) {
    errors.push('index.html is missing id="explore" for the Dock Apps launcher.');
}

if (!main.includes("dataset.dockExplore")) {
    errors.push("main.js is missing the fixed macOS Apps launcher.");
}

for (const asset of fixedShellAssets) {
    if (!fs.existsSync(path.join(root, asset))) {
        errors.push(`fixed shell asset does not exist at "${asset}".`);
    }
}

if (!exploreFilterValues.includes("")) {
    errors.push("Tahoe Explore filters must include an empty All Apps filter.");
}

const uniqueExploreFilters = new Set();
for (const filter of exploreFilterValues) {
    if (uniqueExploreFilters.has(filter)) {
        errors.push(`duplicate Explore filter "${filter || "All Apps"}".`);
        continue;
    }
    uniqueExploreFilters.add(filter);
    if (filter && !(apps || []).some((app) => app.keywords.toLocaleLowerCase().includes(filter))) {
        errors.push(`Explore filter "${filter}" matches no manifest keywords.`);
    }
}

const configIndex = html.indexOf('src="apps.config.js"');
const mainIndex = html.indexOf('src="main.js"');
if (configIndex < 0 || mainIndex < 0 || configIndex > mainIndex) {
    errors.push("apps.config.js must load before main.js.");
}

if (errors.length) {
    console.error(`App manifest validation failed with ${errors.length} error(s):`);
    errors.forEach((error) => console.error(`- ${error}`));
    process.exitCode = 1;
} else {
    console.log(
        `App manifest OK: ${apps.length} apps, ${windowIds.size} windows, `
        + `${shortcuts.size} unique shortcuts, ${uniqueExploreFilters.size} Explore filters, `
        + `${fixedShellAssets.length} fixed shell icons, and all paths resolved.`,
    );
}

#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const configPath = path.join(root, "apps.config.js");
const htmlPath = path.join(root, "index.html");
const errors = [];

const source = fs.readFileSync(configPath, "utf8");
const sandbox = { window: {} };
vm.runInNewContext(source, sandbox, { filename: configPath });

const apps = sandbox.window.ANSON_APP_MANIFEST;
const html = fs.readFileSync(htmlPath, "utf8");

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
        + `${shortcuts.size} unique shortcuts, and all icons resolved.`,
    );
}

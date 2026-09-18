import path from "node:path";
import { pathToFileURL } from "node:url";
import { parse, parseFragment } from "parse5";
import postcss from "postcss";
import { compileSite } from "./build.mjs";
import { projectRoot, read } from "./lib/project.mjs";

export async function validateArchitecture(root = projectRoot) {
    const { apps, outputs, metafile } = await compileSite(root);
    const failures = [];
    const check = (ok, message) => {
        if (!ok) failures.push(message);
    };
    for (const [file, input] of Object.entries(metafile.inputs)) {
        const app = file.match(/^src\/apps\/([^/]+)\//)?.[1];
        for (const dependency of input.imports) {
            if (app)
                check(
                    dependency.path.startsWith(`src/apps/${app}/`) ||
                        dependency.path.startsWith("src/shared/"),
                    `${file} imports outside its App/shared boundary: ${dependency.path}`,
                );
            if (file.startsWith("src/shared/"))
                check(
                    dependency.path.startsWith("src/shared/"),
                    `${file} imports a higher layer: ${dependency.path}`,
                );
            if (file.startsWith("src/shell/"))
                check(
                    !dependency.path.startsWith("src/apps/"),
                    `${file} directly imports an App; registration must be automatic`,
                );
        }
    }
    const ids = new Set();
    const references = [];
    const appLinks = [];
    const visit = (node) => {
        const attr = (name) => node.attrs?.find((item) => item.name === name)?.value;
        if (attr("data-open-app")) appLinks.push(attr("data-open-app"));
        if (attr("id")) {
            check(!ids.has(attr("id")), `Duplicate HTML id: ${attr("id")}`);
            ids.add(attr("id"));
        }
        for (const name of ["aria-labelledby", "aria-describedby", "aria-controls"]) {
            for (const id of (attr(name) || "").split(/\s+/).filter(Boolean)) references.push(id);
        }
        node.childNodes?.forEach(visit);
    };
    visit(parse(outputs.get("index.html")));
    for (const id of references) check(ids.has(id), `Missing ARIA target: ${id}`);
    for (const id of appLinks)
        check(
            apps.some((app) => app.id === id),
            `Link targets an unregistered App: ${id}`,
        );
    for (const app of apps) {
        const fragment = parseFragment(await read(root, `${app.source}/view.html`));
        const elements = fragment.childNodes.filter((node) => node.tagName);
        check(
            elements.length === 1 &&
                elements[0].attrs.some((attr) => attr.name === "data-window" && attr.value === app.id),
            `${app.source}/view.html needs exactly one matching App root`,
        );
        const view = await read(root, `${app.source}/view.html`);
        for (const action of ["close", "minimize", "maximize"])
            check(
                view.includes(`data-window-action="${action}"`),
                `${app.id} is missing the ${action} control`,
            );
        check(
            !/<(?:script|style)\b/i.test(view),
            `${app.id}: scripts/styles belong in the controller/stylesheets`,
        );
        for (const name of ["styles.css", "window.css"]) {
            const sheet = postcss.parse(await read(root, `${app.source}/${name}`));
            sheet.walkRules((rule) => {
                if (rule.parent.type === "atrule" && /keyframes$/.test(rule.parent.name)) return;
                check(
                    !/\.(?:dock|launchpad|explore|launcher|menu-bar)(?:\b|-)/.test(rule.selector),
                    `${app.source}/${name} overrides shell/launcher geometry: ${rule.selector}`,
                );
                for (const other of apps.filter((item) => item.id !== app.id))
                    check(
                        !rule.selector.includes(`[data-window="${other.id}"]`),
                        `${app.id} stylesheet targets ${other.id}`,
                    );
            });
        }
    }
    check(
        !outputs.get("index.html").includes('type="module"'),
        "Deployment HTML must retain classic-script file:// compatibility",
    );
    if (failures.length) throw new Error(`Architecture validation failed:\n- ${failures.join("\n- ")}`);
    return { apps: apps.length, modules: Object.keys(metafile.inputs).length };
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
    const result = await validateArchitecture();
    console.log(
        `Architecture OK: ${result.apps} isolated Apps, ${result.modules} build inputs, HTML/ARIA contracts, automatic registration, scoped CSS.`,
    );
}

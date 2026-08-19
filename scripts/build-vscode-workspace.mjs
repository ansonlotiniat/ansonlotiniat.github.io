import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const vscodeRoot = path.join(projectRoot, "assets", "vscode-oss");
const corePath = path.join(vscodeRoot, "out", "vs", "workbench", "workbench.web.main.internal.js");
const bootstrapPath = path.join(vscodeRoot, "bootstrap.js");
const fileRuntimePath = path.join(vscodeRoot, "workbench.file.js");
const workspaceDataPath = path.join(vscodeRoot, "workspace-data.js");

const folders = [
    { name: "START HERE", root: "00-START-HERE" },
    { name: "ALGORITHMS", root: "01-ALGORITHMS" },
    { name: "OPEN SOURCE", root: "02-OPEN-SOURCE" },
    { name: "ANSON OS", root: "03-ANSON-OS" },
];

const githubSources = [
    // Complete text source/test trees from Anson's public MIT algorithm projects.
    ...algorithmProject("01-ALGORITHMS/graph/food-rescue-network", "food-rescue-network", "716c805e0e7bfe2d4614dd9df6b24bf49835ecef", "test/food-rescue-network.test.ts"),
    ...algorithmProject("01-ALGORITHMS/routing/shelter-route", "shelter-route", "d1eb3f37be3db6277d85ece20d9f60f245b0d91b", "test/shelter-route.test.ts"),
    ...algorithmProject("01-ALGORITHMS/pareto/grant-equity-allocator", "grant-equity-allocator", "6437759b5360b324e5adfe66fd160c14b7c7f164", "test/grant-equity-allocator.test.ts"),
    ...algorithmProject("01-ALGORITHMS/lint/accessibility-lint", "accessibility-lint", "0ef5309e9d9eb8ed27b35410f9b82821312f7261", "test/accessibility-lint.test.ts"),

    // Complete text source/runtime trees from three larger public projects.
    ...githubTree("02-OPEN-SOURCE/agent-trust", "agent-trust", "185f1a25bfb84126786bfce1c85ac3f4e9e9258e", [
        "README.md", "CHANGELOG.md", "LICENSE", "package.json", "package-lock.json",
        "examples/policy.strict.json",
        "lib/analyze.js", "lib/audit.js", "lib/check.js", "lib/cli.js", "lib/colors.js",
        "lib/config.js", "lib/decision.js", "lib/doctor.js", "lib/env.js", "lib/filewalk.js",
        "lib/format.js", "lib/mcp.js", "lib/networkProxy.js", "lib/paths.js", "lib/policy.js",
        "lib/prompt.js", "lib/risk.js", "lib/run.js", "lib/sandbox.js", "lib/scan.js",
        "lib/secrets.js", "lib/shim.js", "lib/types.js",
        "scripts/test.mjs", "scripts/verify-lib.mjs",
    ]),

    ...githubTree("02-OPEN-SOURCE/latexmark", "latexmark", "eb4c6e0a10d48891e324fbf5dcd5428326d59455", [
        "README.md", "CHANGELOG.md", "LICENSE", "MANIFEST.in", "RELEASE.md",
        "bin/latexmark.js", "latexmark.py", "latexmark_dashboard.jsx", "package.json", "pyproject.toml",
        "packaging/aur/PKGBUILD", "packaging/homebrew/latexmark.rb",
        "src/latexmark/__init__.py", "src/latexmark/__main__.py", "src/latexmark/cli.py",
        "src/latexmark/tui.py", "tests/test_cli.py",
    ]),

    ...githubTree("02-OPEN-SOURCE/gm2-conflict-aware-hvp", "gm2-conflict-aware-hvp", "fbd66ace7e3252fef5c89c50ab580636c3a5f3c5", [
        "README.md", "LICENSE", "requirements.txt",
        "analysis/figures.py", "analysis/headline.py", "analysis/meta.py", "analysis/revision.py",
        "analysis/structures.py", "data/inputs.json", "results/headline.json", "results/results.json",
        "results/revision.json",
    ]),
];

const localSources = [
    { target: "03-ANSON-OS/apps.config.js", source: "apps.config.js" },
    { target: "03-ANSON-OS/scripts/build-vscode-workspace.mjs", source: "scripts/build-vscode-workspace.mjs" },
    { target: "03-ANSON-OS/scripts/validate-apps.mjs", source: "scripts/validate-apps.mjs" },
    { target: "03-ANSON-OS/vscode/bootstrap.js", source: "assets/vscode-oss/bootstrap.js" },
    { target: "03-ANSON-OS/vscode/workspace-search.js", source: "assets/vscode-oss/workspace-search.js" },
    { target: "03-ANSON-OS/vscode/WORKSPACES.md", source: "assets/vscode-oss/WORKSPACES.md" },
];

function github(target, repo, commit, source) {
    return {
        target,
        repo,
        commit,
        source,
        url: `https://raw.githubusercontent.com/ansonlotiniat/${repo}/${commit}/${source}`,
    };
}

function githubTree(prefix, repo, commit, sources) {
    return sources.map((source) => github(`${prefix}/${source}`, repo, commit, source));
}

function algorithmProject(prefix, repo, commit, testFile) {
    return githubTree(prefix, repo, commit, [
        "README.md", "LICENSE", "package.json", "package-lock.json", "tsconfig.json", "vitest.config.ts",
        "src/core/geo.ts", "src/core/graph.ts", "src/core/index.ts", "src/core/optimization.ts",
        "src/core/stats.ts", "src/index.ts", testFile,
    ]);
}

function sha256(value) {
    return createHash("sha256").update(value).digest("hex");
}

async function fetchPinnedSource(source) {
    const response = await fetch(source.url, { headers: { "User-Agent": "ansonos-workspace-builder" } });
    if (!response.ok) throw new Error(`Unable to fetch ${source.repo}/${source.source}: HTTP ${response.status}`);
    return (await response.text()).replaceAll("\r\n", "\n");
}

function generatedFiles() {
    return [
        {
            path: "00-START-HERE/README.md",
            content: `# Anson's public code workspace

This is a curated, source-grounded snapshot mounted inside the real Code - OSS explorer.

## Folders

- **ALGORITHMS** — shortest path, min-cost max-flow, equitable allocation, flood-aware routing, and accessibility analysis.
- **OPEN SOURCE** — complete text source/runtime trees from Agent Trust, LaTeXMark, and the conflict-aware muon g-2 analysis.
- **ANSON OS** — the manifest, validator, and Code - OSS bootstrap used by this website.

Every remote file is pinned to a public Git commit. Private repositories, credentials, local paths, build secrets, and unpublished files are excluded. Edits live only in the browser's temporary memory and reset on reload.

See \`SOURCES.md\` in each folder for exact provenance.
`,
        },
        {
            path: "01-ALGORITHMS/README.md",
            content: `# Algorithms

These are real implementations from Anson's public MIT-licensed projects, reorganized by algorithm so they are easy to inspect.

- \`graph/food-rescue-network/\` — binary heap, Dijkstra, min-cost max-flow, and capacity-constrained surplus-food matching.
- \`routing/shelter-route/\` — shortest-path routing with flood and accessibility penalties.
- \`pareto/grant-equity-allocator/\` — Pareto filtering plus proportional budget allocation.
- \`lint/accessibility-lint/\` — static accessibility rules and contrast checking.

Each folder preserves the repository's original \`src/\`, \`test/\`, package metadata, and MIT licence so imports remain intact.
`,
        },
        {
            path: "01-ALGORITHMS/SOURCES.md",
            content: algorithmSourcesMarkdown(),
        },
        {
            path: "02-OPEN-SOURCE/SOURCES.md",
            content: openSourceMarkdown(),
        },
        {
            path: "03-ANSON-OS/README.md",
            content: `# AnsonOS source

Selected files from the website currently running around this editor:

- \`apps.config.js\` — the single App manifest used by Dock, Launchpad, Spotlight, labels, icons, and shortcuts.
- \`scripts/build-vscode-workspace.mjs\` — the reproducible pinned-source workspace builder.
- \`scripts/validate-apps.mjs\` — consistency checks for every registered App surface.
- \`vscode/bootstrap.js\` — the Code - OSS embedder and temporary workspace mount.
- \`vscode/workspace-search.js\` — file and content search for the in-memory public source tree.
- \`vscode/WORKSPACES.md\` — exact repository, privacy, and runtime integration notes.

This root reflects the current local build being tested, not a private project checkout.
`,
        },
    ];
}

function algorithmSourcesMarkdown() {
    return `# Algorithm source map

| Workspace folder | Public repository | Pinned commit | Included tree |
| --- | --- | --- | --- |
| graph/food-rescue-network | [food-rescue-network](https://github.com/ansonlotiniat/food-rescue-network) | \`716c805\` | source, shared core, test, package metadata, licence |
| routing/shelter-route | [shelter-route](https://github.com/ansonlotiniat/shelter-route) | \`d1eb3f3\` | source, shared core, test, package metadata, licence |
| pareto/grant-equity-allocator | [grant-equity-allocator](https://github.com/ansonlotiniat/grant-equity-allocator) | \`6437759\` | source, shared core, test, package metadata, licence |
| lint/accessibility-lint | [accessibility-lint](https://github.com/ansonlotiniat/accessibility-lint) | \`0ef5309\` | source, shared core, test, package metadata, licence |
`;
}

function openSourceMarkdown() {
    return `# Open-source source map

| Folder | Public repository | Pinned commit | Licence |
| --- | --- | --- | --- |
| agent-trust | [agent-trust](https://github.com/ansonlotiniat/agent-trust) | \`185f1a2\` | Apache-2.0 |
| latexmark | [latexmark](https://github.com/ansonlotiniat/latexmark) | \`eb4c6e0\` | MIT |
| gm2-conflict-aware-hvp | [gm2-conflict-aware-hvp](https://github.com/ansonlotiniat/gm2-conflict-aware-hvp) | \`fbd66ac\` | MIT |

The complete text source/runtime tree needed to inspect each bundled project is included. Generated binary figures, preview images, GitHub administration files, and unrelated release collateral are omitted. Repository licences are retained inside each folder.
`;
}

async function buildWorkspaceData() {
    const files = generatedFiles();
    const remote = await Promise.all(githubSources.map(async (source) => ({
        path: source.target,
        content: await fetchPinnedSource(source),
        provenance: {
            repo: source.repo,
            commit: source.commit,
            source: source.source,
        },
    })));
    files.push(...remote);

    for (const source of localSources) {
        files.push({
            path: source.target,
            content: await readFile(path.join(projectRoot, source.source), "utf8"),
            provenance: { local: source.source },
        });
    }

    files.sort((a, b) => a.path.localeCompare(b.path));
    const data = {
        version: 1,
        generated: "2026-08-09",
        workspaceUri: "tmp:/Anson-Public-Code.code-workspace",
        folders,
        files,
    };
    const output = `/* Generated by scripts/build-vscode-workspace.mjs. */\n` +
        `globalThis.__ANSON_VSCODE_WORKSPACE = ${JSON.stringify(data)};\n`;
    await writeFile(workspaceDataPath, output);
    return { bytes: Buffer.byteLength(output), sha: sha256(output), files: files.length };
}

async function installCoreHook() {
    let core = await readFile(corePath, "utf8");
    let changed = false;
    const hooks = [
        {
            label: "tmp-provider seed",
            original: "t.registerProvider(X.tmp,new oL)",
            replacement: "globalThis.__ANSON_TMP_PROVIDER=new oL,t.registerProvider(X.tmp,globalThis.__ANSON_TMP_PROVIDER),await globalThis.__ANSON_SEED_VSCODE?.(globalThis.__ANSON_TMP_PROVIDER)",
        },
        {
            label: "tmp-workspace search",
            original: "this.loggedSchemesMissingProviders=new Set}",
            replacement: "this.loggedSchemesMissingProviders=new Set,globalThis.__ANSON_SEARCH_PROVIDER&&(this.registerSearchResultProvider(X.tmp,0,globalThis.__ANSON_SEARCH_PROVIDER),this.registerSearchResultProvider(X.tmp,1,globalThis.__ANSON_SEARCH_PROVIDER))}",
        },
    ];

    for (const hook of hooks) {
        const originalCount = core.split(hook.original).length - 1;
        const replacementCount = core.split(hook.replacement).length - 1;
        if (replacementCount === 1) continue;
        if (originalCount !== 1) throw new Error(`Expected one Code - OSS ${hook.label} hook point, found ${originalCount}`);
        core = core.replace(hook.original, hook.replacement);
        changed = true;
    }

    if (changed) await writeFile(corePath, core);
    return { changed, sha: sha256(core) };
}

async function buildFileRuntime() {
    const temporaryDirectory = await mkdtemp(path.join(tmpdir(), "anson-vscode-workspace-"));
    const temporaryBundle = path.join(temporaryDirectory, "workbench.file.js");
    try {
        execFileSync("npx", [
            "--yes",
            "esbuild@0.28.2",
            bootstrapPath,
            "--bundle",
            "--format=iife",
            "--platform=browser",
            "--target=es2022",
            "--minify",
            "--define:import.meta.url=location.href",
            "--external:@microsoft/1ds-core-js",
            "--external:@microsoft/1ds-post-js",
            `--outfile=${temporaryBundle}`,
        ], { cwd: projectRoot, stdio: "inherit" });

        let bundle = await readFile(temporaryBundle, "utf8");
        const keyboardMarker = "layout.contribution.${n}.js";
        const markerIndex = bundle.indexOf(keyboardMarker);
        if (markerIndex < 0) throw new Error("Unable to find the file:// keyboard-layout import");
        const importStart = bundle.lastIndexOf("import(", markerIndex);
        const importEnd = bundle.indexOf("}},", markerIndex);
        if (importStart < 0 || importEnd < 0) throw new Error("Unable to bound the file:// keyboard-layout import");
        bundle = `${bundle.slice(0, importStart)}this._initialized=!0,this.setLayoutFromBrowserAPI()${bundle.slice(importEnd)}`;
        await writeFile(fileRuntimePath, bundle);
        return { bytes: Buffer.byteLength(bundle), sha: sha256(bundle) };
    } finally {
        await rm(temporaryDirectory, { recursive: true, force: true });
    }
}

const workspace = await buildWorkspaceData();
const core = await installCoreHook();
const fileRuntime = await buildFileRuntime();

console.log(`Workspace: ${workspace.files} files, ${workspace.bytes} bytes, sha256 ${workspace.sha}`);
console.log(`Core hook: ${core.changed ? "installed" : "already installed"}, sha256 ${core.sha}`);
console.log(`file:// runtime: ${fileRuntime.bytes} bytes, sha256 ${fileRuntime.sha}`);

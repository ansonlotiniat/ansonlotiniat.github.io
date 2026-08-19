/* Code - OSS embedder bootstrap. Core runtime is the official 1.131.0 web bundle
   with the documented tmp-provider seed hook described in WORKSPACES.md. */
import { create, URI } from "./out/vs/workbench/workbench.web.main.internal.js";

const configurationElement = document.getElementById("vscode-workbench-web-configuration");
const configurationText = configurationElement?.getAttribute("data-settings");

if (!configurationText) {
    throw new Error("Missing Code - OSS web configuration");
}

const configuration = JSON.parse(configurationText);
const workspaceData = globalThis.__ANSON_VSCODE_WORKSPACE;
const textEncoder = new TextEncoder();

function tmpUri(filePath) {
    return URI.from({
        scheme: "tmp",
        path: `/${String(filePath).replace(/^\/+/, "")}`,
    });
}

async function ensureDirectory(provider, directoryPath) {
    const segments = String(directoryPath).split("/").filter(Boolean);
    for (let index = 1; index <= segments.length; index += 1) {
        try {
            await provider.mkdir(tmpUri(segments.slice(0, index).join("/")));
        } catch {
            // The in-memory provider rejects duplicate mkdir calls. Reusing an
            // existing directory is the intended idempotent behaviour here.
        }
    }
}

globalThis.__ANSON_SEED_VSCODE = async (provider) => {
    if (!workspaceData?.files?.length) return;

    for (const file of workspaceData.files) {
        const parent = file.path.split("/").slice(0, -1).join("/");
        await ensureDirectory(provider, parent);
        await provider.writeFile(tmpUri(file.path), textEncoder.encode(file.content), {
            create: true,
            overwrite: true,
        });
    }

    const workspaceDefinition = {
        folders: workspaceData.folders.map((folder) => ({
            name: folder.name,
            uri: `tmp:/${folder.root}`,
        })),
        settings: {
            "files.autoSave": "off",
            "explorer.compactFolders": false,
            "workbench.startupEditor": "none",
        },
    };
    await provider.writeFile(
        URI.parse(workspaceData.workspaceUri),
        textEncoder.encode(JSON.stringify(workspaceDefinition, null, 2)),
        { create: true, overwrite: true },
    );
};

create(document.body, {
    ...configuration,
    configurationDefaults: {
        ...configuration.configurationDefaults,
        "workbench.startupEditor": "none",
        "explorer.compactFolders": false,
    },
    defaultLayout: workspaceData ? {
        force: true,
        views: [{ id: "workbench.view.explorer" }],
        editors: [{
            uri: tmpUri("00-START-HERE/README.md"),
            openOnlyIfExists: true,
        }],
    } : undefined,
    workspaceProvider: {
        workspace: workspaceData ? {
            workspaceUri: URI.parse(workspaceData.workspaceUri),
        } : undefined,
        // Chrome treats every file:// document as an opaque origin. The core
        // editor still works there, but the web-extension worker cannot start
        // reliably. Disable extensions only for the double-clicked local-file
        // compatibility runtime; HTTP/GitHub Pages keeps the full workbench.
        payload: globalThis.__ANSON_FILE_RUNTIME
            ? new Map([["disableExtensions", "true"]])
            : undefined,
        trusted: true,
        async open() {
            return false;
        },
    },
});

export default function mount({ root, reportPointer }) {
    const vscodeFrame = root.querySelector("[data-vscode-frame]");
    const vscodeHost = vscodeFrame?.closest(".vscode-native-host");
    const vscodeLoadingLabel = root.querySelector("[data-vscode-loading-label]");
    const vscodeRetry = root.querySelector("[data-vscode-retry]");
    const vscodeCommandCenter = root.querySelector(".vscode-native-command-center");
    let vscodeVisualReady = false;
    let vscodeRuntimeReady = false;
    let vscodeStatePoll = 0;
    let vscodeVisualWatchdog = 0;

    function markVscodePerformance(name) {
        try {
            if (!performance.getEntriesByName(name).length) performance.mark(name);
        } catch {
            // Performance marks are an optional diagnostics aid.
        }
    }

    function requestVscodeState() {
        vscodeFrame?.contentWindow?.postMessage({ type: "anson-vscode-parent-ready" }, "*");
    }

    function markVscodeVisualReady() {
        if (vscodeVisualReady) return;
        vscodeVisualReady = true;
        vscodeHost?.classList.add("is-ready", "is-visual-ready");
        if (vscodeLoadingLabel) vscodeLoadingLabel.textContent = "Visual Studio Code 已顯示；引擎在背景啟動";
        if (vscodeRetry) vscodeRetry.hidden = true;
        if (vscodeStatePoll) window.clearInterval(vscodeStatePoll);
        if (vscodeVisualWatchdog) window.clearTimeout(vscodeVisualWatchdog);
        markVscodePerformance("anson/vscode-visual-ready");
    }

    function markVscodeRuntimeReady() {
        if (vscodeRuntimeReady) return;
        vscodeRuntimeReady = true;
        markVscodeVisualReady();
        vscodeHost?.classList.add("is-runtime-ready");
        if (vscodeLoadingLabel) vscodeLoadingLabel.textContent = "Code‑OSS 1.131.0 已就緒";
        markVscodePerformance("anson/vscode-runtime-ready");
    }

    function syncVscodeFrameState() {
        try {
            const frameDocument = vscodeFrame?.contentDocument;
            if (!frameDocument) return;
            if (frameDocument.querySelector(".anson-vscode-capture")) markVscodeVisualReady();
            if (frameDocument.querySelector(".monaco-workbench")) markVscodeRuntimeReady();
        } catch {
            // The message handshake remains authoritative if the frame is cross-origin.
        }
    }

    function watchVscodeStartup() {
        if (vscodeVisualReady || vscodeStatePoll) return;
        vscodeStatePoll = window.setInterval(() => {
            requestVscodeState();
            syncVscodeFrameState();
        }, 250);
        vscodeVisualWatchdog = window.setTimeout(() => {
            if (vscodeVisualReady) return;
            if (vscodeLoadingLabel) vscodeLoadingLabel.textContent = "Visual Studio Code 載入時間異常";
            if (vscodeRetry) vscodeRetry.hidden = false;
        }, 6000);
    }

    function ensureVscodeLoaded() {
        if (!vscodeFrame) return;
        vscodeFrame.loading = "eager";
        vscodeHost?.classList.add("is-warming");
        markVscodePerformance("anson/vscode-load-start");
        if (!vscodeFrame.getAttribute("src")) {
            const source = vscodeFrame.dataset.vscodeSrc;
            if (!source) return;
            vscodeFrame.src = source;
        }
        requestVscodeState();
        window.setTimeout(syncVscodeFrameState, 0);
        watchVscodeStartup();
    }

    vscodeFrame?.addEventListener("load", () => {
        requestVscodeState();
        syncVscodeFrameState();
    });

    vscodeRetry?.addEventListener("click", () => {
        if (!vscodeFrame) return;
        vscodeVisualReady = false;
        vscodeRuntimeReady = false;
        vscodeHost?.classList.remove("is-ready", "is-visual-ready", "is-runtime-ready", "is-workbench");
        if (vscodeLoadingLabel) vscodeLoadingLabel.textContent = "重新載入 Visual Studio Code…";
        vscodeRetry.hidden = true;
        if (vscodeStatePoll) window.clearInterval(vscodeStatePoll);
        if (vscodeVisualWatchdog) window.clearTimeout(vscodeVisualWatchdog);
        vscodeStatePoll = 0;
        vscodeVisualWatchdog = 0;
        const source = new URL(vscodeFrame.dataset.vscodeSrc || "assets/vscode-oss/", window.location.href);
        source.searchParams.set("retry", String(Date.now()));
        vscodeFrame.src = source.toString();
        watchVscodeStartup();
    });

    vscodeCommandCenter?.addEventListener("click", () => {
        ensureVscodeLoaded();
        vscodeFrame?.contentWindow?.postMessage({ type: "anson-vscode-command-center" }, "*");
    });

    window.addEventListener("message", (event) => {
        if (!vscodeFrame || event.source !== vscodeFrame.contentWindow) return;
        const message = event.data;
        if (!message || typeof message !== "object") return;

        if (message.type === "anson-vscode-ready") {
            markVscodeRuntimeReady();
            return;
        }

        if (message.type === "anson-vscode-visual-ready") {
            markVscodeVisualReady();
            return;
        }

        if (message.type === "anson-vscode-mode") {
            vscodeHost?.classList.toggle("is-workbench", message.mode === "workbench");
            return;
        }

        if (message.type === "anson-vscode-error") {
            if (vscodeLoadingLabel) vscodeLoadingLabel.textContent = "Code‑OSS 核心載入失敗";
            if (vscodeRetry) vscodeRetry.hidden = false;
            return;
        }

        if (message.type === "anson-vscode-pointer") reportPointer(vscodeFrame, message);
    });

    ensureVscodeLoaded();

    return { open: ensureVscodeLoaded };
}

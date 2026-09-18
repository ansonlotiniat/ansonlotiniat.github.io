// This listener must exist before the eager iframe can report its first frame.
// The main controller repeats the handshake and owns the watchdog/retry logic.
export default function prepare({ getRoot }) {
    window.addEventListener("message", (event) => {
        const frame = getRoot()?.querySelector("[data-vscode-frame]");
        if (!frame || event.source !== frame.contentWindow) return;
        if (event.data?.type !== "anson-vscode-visual-ready" && event.data?.type !== "anson-vscode-ready")
            return;
        const host = frame.closest(".vscode-native-host");
        host?.classList.add("is-ready", "is-visual-ready");
        if (event.data.type === "anson-vscode-ready") host?.classList.add("is-runtime-ready");
        const label = host?.querySelector("[data-vscode-loading-label]");
        if (label)
            label.textContent =
                event.data.type === "anson-vscode-ready"
                    ? "Code‑OSS 1.131.0 已就緒"
                    : "Visual Studio Code 已顯示；引擎在背景啟動";
        if (!performance.getEntriesByName("anson/vscode-shell-visible").length)
            performance.mark("anson/vscode-shell-visible");
    });
}

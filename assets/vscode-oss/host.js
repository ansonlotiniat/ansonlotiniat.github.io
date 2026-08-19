const waitForWorkbench = () => new Promise((resolve) => {
    const existing = document.querySelector(".monaco-workbench");
    if (existing) {
        resolve(existing);
        return;
    }

    const observer = new MutationObserver(() => {
        const workbench = document.querySelector(".monaco-workbench");
        if (!workbench) return;
        observer.disconnect();
        resolve(workbench);
    });
    observer.observe(document.body, { childList: true, subtree: true });
});

const icon = (paths, viewBox = "0 0 24 24") => `<svg viewBox="${viewBox}" aria-hidden="true">${paths}</svg>`;

function makeTabbar() {
    const tabbar = document.createElement("div");
    tabbar.className = "anson-vscode-tabbar";
    tabbar.innerHTML = `
        <div class="anson-vscode-welcome-tab" role="tab" aria-selected="true">
            <span class="anson-vscode-mark" aria-hidden="true"></span>
            <span>歡迎</span>
            <button class="anson-vscode-tab-close" type="button" aria-label="關閉歡迎分頁">×</button>
        </div>
        <div class="anson-vscode-editor-actions" role="toolbar" aria-label="編輯器動作">
            <button class="anson-run" type="button" aria-label="Run Code">▷</button>
            <button class="anson-claude-action" type="button" aria-label="Claude Code: Open">✺</button>
            <button type="button" aria-label="向右分割編輯器">▥</button>
            <button type="button" aria-label="更多操作">⋯</button>
        </div>`;
    return tabbar;
}

function makeCapture() {
    const capture = document.createElement("main");
    capture.className = "anson-vscode-capture";
    capture.setAttribute("aria-label", "目前 VS Code 歡迎畫面");
    capture.innerHTML = `
        <div class="anson-vscode-capture-grid">
            <section>
                <h1>Visual Studio Code</h1>
                <p class="anson-vscode-subtitle">編輯已進化</p>
                <h2 class="anson-vscode-section-title">開始</h2>
                <div class="anson-vscode-start-list">
                    <button class="anson-vscode-portfolio-open" type="button" data-vscode-command="portfolio"><span class="anson-vscode-start-icon codicon codicon-root-folder-opened" aria-hidden="true"></span>開啟作品工作區...</button>
                    <button type="button" data-vscode-command="new"><span class="anson-vscode-start-icon codicon codicon-new-file" aria-hidden="true"></span>新增檔案...</button>
                    <button type="button" data-vscode-command="open"><span class="anson-vscode-start-icon codicon codicon-folder-opened" aria-hidden="true"></span>開啟...</button>
                    <button type="button" data-vscode-command="clone"><span class="anson-vscode-start-icon codicon codicon-source-control" aria-hidden="true"></span>複製 Git 存放庫...</button>
                    <button type="button" data-vscode-command="connect"><span class="anson-vscode-start-icon codicon codicon-remote" aria-hidden="true"></span>連接至...</button>
                    <button type="button" data-vscode-command="generate"><span class="anson-vscode-start-icon codicon codicon-sparkle" aria-hidden="true"></span>產生新工作區...</button>
                </div>
                <div class="anson-vscode-recents">
                    <h2 class="anson-vscode-section-title">最近使用</h2>
                    <div class="anson-vscode-recent-list">
                        <button type="button" data-vscode-command="open"><span class="anson-vscode-recent-name">modeling</span><span class="anson-vscode-recent-path">~/Document_Local/iGEM_分站</span></button>
                        <button type="button" data-vscode-command="open"><span class="anson-vscode-recent-name">Agents Window</span><span class="anson-vscode-recent-path">.</span></button>
                        <button type="button" data-vscode-command="open"><span class="anson-vscode-recent-name">2526iGEM_Wiki</span><span class="anson-vscode-recent-path">~/Documents/Competition/2526iGEM/Wiki/code...</span></button>
                        <button type="button" data-vscode-command="open"><span class="anson-vscode-recent-name">random_img</span><span class="anson-vscode-recent-path">~/Document_Local</span></button>
                        <button type="button" data-vscode-command="open"><span class="anson-vscode-recent-name">2026APOAI</span><span class="anson-vscode-recent-path">~</span></button>
                        <button type="button" data-vscode-command="open"><span class="anson-vscode-recent-name">更多...</span></button>
                    </div>
                </div>
            </section>
            <section class="anson-vscode-guides">
                <h2 class="anson-vscode-section-title">逐步解說</h2>
                <button class="anson-vscode-guide-card" type="button" data-vscode-guide="copilot"><span class="anson-vscode-guide-icon is-copilot">◎</span>GitHub Copilot<span class="anson-vscode-guide-badge">已更新</span></button>
                <button class="anson-vscode-guide-card" type="button" data-vscode-guide="claude"><span class="anson-vscode-guide-icon is-claude">✺</span>Get started with Claude Code<span class="anson-vscode-guide-badge">已更新</span></button>
                <button class="anson-vscode-more" type="button" data-vscode-guide="more">更多...</button>
            </section>
        </div>
        <div class="anson-vscode-agent-launch"><button class="anson-vscode-agent-button" type="button" data-vscode-command="agents"><span>⟐</span>試用新的 Agents 視窗</button></div>
        <label class="anson-vscode-startup-check"><input type="checkbox" checked>啟動時顯示歡迎頁面</label>`;
    return capture;
}

function makeActivityExtras() {
    const extras = document.createElement("nav");
    extras.className = "anson-vscode-activity-extras";
    extras.setAttribute("aria-label", "已安裝的 VS Code 工具");
    extras.innerHTML = `
        <button type="button" aria-label="遠端總管">${icon('<rect x="2.8" y="4" width="15.5" height="12" rx="1.7"></rect><path d="M7.5 20h5.8M10.4 16v4M16.1 15.1l5 5m0-5-5 5"></path>')}</button>
        <button type="button" aria-label="Claude Code"><span class="anson-claude-glyph">✺</span></button>
        <button type="button" aria-label="GitLens">${icon('<circle cx="12" cy="12" r="9"></circle><path d="M8.2 7.7v6.1a2.7 2.7 0 0 0 2.7 2.7h2.6M8.2 7.7l3 2.7m-3-2.7-2.6 2.7M15.7 16.5l-2.8-2.7m2.8 2.7-2.8 2.7"></path>')}</button>
        <button type="button" aria-label="Containers">${icon('<path d="m12 2.8 8.3 4.4v9.6L12 21.2l-8.3-4.4V7.2Z"></path><path d="m3.7 7.2 8.3 4.5 8.3-4.5M12 11.7v9.5"></path>')}</button>
        <button type="button" aria-label="Live Share">${icon('<path d="M5.2 8.5c2.3-3 6.6-4.1 9.8-2.1M18.8 15.5c-2.3 3-6.6 4.1-9.8 2.1"></path><path d="m4.7 4 .5 4.5 4.3-.8M19.3 20l-.5-4.5-4.3.8"></path>')}</button>
        <button type="button" aria-label="Parallels Desktop">${icon('<path d="M7.5 4.2v15.6M10.4 4.2v15.6M13.6 4.2v15.6M16.5 4.2v15.6"></path>')}</button>`;
    return extras;
}

function makeActivityCore() {
    const core = document.createElement("nav");
    core.className = "anson-vscode-activity-core";
    core.setAttribute("aria-label", "VS Code 主要檢視");
    core.innerHTML = `
        <button type="button" aria-label="檔案總管"><span class="codicon codicon-files" aria-hidden="true"></span></button>
        <button type="button" aria-label="搜尋"><span class="codicon codicon-search" aria-hidden="true"></span></button>
        <button type="button" aria-label="原始檔控制"><span class="codicon codicon-source-control" aria-hidden="true"></span></button>
        <button type="button" aria-label="執行與偵錯"><span class="codicon codicon-debug-alt" aria-hidden="true"></span></button>
        <button type="button" aria-label="延伸模組"><span class="codicon codicon-extensions" aria-hidden="true"></span></button>
        <button class="is-account" type="button" aria-label="帳戶"><span class="codicon codicon-account" aria-hidden="true"></span></button>
        <button class="is-settings" type="button" aria-label="管理"><span class="codicon codicon-settings-gear" aria-hidden="true"></span></button>`;
    return core;
}

function makeStatusbar() {
    const statusbar = document.createElement("footer");
    statusbar.className = "anson-vscode-statusbar";
    statusbar.setAttribute("aria-label", "VS Code 狀態列");
    statusbar.innerHTML = `
        <button class="anson-status-remote" type="button" aria-label="remote">‹›</button>
        <button type="button" aria-label="GitLens Launchpad">♧ Launchpad</button>
        <button type="button" aria-label="沒有問題">ⓧ 0 △ 0</button>
        <button type="button" aria-label="Live Share">♧ Live Share</button>
        <span class="anson-vscode-status-spacer"></span>
        <button type="button" aria-label="標點自動轉換">✓ 標點自動轉換</button>
        <button type="button" aria-label="Go Live">◉ Go Live</button>
        <button type="button" aria-label="通知">♧</button>`;
    return statusbar;
}

function showToast(message) {
    document.querySelector(".anson-vscode-runtime-toast")?.remove();
    const toast = document.createElement("div");
    toast.className = "anson-vscode-runtime-toast";
    toast.setAttribute("role", "status");
    toast.textContent = message;
    document.body.appendChild(toast);
    window.setTimeout(() => toast.remove(), 2800);
}

function dismissCapture(capture, tabbar) {
    capture.classList.add("is-dismissed");
    tabbar.classList.add("is-dismissed");
    document.querySelectorAll(".anson-vscode-activity-core, .anson-vscode-activity-extras, .anson-vscode-statusbar")
        .forEach((element) => element.classList.add("is-dismissed"));
    window.parent.postMessage({ type: "anson-vscode-mode", mode: "workbench" }, "*");
}

function clickWorkbenchAction(candidates) {
    const normalized = candidates.map((candidate) => candidate.toLocaleLowerCase());
    const elements = [...document.querySelectorAll("button, a, [role='button']")]
        .filter((element) => !element.closest(".anson-vscode-capture, .anson-vscode-tabbar"));
    const target = elements.find((element) => {
        const haystack = `${element.textContent || ""} ${element.getAttribute("aria-label") || ""}`.toLocaleLowerCase();
        return normalized.some((candidate) => haystack.includes(candidate));
    });
    target?.click();
}

function wireCapture(capture, tabbar, workbenchPromise, isWorkbenchReady) {
    const commands = {
        new: ["新增檔案", "new file"],
        open: ["開啟", "open"],
        clone: ["複製 git", "clone git"],
        connect: ["連接至", "connect to"],
    };

    const runWorkbenchAction = (action) => {
        if (isWorkbenchReady()) {
            action();
            return;
        }
        showToast("Code‑OSS 正在背景啟動；完成後會自動執行這個動作。");
        workbenchPromise.then(action);
    };

    capture.querySelectorAll("[data-vscode-command]").forEach((button) => {
        button.addEventListener("click", () => {
            const command = button.dataset.vscodeCommand;
            if (command === "portfolio") {
                runWorkbenchAction(() => {
                    dismissCapture(capture, tabbar);
                    window.setTimeout(() => clickWorkbenchAction(["檔案總管", "explorer"]), 30);
                });
                return;
            }
            if (commands[command]) {
                runWorkbenchAction(() => {
                    dismissCapture(capture, tabbar);
                    window.setTimeout(() => clickWorkbenchAction(commands[command]), 30);
                });
                return;
            }
            showToast("畫面已完整記錄；Code‑OSS 不會讀取你的本機帳號、私有擴充資料或最近檔案內容。");
        });
    });

    capture.querySelectorAll("[data-vscode-guide]").forEach((button) => {
        button.addEventListener("click", () => {
            showToast("這張卡保留你目前看到的入口；網站不會連接本機 Copilot 或 Claude 帳號。");
        });
    });

    tabbar.querySelector(".anson-vscode-tab-close")?.addEventListener("click", () => {
        runWorkbenchAction(() => {
            clickWorkbenchAction(["關閉", "close"]);
            dismissCapture(capture, tabbar);
        });
    });
}

function forwardPointer(event, phase) {
    window.parent.postMessage({
        type: "anson-vscode-pointer",
        phase,
        x: event.clientX,
        y: event.clientY,
        interactive: Boolean(event.target.closest?.("button, a, input, [role='button'], [role='tab']")),
    }, "*");
}

function boot() {
    document.documentElement.classList.toggle("ansonos-cursor-active", window.parent !== window);

    const tabbar = makeTabbar();
    const capture = makeCapture();
    const activityCore = makeActivityCore();
    const activityExtras = makeActivityExtras();
    const statusbar = makeStatusbar();
    document.body.append(tabbar, capture, activityCore, activityExtras, statusbar);

    let workbenchReady = false;
    const postVisualReady = () => {
        window.parent.postMessage({ type: "anson-vscode-visual-ready", version: "1.131.0" }, "*");
    };
    const postRuntimeReady = () => {
        window.parent.postMessage({ type: "anson-vscode-ready", version: "1.131.0" }, "*");
    };
    const workbenchPromise = waitForWorkbench().then((workbench) => {
        workbenchReady = true;
        document.documentElement.classList.add("anson-vscode-runtime-ready");
        postRuntimeReady();
        return workbench;
    });
    wireCapture(capture, tabbar, workbenchPromise, () => workbenchReady);

    document.addEventListener("pointermove", (event) => forwardPointer(event, "move"), { passive: true });
    document.addEventListener("pointerdown", (event) => forwardPointer(event, "down"), { passive: true });
    document.addEventListener("pointerup", (event) => forwardPointer(event, "up"), { passive: true });
    document.documentElement.addEventListener("mouseleave", (event) => forwardPointer(event, "leave"), { passive: true });

    window.addEventListener("message", (event) => {
        if (event.source !== window.parent) return;
        if (event.data?.type === "anson-vscode-parent-ready") {
            postVisualReady();
            if (workbenchReady) postRuntimeReady();
            return;
        }
        if (event.data?.type !== "anson-vscode-command-center") return;
        const openCommandCenter = () => {
            dismissCapture(capture, tabbar);
            window.setTimeout(() => {
                window.dispatchEvent(new KeyboardEvent("keydown", {
                    key: "p",
                    code: "KeyP",
                    metaKey: true,
                    bubbles: true,
                }));
            }, 40);
        };
        if (workbenchReady) {
            openCommandCenter();
        } else {
            showToast("Code‑OSS 正在背景啟動；完成後會開啟命令中心。");
            workbenchPromise.then(openCommandCenter);
        }
    });

    postVisualReady();
}

boot();

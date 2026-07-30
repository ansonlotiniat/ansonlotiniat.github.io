const appManifest = Array.isArray(window.ANSON_APP_MANIFEST)
    ? window.ANSON_APP_MANIFEST
    : [];
const appManifestById = new Map(appManifest.map((app) => [app.id, app]));

function localizedSpan(copy) {
    const fragment = document.createDocumentFragment();
    ["zh", "en"].forEach((locale) => {
        const span = document.createElement("span");
        span.dataset.copyLang = locale;
        span.textContent = copy?.[locale] || copy?.en || copy?.zh || "";
        fragment.append(span);
    });
    return fragment;
}

function appIcon(app, className) {
    const icon = document.createElement("span");
    icon.className = `${className} ${app.icon.className}`;
    icon.setAttribute("aria-hidden", "true");

    const image = document.createElement("img");
    image.src = app.icon.src;
    image.alt = "";
    image.width = 64;
    image.height = 64;
    icon.append(image);
    return icon;
}

function appsLauncher() {
    const launcher = document.createElement("button");
    launcher.type = "button";
    launcher.className = "dock-item dock-apps-item";
    launcher.dataset.openExplore = "";
    launcher.dataset.dockExplore = "";
    launcher.setAttribute("aria-haspopup", "dialog");
    launcher.setAttribute("aria-controls", "explore");

    const tooltip = document.createElement("span");
    tooltip.className = "dock-tooltip";
    tooltip.append(localizedSpan({
        zh: "App — 探索 Anson",
        en: "Apps — Explore Anson",
    }));

    const icon = document.createElement("span");
    icon.className = "dock-icon apps-icon";
    icon.setAttribute("aria-hidden", "true");
    const image = document.createElement("img");
    image.src = "assets/app-icons/apps.png";
    image.alt = "";
    image.width = 64;
    image.height = 64;
    icon.append(image);

    launcher.append(tooltip, icon);
    return launcher;
}

function renderLaunchers() {
    const exploreContainer = document.querySelector("[data-explore-results]");
    const dockContainer = document.querySelector("[data-dock]");

    appManifest.forEach((app, index) => {
        if (exploreContainer) {
            const result = document.createElement("button");
            result.type = "button";
            result.setAttribute("role", "option");
            result.setAttribute("aria-selected", String(index === 0));
            result.classList.toggle("is-selected", index === 0);
            result.dataset.exploreResult = "";
            result.dataset.openApp = app.id;
            result.dataset.keywords = app.keywords;
            result.append(appIcon(app, "app-icon"));

            const copy = document.createElement("span");
            copy.className = "result-copy";
            const title = document.createElement("b");
            title.append(localizedSpan(app.title));
            const subtitle = document.createElement("small");
            subtitle.append(localizedSpan(app.subtitle));
            copy.append(title, subtitle);

            const label = document.createElement("span");
            label.className = "result-app";
            label.textContent = app.appLabel;

            const shortcut = document.createElement("kbd");
            shortcut.textContent = `⌥${app.shortcut}`;
            result.append(copy, label, shortcut);
            exploreContainer.append(result);
        }

        if (dockContainer) {
            const launcher = document.createElement("button");
            launcher.type = "button";
            launcher.className = "dock-item";
            launcher.dataset.openApp = app.id;
            launcher.dataset.dockApp = app.id;

            const tooltip = document.createElement("span");
            tooltip.className = "dock-tooltip";
            tooltip.append(localizedSpan(app.dockLabel));

            const indicator = document.createElement("span");
            indicator.className = "dock-indicator";
            indicator.setAttribute("aria-hidden", "true");
            launcher.append(tooltip, appIcon(app, "dock-icon"), indicator);
            dockContainer.append(launcher);

            if (app.id === "about") {
                dockContainer.append(appsLauncher());
            }
        }
    });

    if (dockContainer) {
        const mail = document.createElement("a");
        mail.className = "dock-item dock-link";
        mail.href = "mailto:ansonlotiniat@gmail.com";
        const tooltip = document.createElement("span");
        tooltip.className = "dock-tooltip";
        tooltip.append(localizedSpan({ zh: "郵件 — 聯絡 Anson", en: "Mail — Contact Anson" }));
        const icon = document.createElement("span");
        icon.className = "dock-icon mail-icon";
        icon.setAttribute("aria-hidden", "true");
        const image = document.createElement("img");
        image.src = "assets/app-icons/mail.png";
        image.alt = "";
        image.width = 64;
        image.height = 64;
        icon.append(image);
        mail.append(tooltip, icon);
        dockContainer.append(mail);
    }
}

renderLaunchers();

const root = document.documentElement;
const body = document.body;
const os = document.querySelector("[data-os]");
const desktop = document.querySelector("[data-desktop]");
const windowLayer = document.querySelector("[data-window-layer]");
const dock = document.querySelector(".dock");
const menuBar = document.querySelector(".menu-bar");
const activeAppName = document.querySelector("[data-active-app]");
const announcer = document.querySelector("[data-announcer]");
const description = document.querySelector('meta[name="description"]');
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const mobileWindowMode = window.matchMedia("(max-width: 700px)");

const languageButtons = [...document.querySelectorAll("[data-set-language]")];
const languageToggle = document.querySelector("[data-language-toggle]");
const clock = document.querySelector("[data-clock]");
const appWindows = new Map(
    [...document.querySelectorAll("[data-window]")].map((element) => [element.dataset.window, element]),
);
const appIds = [...appWindows.keys()];
const dockButtons = new Map(
    [...document.querySelectorAll("[data-dock-app]")].map((element) => [element.dataset.dockApp, element]),
);

const explorePanel = document.querySelector("[data-explore]");
const exploreBackdrop = document.querySelector("[data-explore-backdrop]");
const exploreInput = document.querySelector("[data-explore-input]");
const exploreResults = [...document.querySelectorAll("[data-explore-result]")];
const exploreEmpty = document.querySelector("[data-explore-empty]");
const exploreFilters = [...document.querySelectorAll("[data-explore-filter]")];

const xcodeButtons = [...document.querySelectorAll("[data-xcode-file]")];
const xcodePanels = [...document.querySelectorAll("[data-xcode-panel]")];
const xcodeInspectors = [...document.querySelectorAll("[data-xcode-inspector]")];
const sportsPreview = document.querySelector("[data-sports-preview]");
const sportsPhaseButtons = [...document.querySelectorAll("[data-sports-phase]")];
const sportsCopies = [...document.querySelectorAll("[data-sports-copy]")];
const debatePreview = document.querySelector("[data-debate-preview]");
const debateRoleButtons = [...document.querySelectorAll("[data-debate-role]")];
const debateCopies = [...document.querySelectorAll("[data-debate-copy]")];

const vscodeButtons = [...document.querySelectorAll("[data-vscode-stream]")];
const vscodePanels = [...document.querySelectorAll("[data-vscode-panel]")];
const vscodeTabs = [...document.querySelectorAll("[data-vscode-tab]")];
const terminalPanels = [...document.querySelectorAll("[data-terminal-panel]")];

const overleafButtons = [...document.querySelectorAll("[data-overleaf-doc]")];
const overleafSources = [...document.querySelectorAll("[data-overleaf-source]")];
const overleafPreviews = [...document.querySelectorAll("[data-overleaf-preview]")];
const overleafSourceTabs = [...document.querySelectorAll("[data-source-tab]")];
const currentTex = document.querySelector("[data-current-tex]");
const compileButton = document.querySelector("[data-compile-button]");
const compileStatus = document.querySelector("[data-compile-status]");
const compileTime = document.querySelector("[data-compile-time]");
const bookProof = document.querySelector("[data-book-proof]");
const proofLens = document.querySelector("[data-proof-lens]");

const pageCopy = {
    zh: {
        title: "AnsonOS — Anson Lo",
        description: "Anson Lo 的互動工作桌面：打開 Xcode、Visual Studio Code 與 Overleaf，探索他如何建立系統、協調 iGEM 工程與編輯文字。",
        searchPlaceholder: "探索 Anson 的工作…",
        searchLabel: "搜尋 Anson 的工作",
        switchLanguage: "切換至英文",
        open: "已打開",
        close: "已關閉",
        minimize: "已縮到 Dock",
        compileWorking: "正在編譯…",
        compileDone: "PDF 已更新",
        windowActions: {
            close: "關閉視窗",
            minimize: "縮小視窗",
            maximize: "放大或還原視窗",
        },
    },
    en: {
        title: "AnsonOS — Anson Lo",
        description: "An interactive working desktop for Anson Lo. Open Xcode, Visual Studio Code, and Overleaf to explore how he builds, coordinates, and edits.",
        searchPlaceholder: "Explore Anson’s work…",
        searchLabel: "Search Anson's work",
        switchLanguage: "Switch to Chinese",
        open: "opened",
        close: "closed",
        minimize: "minimized to the Dock",
        compileWorking: "Compiling…",
        compileDone: "PDF up to date",
        windowActions: {
            close: "Close window",
            minimize: "Minimize window",
            maximize: "Maximize or restore window",
        },
    },
};

let zIndex = 120;
let exploreOpen = false;
let selectedExploreIndex = 0;
let previousExploreFocus = null;
let compileState = "done";
let compileTimer = null;
let dragState = null;

function language() {
    return root.dataset.language === "en" ? "en" : "zh";
}

function hasGsap() {
    return Boolean(window.gsap) && !reducedMotion.matches;
}

function announce(message) {
    if (!announcer) return;
    announcer.textContent = "";
    window.requestAnimationFrame(() => {
        announcer.textContent = message;
    });
}

function updateCompileCopy() {
    if (!compileStatus) return;
    compileStatus.textContent = compileState === "working"
        ? pageCopy[language()].compileWorking
        : pageCopy[language()].compileDone;
}

function setLanguage(nextLanguage, persist = true) {
    const next = nextLanguage === "en" ? "en" : "zh";
    root.dataset.language = next;
    root.lang = next === "zh" ? "zh-Hant" : "en";
    document.title = pageCopy[next].title;
    description?.setAttribute("content", pageCopy[next].description);

    if (exploreInput) {
        exploreInput.placeholder = pageCopy[next].searchPlaceholder;
        exploreInput.setAttribute("aria-label", pageCopy[next].searchLabel);
    }

    languageButtons.forEach((button) => {
        button.setAttribute("aria-pressed", String(button.dataset.setLanguage === next));
    });
    languageToggle?.setAttribute("aria-label", pageCopy[next].switchLanguage);

    document.querySelectorAll("[data-window-action]").forEach((button) => {
        const action = button.dataset.windowAction;
        button.setAttribute("aria-label", pageCopy[next].windowActions[action] || action);
    });

    updateCompileCopy();
    updateClock();

    if (persist) {
        try {
            localStorage.setItem("anson-language", next);
        } catch {
            // Language remains available when storage is blocked.
        }
    }
}

let savedLanguage = null;
try {
    savedLanguage = localStorage.getItem("anson-language");
} catch {
    savedLanguage = null;
}
setLanguage(savedLanguage === "en" ? "en" : "zh", false);
languageButtons.forEach((button) => {
    button.addEventListener("click", () => setLanguage(button.dataset.setLanguage));
});
languageToggle?.addEventListener("click", () => {
    setLanguage(language() === "zh" ? "en" : "zh");
});

function updateClock() {
    if (!clock) return;
    const now = new Date();
    const compact = window.innerWidth <= 560;
    const options = compact
        ? { hour: "numeric", minute: "2-digit", hour12: true }
        : {
            weekday: "short",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        };
    const locale = language() === "zh" ? "zh-Hant-MO" : "en-US";
    const formatted = new Intl.DateTimeFormat(locale, options)
        .format(now)
        .replaceAll(",", "");
    clock.textContent = formatted;
    clock.dateTime = now.toISOString();
}

updateClock();
window.setInterval(updateClock, 30000);

function appLabel(appId) {
    return appManifestById.get(appId)?.appLabel
        || appWindows.get(appId)?.dataset.appLabel
        || appId;
}

function visibleWindows() {
    return [...appWindows.values()]
        .filter((appWindow) => !appWindow.hidden && appWindow.dataset.minimized !== "true")
        .sort((a, b) => Number(a.style.zIndex || 0) - Number(b.style.zIndex || 0));
}

function updateDockState(appId, state) {
    const dockButton = dockButtons.get(appId);
    if (!dockButton) return;
    dockButton.classList.toggle("is-open", state === "open" || state === "minimized");
    dockButton.classList.toggle("is-minimized", state === "minimized");
}

function writeAppHistory(appId, mode = "push") {
    if (mode === "none") return;
    const target = appId ? `#${appId}` : `${window.location.pathname}${window.location.search}`;
    if (mode === "push" && window.location.hash === `#${appId}`) return;
    const method = mode === "replace" ? "replaceState" : "pushState";
    history[method]({ app: appId || null }, "", target);
}

function setDesktopActive() {
    appWindows.forEach((appWindow) => appWindow.classList.remove("is-focused"));
    if (activeAppName) activeAppName.textContent = "Finder";
}

function focusWindow(appId, updateHistory = false) {
    const appWindow = appWindows.get(appId);
    if (!appWindow || appWindow.hidden || appWindow.dataset.minimized === "true") return;
    zIndex += 1;
    appWindow.style.zIndex = String(zIndex);
    appWindows.forEach((item) => item.classList.toggle("is-focused", item === appWindow));
    if (activeAppName) activeAppName.textContent = appLabel(appId);
    if (updateHistory) writeAppHistory(appId, "replace");
}

function focusTopWindow() {
    const visible = visibleWindows();
    const next = visible.at(-1);
    if (!next) {
        setDesktopActive();
        return null;
    }
    focusWindow(next.dataset.window);
    return next.dataset.window;
}

function dockVector(appId, appWindow) {
    const dockButton = dockButtons.get(appId);
    if (!dockButton) return { x: 0, y: 45 };
    const dockRect = dockButton.getBoundingClientRect();
    const windowRect = appWindow.getBoundingClientRect();
    return {
        x: dockRect.left + dockRect.width / 2 - (windowRect.left + windowRect.width / 2),
        y: dockRect.top + dockRect.height / 2 - (windowRect.top + windowRect.height / 2),
    };
}

function finishOpen(appWindow, appId) {
    const surface = appWindow.querySelector(".window-surface");
    if (window.gsap && surface) {
        window.gsap.set(surface, { clearProps: "transform,opacity,visibility" });
    } else if (surface) {
        surface.style.opacity = "";
        surface.style.transform = "";
        surface.style.visibility = "";
    }
    appWindow.dataset.minimized = "false";
    updateDockState(appId, "open");
}

function openApp(appId, options = {}) {
    const appWindow = appWindows.get(appId);
    if (!appWindow) return;
    const {
        historyMode = "push",
        restoreFocus = true,
        animate = true,
    } = options;

    if (exploreOpen) closeExplore(false);

    const wasHidden = appWindow.hidden;
    const wasMinimized = appWindow.dataset.minimized === "true";
    appWindow.hidden = false;
    appWindow.inert = false;
    appWindow.setAttribute("aria-hidden", "false");
    appWindow.classList.add("is-open");
    appWindow.dataset.minimized = "false";
    focusWindow(appId);
    updateDockState(appId, "open");
    writeAppHistory(appId, historyMode);

    const surface = appWindow.querySelector(".window-surface");
    if ((wasHidden || wasMinimized) && surface && animate && hasGsap()) {
        const vector = dockVector(appId, appWindow);
        window.gsap.killTweensOf(surface);
        window.gsap.fromTo(
            surface,
            {
                x: vector.x,
                y: vector.y,
                scale: 0.12,
                autoAlpha: 0.15,
                rotate: vector.x > 0 ? 1.5 : -1.5,
            },
            {
                x: 0,
                y: 0,
                scale: 1,
                autoAlpha: 1,
                rotate: 0,
                duration: 0.46,
                ease: "power3.out",
                clearProps: "transform,opacity,visibility",
                onComplete: () => finishOpen(appWindow, appId),
            },
        );
    } else {
        finishOpen(appWindow, appId);
    }

    if (restoreFocus) {
        const heading = appWindow.querySelector(".window-titlebar h2");
        if (heading) {
            heading.tabIndex = -1;
            window.setTimeout(() => heading.focus({ preventScroll: true }), hasGsap() ? 280 : 0);
            heading.addEventListener("blur", () => heading.removeAttribute("tabindex"), { once: true });
        }
    }

    announce(`${appLabel(appId)} ${pageCopy[language()].open}`);
}

function completeClose(appWindow, appId, action) {
    const surface = appWindow.querySelector(".window-surface");
    appWindow.hidden = true;
    appWindow.inert = true;
    appWindow.setAttribute("aria-hidden", "true");
    appWindow.classList.remove("is-open", "is-focused");
    if (action === "close") {
        appWindow.dataset.minimized = "false";
        updateDockState(appId, "closed");
    } else {
        appWindow.dataset.minimized = "true";
        updateDockState(appId, "minimized");
    }
    if (window.gsap && surface) {
        window.gsap.set(surface, { clearProps: "transform,opacity,visibility" });
    }
    const nextApp = focusTopWindow();
    writeAppHistory(nextApp, "replace");
}

function closeApp(appId, options = {}) {
    const appWindow = appWindows.get(appId);
    if (!appWindow || appWindow.hidden) return;
    const { animate = true, historyMode = "push" } = options;
    const surface = appWindow.querySelector(".window-surface");

    const finish = () => {
        completeClose(appWindow, appId, "close");
        if (historyMode === "push") {
            const nextApp = visibleWindows().at(-1)?.dataset.window || null;
            writeAppHistory(nextApp, "push");
        }
    };

    if (surface && animate && hasGsap()) {
        window.gsap.killTweensOf(surface);
        window.gsap.to(surface, {
            y: 24,
            scale: 0.92,
            autoAlpha: 0,
            duration: 0.2,
            ease: "power2.in",
            onComplete: finish,
        });
    } else {
        finish();
    }

    announce(`${appLabel(appId)} ${pageCopy[language()].close}`);
}

function minimizeApp(appId) {
    const appWindow = appWindows.get(appId);
    if (!appWindow || appWindow.hidden) return;
    const surface = appWindow.querySelector(".window-surface");
    const finish = () => completeClose(appWindow, appId, "minimize");

    if (surface && hasGsap()) {
        const vector = dockVector(appId, appWindow);
        window.gsap.killTweensOf(surface);
        window.gsap.to(surface, {
            x: vector.x,
            y: vector.y,
            scale: 0.12,
            rotate: vector.x > 0 ? 2 : -2,
            autoAlpha: 0.08,
            duration: 0.38,
            ease: "power3.in",
            onComplete: finish,
        });
    } else {
        finish();
    }

    announce(`${appLabel(appId)} ${pageCopy[language()].minimize}`);
}

function toggleMaximize(appId) {
    const appWindow = appWindows.get(appId);
    if (!appWindow || appWindow.hidden) return;
    const surface = appWindow.querySelector(".window-surface");
    const maximized = !appWindow.classList.contains("is-maximized");

    if (surface && hasGsap()) {
        const before = appWindow.getBoundingClientRect();
        appWindow.classList.toggle("is-maximized", maximized);
        const after = appWindow.getBoundingClientRect();
        const scaleX = before.width / after.width;
        const scaleY = before.height / after.height;
        const deltaX = before.left - after.left;
        const deltaY = before.top - after.top;
        window.gsap.fromTo(
            surface,
            { x: deltaX, y: deltaY, scaleX, scaleY },
            {
                x: 0,
                y: 0,
                scaleX: 1,
                scaleY: 1,
                duration: 0.3,
                ease: "power3.out",
                clearProps: "transform",
            },
        );
    } else {
        appWindow.classList.toggle("is-maximized", maximized);
    }
    focusWindow(appId);
}

document.querySelectorAll("[data-open-app]").forEach((button) => {
    button.addEventListener("click", () => {
        const appId = button.dataset.openApp;
        openApp(appId);
    });
});

appWindows.forEach((appWindow, appId) => {
    appWindow.dataset.minimized = "false";
    appWindow.inert = true;
    appWindow.setAttribute("aria-hidden", "true");

    appWindow.addEventListener("pointerdown", () => focusWindow(appId, true));

    appWindow.querySelectorAll("[data-window-action]").forEach((button) => {
        button.addEventListener("click", (event) => {
            event.stopPropagation();
            const action = button.dataset.windowAction;
            if (action === "close") closeApp(appId);
            if (action === "minimize") minimizeApp(appId);
            if (action === "maximize") toggleMaximize(appId);
        });
    });

    const handle = appWindow.querySelector("[data-drag-handle]");
    handle?.addEventListener("dblclick", (event) => {
        if (!event.target.closest("button")) toggleMaximize(appId);
    });
});

desktop?.addEventListener("pointerdown", (event) => {
    if (event.target.closest("button, a")) return;
    setDesktopActive();
    writeAppHistory(null, "replace");
});

function filteredExploreResults() {
    return exploreResults.filter((result) => !result.hidden);
}

function setExploreSelection(index) {
    const visible = filteredExploreResults();
    if (!visible.length) {
        selectedExploreIndex = -1;
        return;
    }
    selectedExploreIndex = Math.max(0, Math.min(index, visible.length - 1));
    exploreResults.forEach((result) => {
        const selected = result === visible[selectedExploreIndex];
        result.classList.toggle("is-selected", selected);
        result.setAttribute("aria-selected", String(selected));
    });
    visible[selectedExploreIndex]?.scrollIntoView({ block: "nearest" });
}

function filterExplore() {
    const query = (exploreInput?.value || "").trim().toLocaleLowerCase();
    exploreFilters.forEach((button) => {
        const filter = (button.dataset.exploreFilter || "").trim().toLocaleLowerCase();
        button.classList.toggle("is-active", filter === query);
        button.setAttribute("aria-pressed", String(filter === query));
    });
    exploreResults.forEach((result) => {
        const haystack = `${result.dataset.keywords || ""} ${result.textContent}`.toLocaleLowerCase();
        result.hidden = query ? !haystack.includes(query) : false;
    });
    const visible = filteredExploreResults();
    if (exploreEmpty) exploreEmpty.hidden = visible.length > 0;
    setExploreSelection(0);
}

function setExploreIsolation(isolated) {
    [desktop, windowLayer, dock].forEach((element) => {
        if (element) element.inert = isolated;
    });
}

function openExplore() {
    if (!explorePanel || !exploreBackdrop) return;
    if (exploreOpen) {
        exploreInput?.focus();
        return;
    }
    exploreOpen = true;
    previousExploreFocus = document.activeElement;
    explorePanel.hidden = false;
    exploreBackdrop.hidden = false;
    explorePanel.setAttribute("aria-hidden", "false");
    setExploreIsolation(true);
    if (exploreInput) exploreInput.value = "";
    filterExplore();

    if (hasGsap()) {
        window.gsap.killTweensOf(explorePanel);
        window.gsap.fromTo(
            explorePanel,
            { y: -16, scale: 0.94, autoAlpha: 0 },
            {
                y: 0,
                scale: 1,
                autoAlpha: 1,
                duration: 0.26,
                ease: "power3.out",
                clearProps: "transform,opacity,visibility",
                onComplete: () => exploreInput?.focus({ preventScroll: true }),
            },
        );
        window.gsap.fromTo(
            exploreResults,
            { y: 8, autoAlpha: 0 },
            {
                y: 0,
                autoAlpha: 1,
                duration: 0.22,
                stagger: 0.025,
                delay: 0.06,
                ease: "power2.out",
                clearProps: "transform,opacity,visibility",
            },
        );
    } else {
        window.setTimeout(() => exploreInput?.focus({ preventScroll: true }), 0);
    }
}

function completeExploreClose(restoreFocus) {
    if (!explorePanel || !exploreBackdrop) return;
    explorePanel.hidden = true;
    exploreBackdrop.hidden = true;
    explorePanel.setAttribute("aria-hidden", "true");
    setExploreIsolation(false);
    if (window.gsap) {
        window.gsap.set(explorePanel, { clearProps: "transform,opacity,visibility" });
        window.gsap.set(exploreResults, { clearProps: "transform,opacity,visibility" });
    }
    if (restoreFocus && previousExploreFocus instanceof HTMLElement) {
        previousExploreFocus.focus({ preventScroll: true });
    }
    previousExploreFocus = null;
}

function closeExplore(restoreFocus = true) {
    if (!exploreOpen) return;
    exploreOpen = false;
    if (hasGsap()) {
        window.gsap.killTweensOf(explorePanel);
        window.gsap.to(explorePanel, {
            y: -10,
            scale: 0.97,
            autoAlpha: 0,
            duration: 0.16,
            ease: "power2.in",
            onComplete: () => completeExploreClose(restoreFocus),
        });
    } else {
        completeExploreClose(restoreFocus);
    }
}

document.querySelectorAll("[data-open-explore]").forEach((button) => {
    button.addEventListener("click", openExplore);
});

exploreBackdrop?.addEventListener("click", () => closeExplore());
exploreInput?.addEventListener("input", filterExplore);
exploreFilters.forEach((button) => {
    button.addEventListener("click", () => {
        if (!exploreInput) return;
        exploreInput.value = button.dataset.exploreFilter || "";
        filterExplore();
        exploreInput.focus({ preventScroll: true });
    });
});

exploreResults.forEach((result) => {
    result.addEventListener("pointermove", () => {
        const visible = filteredExploreResults();
        setExploreSelection(visible.indexOf(result));
    });
    result.addEventListener("click", () => {
        closeExplore(false);
    });
});

explorePanel?.addEventListener("keydown", (event) => {
    const visible = filteredExploreResults();
    if (event.key === "ArrowDown") {
        event.preventDefault();
        setExploreSelection((selectedExploreIndex + 1) % Math.max(visible.length, 1));
    } else if (event.key === "ArrowUp") {
        event.preventDefault();
        setExploreSelection((selectedExploreIndex - 1 + visible.length) % Math.max(visible.length, 1));
    } else if (event.key === "Enter" && document.activeElement === exploreInput) {
        event.preventDefault();
        visible[selectedExploreIndex]?.click();
    } else if (event.key === "Tab") {
        const focusable = [exploreInput, ...exploreFilters, ...visible].filter(Boolean);
        const first = focusable[0];
        const last = focusable.at(-1);
        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first?.focus();
        }
    }
});

document.addEventListener("keydown", (event) => {
    const target = event.target;
    const typing = target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target?.isContentEditable;
    const exploreShortcut =
        (event.metaKey && event.code === "Space")
        || ((event.metaKey || event.ctrlKey) && event.key.toLocaleLowerCase() === "k");

    if (exploreShortcut) {
        event.preventDefault();
        openExplore();
        return;
    }

    if (!typing && event.key === "/") {
        event.preventDefault();
        openExplore();
        return;
    }

    const shortcutApp = appManifest.find((app) => app.shortcut === event.key);
    if (event.altKey && !event.metaKey && !event.ctrlKey && shortcutApp) {
        event.preventDefault();
        openApp(shortcutApp.id);
        return;
    }

    if (event.key === "Escape" && exploreOpen) {
        event.preventDefault();
        closeExplore();
    }
}, true);

function setPanelVisibility(panel, active) {
    panel.hidden = !active;
    panel.inert = !active;
    panel.classList.toggle("is-active", active);
    panel.setAttribute("aria-hidden", String(!active));
}

function animatePanel(panel, options = {}) {
    if (!panel || !hasGsap()) return;
    window.gsap.fromTo(
        panel,
        { y: options.y ?? 8, autoAlpha: 0 },
        {
            y: 0,
            autoAlpha: 1,
            duration: options.duration ?? 0.24,
            ease: "power2.out",
            clearProps: "transform,opacity,visibility",
        },
    );
}

function setXcodeProject(project) {
    xcodeButtons.forEach((button) => {
        button.setAttribute("aria-selected", String(button.dataset.xcodeFile === project));
        button.tabIndex = button.dataset.xcodeFile === project ? 0 : -1;
    });
    xcodePanels.forEach((panel) => setPanelVisibility(panel, panel.dataset.xcodePanel === project));
    xcodeInspectors.forEach((panel) => setPanelVisibility(panel, panel.dataset.xcodeInspector === project));
    animatePanel(xcodePanels.find((panel) => panel.dataset.xcodePanel === project));
    animatePanel(xcodeInspectors.find((panel) => panel.dataset.xcodeInspector === project), { y: 4 });
}

xcodeButtons.forEach((button) => {
    button.addEventListener("click", () => setXcodeProject(button.dataset.xcodeFile));
    button.addEventListener("keydown", (event) => {
        if (!["ArrowDown", "ArrowUp", "ArrowRight", "ArrowLeft"].includes(event.key)) return;
        event.preventDefault();
        const index = xcodeButtons.indexOf(button);
        const delta = event.key === "ArrowDown" || event.key === "ArrowRight" ? 1 : -1;
        xcodeButtons[(index + delta + xcodeButtons.length) % xcodeButtons.length].click();
        xcodeButtons[(index + delta + xcodeButtons.length) % xcodeButtons.length].focus();
    });
});

function setSportsPhase(phase) {
    if (sportsPreview) sportsPreview.dataset.sportsPreview = phase;
    sportsPhaseButtons.forEach((button) => {
        button.setAttribute("aria-pressed", String(button.dataset.sportsPhase === phase));
    });
    sportsCopies.forEach((copy) => setPanelVisibility(copy, copy.dataset.sportsCopy === phase));
    animatePanel(sportsCopies.find((copy) => copy.dataset.sportsCopy === phase), { y: 7 });
}

sportsPhaseButtons.forEach((button) => {
    button.addEventListener("click", () => setSportsPhase(button.dataset.sportsPhase));
});

function setDebateRole(role) {
    if (debatePreview) debatePreview.dataset.debatePreview = role;
    debateRoleButtons.forEach((button) => {
        button.setAttribute("aria-pressed", String(button.dataset.debateRole === role));
    });
    debateCopies.forEach((copy) => setPanelVisibility(copy, copy.dataset.debateCopy === role));
    animatePanel(debateCopies.find((copy) => copy.dataset.debateCopy === role), { y: 5 });
}

debateRoleButtons.forEach((button) => {
    button.addEventListener("click", () => setDebateRole(button.dataset.debateRole));
});

function setVscodeStream(stream) {
    vscodeButtons.forEach((button) => {
        const active = button.dataset.vscodeStream === stream;
        if (button.getAttribute("role") === "tab") {
            button.setAttribute("aria-selected", String(active));
            button.tabIndex = active ? 0 : -1;
        }
        button.classList.toggle("is-active", active);
    });
    vscodePanels.forEach((panel) => setPanelVisibility(panel, panel.dataset.vscodePanel === stream));
    terminalPanels.forEach((panel) => setPanelVisibility(panel, panel.dataset.terminalPanel === stream));
    vscodeTabs.forEach((tab) => tab.classList.toggle("is-active", tab.dataset.vscodeTab === stream));
    animatePanel(vscodePanels.find((panel) => panel.dataset.vscodePanel === stream));
    animatePanel(terminalPanels.find((panel) => panel.dataset.terminalPanel === stream), { y: 3, duration: 0.18 });
}

vscodeButtons.forEach((button) => {
    button.addEventListener("click", () => setVscodeStream(button.dataset.vscodeStream));
});

function setOverleafDocument(documentId) {
    overleafButtons.forEach((button) => {
        const active = button.dataset.overleafDoc === documentId;
        button.setAttribute("aria-selected", String(active));
        button.tabIndex = active ? 0 : -1;
    });
    overleafSources.forEach((panel) => setPanelVisibility(panel, panel.dataset.overleafSource === documentId));
    overleafPreviews.forEach((panel) => setPanelVisibility(panel, panel.dataset.overleafPreview === documentId));
    overleafSourceTabs.forEach((tab) => tab.classList.toggle("is-active", tab.dataset.sourceTab === documentId));
    if (currentTex) currentTex.textContent = documentId === "diary" ? "macao-diary.tex" : "between-bells.tex";
    animatePanel(overleafSources.find((panel) => panel.dataset.overleafSource === documentId), { y: 3 });
    animatePanel(overleafPreviews.find((panel) => panel.dataset.overleafPreview === documentId), { y: 5 });
}

overleafButtons.forEach((button) => {
    button.addEventListener("click", () => setOverleafDocument(button.dataset.overleafDoc));
});

compileButton?.addEventListener("click", () => {
    if (compileTimer) window.clearTimeout(compileTimer);
    compileState = "working";
    compileButton.classList.add("is-compiling");
    updateCompileCopy();
    if (compileTime) compileTime.textContent = "Compiling…";

    compileTimer = window.setTimeout(() => {
        compileState = "done";
        compileButton.classList.remove("is-compiling");
        updateCompileCopy();
        if (compileTime) compileTime.textContent = "Compiled just now";
        if (hasGsap()) {
            window.gsap.fromTo(
                overleafPreviews.filter((panel) => !panel.hidden),
                { autoAlpha: 0.72 },
                { autoAlpha: 1, duration: 0.28, clearProps: "opacity,visibility" },
            );
        }
    }, reducedMotion.matches ? 50 : 720);
});

if (bookProof && proofLens) {
    const bookImage = bookProof.querySelector("img");
    bookImage?.addEventListener("pointerenter", (event) => {
        if (event.pointerType === "touch") return;
        bookProof.classList.add("is-inspecting");
    });
    bookImage?.addEventListener("pointerleave", () => {
        bookProof.classList.remove("is-inspecting");
    });
    bookImage?.addEventListener("pointermove", (event) => {
        if (event.pointerType === "touch") return;
        const imageRect = bookImage.getBoundingClientRect();
        const figureRect = bookImage.parentElement.getBoundingClientRect();
        const x = Math.max(0, Math.min(imageRect.width, event.clientX - imageRect.left));
        const y = Math.max(0, Math.min(imageRect.height, event.clientY - imageRect.top));
        const lensRadius = proofLens.offsetWidth / 2;
        const scale = 2.25;
        proofLens.style.left = `${event.clientX - figureRect.left}px`;
        proofLens.style.top = `${event.clientY - figureRect.top}px`;
        proofLens.style.backgroundSize = `${imageRect.width * scale}px ${imageRect.height * scale}px`;
        proofLens.style.backgroundPosition = `${lensRadius - x * scale}px ${lensRadius - y * scale}px`;
    });
}

function startDrag(event, appWindow) {
    if (mobileWindowMode.matches || appWindow.classList.contains("is-maximized")) return;
    if (event.button !== 0 || event.target.closest("button")) return;
    const layerRect = windowLayer.getBoundingClientRect();
    const windowRect = appWindow.getBoundingClientRect();
    dragState = {
        pointerId: event.pointerId,
        appWindow,
        handle: event.currentTarget,
        startX: event.clientX,
        startY: event.clientY,
        left: windowRect.left - layerRect.left,
        top: windowRect.top - layerRect.top,
        layerWidth: layerRect.width,
        layerHeight: layerRect.height,
        width: windowRect.width,
        height: windowRect.height,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    body.classList.add("is-dragging");
    focusWindow(appWindow.dataset.window, true);
}

function moveDrag(event) {
    if (!dragState || event.pointerId !== dragState.pointerId) return;
    const maxLeft = Math.max(0, dragState.layerWidth - Math.min(dragState.width, dragState.layerWidth));
    const maxTop = Math.max(0, dragState.layerHeight - 45);
    const nextLeft = Math.max(0, Math.min(maxLeft, dragState.left + event.clientX - dragState.startX));
    const nextTop = Math.max(0, Math.min(maxTop, dragState.top + event.clientY - dragState.startY));
    dragState.appWindow.style.left = `${nextLeft}px`;
    dragState.appWindow.style.top = `${nextTop}px`;
}

function endDrag(event) {
    if (!dragState || event.pointerId !== dragState.pointerId) return;
    try {
        dragState.handle.releasePointerCapture(event.pointerId);
    } catch {
        // The pointer can already be released by the browser.
    }
    dragState = null;
    body.classList.remove("is-dragging");
}

appWindows.forEach((appWindow) => {
    const handle = appWindow.querySelector("[data-drag-handle]");
    handle?.addEventListener("pointerdown", (event) => startDrag(event, appWindow));
});
window.addEventListener("pointermove", moveDrag);
window.addEventListener("pointerup", endDrag);
window.addEventListener("pointercancel", endDrag);

const pixelCursor = document.querySelector("[data-pixel-cursor]");
const finePointer = window.matchMedia("(pointer: fine)");

if (pixelCursor && finePointer.matches) {
    root.classList.add("has-pixel-cursor");

    document.addEventListener("pointermove", (event) => {
        if (event.pointerType === "touch") return;
        pixelCursor.style.left = `${event.clientX}px`;
        pixelCursor.style.top = `${event.clientY}px`;
        pixelCursor.classList.add("is-visible");
        const interactiveTarget = event.target instanceof Element
            ? event.target.closest("button, a, input, [role='tab'], [role='option']")
            : null;
        pixelCursor.classList.toggle(
            "is-hovering",
            Boolean(interactiveTarget),
        );
    }, { passive: true });

    document.addEventListener("pointerdown", () => {
        pixelCursor.classList.add("is-pressed");
    }, { passive: true });
    document.addEventListener("pointerup", () => {
        pixelCursor.classList.remove("is-pressed");
    }, { passive: true });
    document.documentElement.addEventListener("mouseleave", () => {
        pixelCursor.classList.remove("is-visible");
    });
}

if (finePointer.matches && !reducedMotion.matches) {
    [dock, explorePanel].filter(Boolean).forEach((surface) => {
        surface.addEventListener("pointermove", (event) => {
            const rect = surface.getBoundingClientRect();
            const x = ((event.clientX - rect.left) / Math.max(rect.width, 1)) * 100;
            const y = ((event.clientY - rect.top) / Math.max(rect.height, 1)) * 100;
            surface.style.setProperty("--glass-x", `${x}%`);
            surface.style.setProperty("--glass-y", `${y}%`);
        }, { passive: true });
        surface.addEventListener("pointerleave", () => {
            surface.style.setProperty("--glass-x", "50%");
            surface.style.setProperty("--glass-y", "0%");
        });
    });
}

function closeAllWindowsImmediately() {
    appWindows.forEach((appWindow, appId) => {
        const surface = appWindow.querySelector(".window-surface");
        appWindow.hidden = true;
        appWindow.inert = true;
        appWindow.setAttribute("aria-hidden", "true");
        appWindow.classList.remove("is-open", "is-focused");
        appWindow.dataset.minimized = "false";
        updateDockState(appId, "closed");
        if (window.gsap && surface) {
            window.gsap.set(surface, { clearProps: "transform,opacity,visibility" });
        }
    });
    setDesktopActive();
}

function appFromHash() {
    const candidate = decodeURIComponent(window.location.hash.slice(1));
    return appIds.includes(candidate) ? candidate : null;
}

window.addEventListener("popstate", () => {
    const appId = appFromHash();
    if (appId) {
        openApp(appId, { historyMode: "none", restoreFocus: false });
    } else {
        closeAllWindowsImmediately();
    }
});

function boot() {
    body.classList.add("is-ready");
    if (hasGsap()) {
        const timeline = window.gsap.timeline({ defaults: { ease: "power3.out" } });
        timeline
            .from(".wallpaper", { scale: 1.018, autoAlpha: 0, duration: 0.7 })
            .from(".menu-bar", { y: -18, autoAlpha: 0, duration: 0.32 }, "-=0.42")
            .from(".desktop-icon", { x: 10, autoAlpha: 0, duration: 0.28, stagger: 0.055 }, "-=0.12")
            .from(".dock", { y: 34, autoAlpha: 0, duration: 0.42 }, "-=0.17")
            .from(".dock-item", { y: 14, autoAlpha: 0, duration: 0.24, stagger: 0.025 }, "-=0.26");
    }

    setXcodeProject("sports");
    setSportsPhase("before");
    setDebateRole("team");
    setVscodeStream("software");
    setOverleafDocument("diary");

    const initialApp = appFromHash();
    if (initialApp) {
        window.setTimeout(
            () => openApp(initialApp, { historyMode: "none", restoreFocus: false }),
            hasGsap() ? 420 : 0,
        );
    } else {
        history.replaceState({ app: null }, "", `${window.location.pathname}${window.location.search}`);
    }
}

boot();

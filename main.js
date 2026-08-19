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

function setDockItemLabel(item, copy) {
    const zh = copy?.zh || copy?.en || "";
    const en = copy?.en || copy?.zh || "";
    item.dataset.dockLabelZh = zh;
    item.dataset.dockLabelEn = en;
    item.setAttribute("aria-label", en);
}

function appsLauncher() {
    const launcher = document.createElement("button");
    launcher.type = "button";
    launcher.className = "dock-item dock-apps-item";
    launcher.dataset.openLaunchpad = "";
    launcher.dataset.dockExplore = "";
    launcher.setAttribute("aria-haspopup", "dialog");
    launcher.setAttribute("aria-controls", "launchpad");
    setDockItemLabel(launcher, { zh: "Apps", en: "Apps" });

    const icon = document.createElement("span");
    icon.className = "dock-icon apps-icon";
    icon.setAttribute("aria-hidden", "true");
    const image = document.createElement("img");
    image.src = "assets/app-icons/apps.png";
    image.alt = "";
    image.width = 64;
    image.height = 64;
    icon.append(image);

    launcher.append(icon);
    return launcher;
}

function renderLaunchers() {
    const exploreContainer = document.querySelector("[data-explore-results]");
    const launchpadContainer = document.querySelector("[data-launchpad-results]");
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

        if (launchpadContainer) {
            const launcher = document.createElement("button");
            launcher.type = "button";
            launcher.className = "launchpad-app";
            launcher.dataset.openApp = app.id;
            launcher.dataset.launchpadKeywords = `${app.keywords} ${app.appLabel}`;
            launcher.append(appIcon(app, "launchpad-icon"));

            const title = document.createElement("strong");
            title.textContent = app.appLabel;
            launcher.append(title);
            launchpadContainer.append(launcher);
        }

        if (dockContainer) {
            const launcher = document.createElement("button");
            launcher.type = "button";
            launcher.className = "dock-item";
            launcher.dataset.openApp = app.id;
            launcher.dataset.dockApp = app.id;
            setDockItemLabel(launcher, app.dockLabel);

            const indicator = document.createElement("span");
            indicator.className = "dock-indicator";
            indicator.setAttribute("aria-hidden", "true");
            launcher.append(appIcon(app, "dock-icon"), indicator);
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
        setDockItemLabel(mail, { zh: "Mail", en: "Mail" });
        const icon = document.createElement("span");
        icon.className = "dock-icon mail-icon";
        icon.setAttribute("aria-hidden", "true");
        const image = document.createElement("img");
        image.src = "assets/app-icons/mail.png";
        image.alt = "";
        image.width = 64;
        image.height = 64;
        icon.append(image);
        mail.append(icon);
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
const dockHoverLabel = document.querySelector("[data-dock-hover-label]");
const menuBar = document.querySelector(".menu-bar");
const activeAppName = document.querySelector("[data-active-app]");
const announcer = document.querySelector("[data-announcer]");
const description = document.querySelector('meta[name="description"]');
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const mobileWindowMode = window.matchMedia("(max-width: 700px)");
const vscodeFrame = document.querySelector("[data-vscode-frame]");
const vscodeHost = vscodeFrame?.closest(".vscode-native-host");
const vscodeLoadingLabel = document.querySelector("[data-vscode-loading-label]");
const vscodeRetry = document.querySelector("[data-vscode-retry]");
const vscodeCommandCenter = document.querySelector(".vscode-native-command-center");

const languageButtons = [...document.querySelectorAll("[data-set-language]")];
const languageToggles = [...document.querySelectorAll("[data-language-toggle]")];
const clock = document.querySelector("[data-clock]");
const appWindows = new Map(
    [...document.querySelectorAll("[data-window]")].map((element) => [element.dataset.window, element]),
);
const appIds = [...appWindows.keys()];
const dockButtons = new Map(
    [...document.querySelectorAll("[data-dock-app]")].map((element) => [element.dataset.dockApp, element]),
);
const dockExploreButton = document.querySelector("[data-dock-explore]");

const launchpad = document.querySelector("[data-launchpad]");
const launchpadInput = document.querySelector("[data-launchpad-input]");
const launchpadResults = [...document.querySelectorAll(".launchpad-app")];
const launchpadEmpty = document.querySelector("[data-launchpad-empty]");

const explorePanel = document.querySelector("[data-explore]");
const exploreBackdrop = document.querySelector("[data-explore-backdrop]");
const exploreInput = document.querySelector("[data-explore-input]");
const exploreResults = [...document.querySelectorAll("[data-explore-result]")];
const exploreEmpty = document.querySelector("[data-explore-empty]");
const exploreFilters = [...document.querySelectorAll("[data-explore-filter]")];

const menuTriggers = [...document.querySelectorAll("[data-menu-trigger]")];
const menuPanels = [...document.querySelectorAll("[data-menu-panel]")];
const statusTriggers = [...document.querySelectorAll("[data-status-trigger]")];
const statusPanels = [...document.querySelectorAll("[data-status-panel]")];
const contextMenu = document.querySelector("[data-context-menu]");
const viewOptions = document.querySelector("[data-view-options]");
const desktopIconSize = document.querySelector("[data-desktop-icon-size]");
const desktopGridSpacing = document.querySelector("[data-desktop-grid-spacing]");
const displayBrightness = document.querySelector("[data-display-brightness]");
const calendarWeekday = document.querySelector("[data-calendar-weekday]");
const calendarDay = document.querySelector("[data-calendar-day]");
const calendarMonth = document.querySelector("[data-calendar-month]");

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

const goodnotesWindow = document.querySelector('[data-window="goodnotes"]');
const goodnotesViews = [...document.querySelectorAll("[data-gn-view]")];
const goodnotesGrid = document.querySelector("[data-gn-document-grid]");
const goodnotesItemsGrid = document.querySelector("[data-gn-items-grid]");
const goodnotesSearchResults = document.querySelector("[data-gn-search-results]");
const goodnotesSearchEmpty = document.querySelector("[data-gn-search-empty]");
const goodnotesSearchScreen = document.querySelector("[data-gn-search-screen]");
const goodnotesSearchRecents = document.querySelector("[data-gn-search-recents]");
const goodnotesSearch = document.querySelector("[data-gn-search]");
const goodnotesEmpty = document.querySelector("[data-gn-empty]");
const goodnotesToast = document.querySelector("[data-gn-toast]");
const goodnotesLibraryMain = document.querySelector("[data-gn-library-main]");
const goodnotesCompactHeader = document.querySelector("[data-gn-compact-header]");
const goodnotesLibraryTitles = [...document.querySelectorAll("[data-gn-library-title]")];
const goodnotesLayoutIcon = document.querySelector("[data-gn-layout-icon]");
const goodnotesFilterMenu = document.querySelector("[data-gn-filter-menu]");
const goodnotesViewMenu = document.querySelector("[data-gn-view-menu]");
const goodnotesNewMenu = document.querySelector("[data-gn-new-menu]");
const goodnotesDocumentMenu = document.querySelector("[data-gn-document-menu]");
const goodnotesPageStrip = document.querySelector("[data-gn-page-strip]");
const goodnotesPageGrid = document.querySelector(".gn-page-grid");
const goodnotesPageFilter = document.querySelector(".gn-page-filter");
const goodnotesPageEmpty = document.querySelector("[data-gn-page-empty]");
const goodnotesPageStatusZh = document.querySelector("[data-gn-page-status-zh]");
const goodnotesPageStatusEn = document.querySelector("[data-gn-page-status-en]");
const goodnotesEditTools = document.querySelector("[data-gn-edit-tools]");
const goodnotesFilterButtons = [...document.querySelectorAll("[data-gn-filter]")];
const goodnotesFolderButtons = [...document.querySelectorAll("[data-gn-folder]")];
const goodnotesLibraryButtons = [...document.querySelectorAll("[data-gn-library-button], [data-gn-close-tab]")];
const goodnotesToolButtons = [...document.querySelectorAll("[data-gn-tool]")];
const goodnotesEditorTitle = document.querySelector("[data-gn-editor-title]");
const goodnotesPageSubject = document.querySelector("[data-gn-page-subject]");
const goodnotesPageTitle = document.querySelector("[data-gn-page-title]");
const goodnotesPageDate = document.querySelector("[data-gn-page-date]");
const goodnotesPaper = document.querySelector("[data-gn-paper]");
const goodnotesNoteContent = document.querySelector("[data-gn-note-content]");

const booksWindow = document.querySelector('[data-window="books"]');
const booksViews = [...document.querySelectorAll("[data-books-view]")];
const booksNavButtons = [...document.querySelectorAll("[data-books-nav]")];
const booksOpenButtons = [...document.querySelectorAll("[data-books-open]")];
const booksSearch = document.querySelector("[data-books-search]");
const booksSearchClear = document.querySelector("[data-books-search-clear]");
const booksSearchResults = document.querySelector("[data-books-search-results]");
const booksSearchEmpty = document.querySelector("[data-books-search-empty]");
const booksTrending = document.querySelector(".books-trending");
const booksTrendingTitle = document.querySelector(".books-search-content > h3");
const booksMoreButton = document.querySelector("[data-books-more]");
const booksMoreMenu = document.querySelector("[data-books-more-menu]");
const booksReaderTitle = document.querySelector("[data-books-reader-title]");
const booksReaderAuthor = document.querySelector("[data-books-reader-author]");
const booksReaderHeading = document.querySelector("[data-books-reader-heading]");
const booksReaderCopy = document.querySelector("[data-books-reader-copy]");
const booksReaderProgress = document.querySelector("[data-books-reader-progress]");
const booksReaderRange = document.querySelector(".books-reader-stage input[type='range']");
const booksHomeScroll = document.querySelector(".books-home-scroll");
const booksLibraryScroll = document.querySelector(".books-library-scroll");

const pageCopy = {
    zh: {
        title: "建設中建設中建設中建設中",
        description: "建設中建設中建設中建設中",
        searchPlaceholder: "建設中建設中建設中建設中",
        searchLabel: "建設中建設中建設中建設中",
        launchpadPlaceholder: "搜尋",
        launchpadLabel: "搜尋 App",
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
        title: "建設中建設中建設中建設中",
        description: "建設中建設中建設中建設中",
        searchPlaceholder: "建設中建設中建設中建設中",
        searchLabel: "建設中建設中建設中建設中",
        launchpadPlaceholder: "Search",
        launchpadLabel: "Search Apps",
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
let launchpadOpen = false;
let selectedExploreIndex = 0;
let previousExploreFocus = null;
let previousLaunchpadFocus = null;
let compileState = "done";
let compileTimer = null;
let dragState = null;
let refreshDockHoverLabel = () => {};
let refreshGoodnotesCopy = () => {};
let refreshBooksCopy = () => {};

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
    if (launchpadInput) {
        launchpadInput.placeholder = pageCopy[next].launchpadPlaceholder;
        launchpadInput.setAttribute("aria-label", pageCopy[next].launchpadLabel);
    }

    languageButtons.forEach((button) => {
        button.setAttribute("aria-pressed", String(button.dataset.setLanguage === next));
    });
    languageToggles.forEach((button) => {
        button.setAttribute("aria-label", pageCopy[next].switchLanguage);
    });

    document.querySelectorAll("[data-window-action]").forEach((button) => {
        const action = button.dataset.windowAction;
        button.setAttribute("aria-label", pageCopy[next].windowActions[action] || action);
    });

    document.querySelectorAll("[data-dock-label-zh]").forEach((item) => {
        item.setAttribute("aria-label", next === "en"
            ? item.dataset.dockLabelEn
            : item.dataset.dockLabelZh);
    });
    refreshDockHoverLabel();
    refreshGoodnotesCopy();
    refreshBooksCopy();

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
languageToggles.forEach((button) => {
    button.addEventListener("click", () => {
        setLanguage(language() === "zh" ? "en" : "zh");
    });
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

    if (calendarWeekday) {
        calendarWeekday.textContent = new Intl.DateTimeFormat(locale, { weekday: "long" }).format(now);
    }
    if (calendarDay) calendarDay.textContent = String(now.getDate());
    if (calendarMonth) {
        calendarMonth.textContent = new Intl.DateTimeFormat(locale, {
            month: "long",
            year: "numeric",
        }).format(now);
    }
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

function scheduleVscodeWarmup() {
    ensureVscodeLoaded();
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

function openApp(appId, options = {}) {
    const appWindow = appWindows.get(appId);
    if (!appWindow) return;
    const {
        historyMode = "push",
        restoreFocus = true,
        animate = true,
    } = options;

    if (appId === "vscode") ensureVscodeLoaded();

    if (exploreOpen) closeExplore(false);
    if (launchpadOpen) closeLaunchpad(false);

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

function closeMenuPopovers(except = null) {
    menuPanels.forEach((panel) => {
        const keepOpen = panel === except;
        panel.hidden = !keepOpen;
        const trigger = menuTriggers.find((item) => item.dataset.menuTrigger === panel.dataset.menuPanel);
        trigger?.setAttribute("aria-expanded", String(keepOpen));
        trigger?.classList.toggle("is-active", keepOpen);
    });
}

function openMenuPopover(trigger, focusFirst = false) {
    const panel = menuPanels.find((item) => item.dataset.menuPanel === trigger.dataset.menuTrigger);
    if (!panel) return;
    const wasOpen = !panel.hidden;
    closeStatusPanels();
    closeMenuPopovers(wasOpen ? null : panel);
    if (!wasOpen && focusFirst) {
        window.setTimeout(() => panel.querySelector('[role="menuitem"]')?.focus(), 0);
    }
}

menuTriggers.forEach((trigger) => {
    trigger.addEventListener("click", (event) => {
        event.stopPropagation();
        openMenuPopover(trigger);
    });
    trigger.addEventListener("pointerenter", () => {
        if (menuPanels.some((panel) => !panel.hidden)) openMenuPopover(trigger);
    });
    trigger.addEventListener("keydown", (event) => {
        if (!["ArrowDown", "Enter", " "].includes(event.key)) return;
        event.preventDefault();
        openMenuPopover(trigger, true);
    });
});

menuPanels.forEach((panel) => {
    panel.addEventListener("keydown", (event) => {
        const items = [...panel.querySelectorAll('[role="menuitem"]')];
        const index = items.indexOf(document.activeElement);
        if (event.key === "Escape") {
            event.preventDefault();
            const trigger = menuTriggers.find((item) => item.dataset.menuTrigger === panel.dataset.menuPanel);
            closeMenuPopovers();
            trigger?.focus();
            return;
        }
        if (!["ArrowDown", "ArrowUp"].includes(event.key) || !items.length) return;
        event.preventDefault();
        const delta = event.key === "ArrowDown" ? 1 : -1;
        items[(Math.max(index, 0) + delta + items.length) % items.length].focus();
    });
});

function closeStatusPanels(except = null) {
    statusPanels.forEach((panel) => {
        const keepOpen = panel === except;
        panel.hidden = !keepOpen;
        const trigger = statusTriggers.find((item) => item.dataset.statusTrigger === panel.dataset.statusPanel);
        trigger?.setAttribute("aria-expanded", String(keepOpen));
        trigger?.classList.toggle("is-active", keepOpen);
    });
}

statusTriggers.forEach((trigger) => {
    trigger.addEventListener("click", (event) => {
        event.stopPropagation();
        const panel = statusPanels.find((item) => item.dataset.statusPanel === trigger.dataset.statusTrigger);
        if (!panel) return;
        const wasOpen = !panel.hidden;
        closeMenuPopovers();
        closeStatusPanels(wasOpen ? null : panel);
    });
});

function hideContextMenu() {
    if (contextMenu) contextMenu.hidden = true;
}

function cleanUpDesktop() {
    const icons = [...document.querySelectorAll(".desktop-icon")];
    if (hasGsap()) {
        window.gsap.fromTo(
            icons,
            { x: 14, rotate: 1.2 },
            { x: 0, rotate: 0, duration: 0.38, stagger: 0.04, ease: "back.out(2)", clearProps: "transform" },
        );
    } else {
        icons.forEach((icon) => {
            icon.classList.remove("is-cleaning");
            void icon.offsetWidth;
            icon.classList.add("is-cleaning");
        });
    }
}

function toggleViewOptions(force) {
    if (!viewOptions) return;
    const next = typeof force === "boolean" ? force : viewOptions.hidden;
    viewOptions.hidden = !next;
    if (next) viewOptions.querySelector("input")?.focus({ preventScroll: true });
}

function activeWindowId() {
    return visibleWindows().at(-1)?.dataset.window || null;
}

function runShellCommand(command) {
    const appId = activeWindowId();
    closeMenuPopovers();
    closeStatusPanels();
    hideContextMenu();

    if (command === "new-finder") openApp("about");
    if (command === "open-launchpad") openLaunchpad();
    if (command === "open-spotlight") openExplore();
    if (command === "close-active" && appId) closeApp(appId);
    if (command === "minimize-active" && appId) minimizeApp(appId);
    if (command === "maximize-active" && appId) toggleMaximize(appId);
    if (command === "language") setLanguage(language() === "zh" ? "en" : "zh");
    if (command === "show-view-options") toggleViewOptions(true);
    if (command === "clean-up") cleanUpDesktop();
    if (command === "bring-all") {
        visibleWindows().forEach((appWindow) => focusWindow(appWindow.dataset.window));
    }
}

document.querySelectorAll("[data-menu-command]").forEach((button) => {
    button.addEventListener("click", () => runShellCommand(button.dataset.menuCommand));
});

document.querySelectorAll(".menu-popover [data-open-app], .status-panel [data-open-app]").forEach((item) => {
    item.addEventListener("click", () => {
        closeMenuPopovers();
        closeStatusPanels();
    });
});

desktop?.addEventListener("contextmenu", (event) => {
    if (!contextMenu) return;
    event.preventDefault();
    closeMenuPopovers();
    closeStatusPanels();
    contextMenu.hidden = false;
    const rect = contextMenu.getBoundingClientRect();
    const left = Math.max(6, Math.min(event.clientX, window.innerWidth - rect.width - 6));
    const top = Math.max(varMenuHeight(), Math.min(event.clientY, window.innerHeight - rect.height - 6));
    contextMenu.style.left = `${left}px`;
    contextMenu.style.top = `${top}px`;
    contextMenu.querySelector("button")?.focus({ preventScroll: true });
});

function varMenuHeight() {
    return Number.parseFloat(getComputedStyle(root).getPropertyValue("--menu-height")) || 31;
}

document.querySelectorAll("[data-context-command]").forEach((button) => {
    button.addEventListener("click", () => {
        const command = button.dataset.contextCommand;
        if (command === "new-finder" || command === "get-info") openApp("about");
        if (command === "open-launchpad") openLaunchpad();
        if (command === "clean-up") cleanUpDesktop();
        if (command === "show-view-options") toggleViewOptions(true);
        hideContextMenu();
    });
});

document.querySelector("[data-close-view-options]")?.addEventListener("click", () => toggleViewOptions(false));
desktopIconSize?.addEventListener("input", () => {
    root.style.setProperty("--desktop-icon-size", `${desktopIconSize.value}px`);
});
desktopGridSpacing?.addEventListener("input", () => {
    root.style.setProperty("--desktop-grid-spacing", `${desktopGridSpacing.value}px`);
});
displayBrightness?.addEventListener("input", () => {
    root.style.setProperty("--screen-brightness", String(Number(displayBrightness.value) / 100));
});

document.addEventListener("pointerdown", (event) => {
    if (!event.target.closest(".menu-item")) closeMenuPopovers();
    if (!event.target.closest(".status-menu")) closeStatusPanels();
    if (!event.target.closest("[data-context-menu]")) hideContextMenu();
    if (viewOptions && !viewOptions.hidden && !event.target.closest("[data-view-options], [data-menu-command='show-view-options'], [data-context-command='show-view-options']")) {
        toggleViewOptions(false);
    }
});

function filterLaunchpad() {
    const query = (launchpadInput?.value || "").trim().toLocaleLowerCase();
    let visibleCount = 0;
    launchpadResults.forEach((app) => {
        const haystack = `${app.dataset.launchpadKeywords || ""} ${app.textContent}`.toLocaleLowerCase();
        app.hidden = Boolean(query && !haystack.includes(query));
        if (!app.hidden) visibleCount += 1;
    });
    if (launchpadEmpty) launchpadEmpty.hidden = visibleCount > 0;
}

function setLaunchpadIsolation(isolated) {
    [desktop, windowLayer, menuBar].forEach((element) => {
        if (element) element.inert = isolated;
    });
}

function openLaunchpad() {
    if (!launchpad) return;
    if (launchpadOpen) {
        closeLaunchpad();
        return;
    }
    if (exploreOpen) closeExplore(false);
    closeMenuPopovers();
    closeStatusPanels();
    hideContextMenu();
    launchpadOpen = true;
    previousLaunchpadFocus = document.activeElement;
    body.classList.add("is-launchpad-open");
    launchpad.hidden = false;
    launchpad.setAttribute("aria-hidden", "false");
    setLaunchpadIsolation(true);
    dockExploreButton?.classList.add("is-open");
    if (launchpadInput) launchpadInput.value = "";
    filterLaunchpad();

    if (hasGsap()) {
        window.gsap.killTweensOf([launchpad, ...launchpadResults]);
        window.gsap.fromTo(
            launchpad,
            { autoAlpha: 0 },
            { autoAlpha: 1, duration: 0.28, ease: "power2.out", clearProps: "opacity,visibility" },
        );
        window.gsap.fromTo(
            launchpadResults,
            { y: 18, scale: 0.94, autoAlpha: 0 },
            {
                y: 0,
                scale: 1,
                autoAlpha: 1,
                duration: 0.32,
                stagger: 0.045,
                ease: "back.out(1.45)",
                clearProps: "transform,opacity,visibility",
            },
        );
    }
    window.setTimeout(() => launchpadInput?.focus({ preventScroll: true }), hasGsap() ? 180 : 0);
}

function finishLaunchpadClose(restoreFocus) {
    if (!launchpad) return;
    launchpad.hidden = true;
    launchpad.setAttribute("aria-hidden", "true");
    body.classList.remove("is-launchpad-open");
    setLaunchpadIsolation(false);
    dockExploreButton?.classList.remove("is-open");
    if (window.gsap) {
        window.gsap.set([launchpad, ...launchpadResults], { clearProps: "transform,opacity,visibility" });
    }
    if (restoreFocus && previousLaunchpadFocus instanceof HTMLElement) {
        previousLaunchpadFocus.focus({ preventScroll: true });
    }
    previousLaunchpadFocus = null;
}

function closeLaunchpad(restoreFocus = true) {
    if (!launchpadOpen) return;
    launchpadOpen = false;
    if (hasGsap()) {
        window.gsap.killTweensOf(launchpad);
        window.gsap.to(launchpad, {
            autoAlpha: 0,
            duration: 0.2,
            ease: "power2.in",
            onComplete: () => finishLaunchpadClose(restoreFocus),
        });
    } else {
        finishLaunchpadClose(restoreFocus);
    }
}

document.querySelectorAll("[data-open-launchpad]").forEach((button) => {
    button.addEventListener("click", openLaunchpad);
});
launchpadInput?.addEventListener("input", filterLaunchpad);
launchpad?.addEventListener("keydown", (event) => {
    const visible = launchpadResults.filter((item) => !item.hidden);
    if (event.key === "Escape") {
        event.preventDefault();
        closeLaunchpad();
        return;
    }
    if (event.key === "Enter" && document.activeElement === launchpadInput && visible.length === 1) {
        event.preventDefault();
        visible[0].click();
        return;
    }
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) return;
    const index = visible.indexOf(document.activeElement);
    if (index < 0) return;
    event.preventDefault();
    const columns = Math.max(1, Number.parseInt(getComputedStyle(launchpad.querySelector(".launchpad-grid")).gridTemplateColumns.split(" ").length, 10));
    const delta = event.key === "ArrowLeft" ? -1
        : event.key === "ArrowRight" ? 1
            : event.key === "ArrowUp" ? -columns : columns;
    visible[(index + delta + visible.length) % visible.length].focus();
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
    if (launchpadOpen) closeLaunchpad(false);
    closeMenuPopovers();
    closeStatusPanels();
    hideContextMenu();
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

    if (!typing && event.metaKey && event.key.toLocaleLowerCase() === "n") {
        event.preventDefault();
        openApp("about");
        return;
    }

    if (!typing && event.metaKey && event.key.toLocaleLowerCase() === "w") {
        const appId = activeWindowId();
        if (appId) {
            event.preventDefault();
            closeApp(appId);
        }
        return;
    }

    if (!typing && event.metaKey && event.key.toLocaleLowerCase() === "m") {
        const appId = activeWindowId();
        if (appId) {
            event.preventDefault();
            minimizeApp(appId);
        }
        return;
    }

    const shortcutApp = appManifest.find((app) => app.shortcut === event.key);
    if (event.altKey && !event.metaKey && !event.ctrlKey && shortcutApp) {
        event.preventDefault();
        openApp(shortcutApp.id);
        return;
    }

    if (event.key === "Escape") {
        if (exploreOpen) {
            event.preventDefault();
            closeExplore();
        } else if (launchpadOpen) {
            event.preventDefault();
            closeLaunchpad();
        } else {
            closeMenuPopovers();
            closeStatusPanels();
            hideContextMenu();
        }
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
    if (currentTex) currentTex.textContent = "建設中建設中建設中建設中";
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

const goodnotesSubjectCopy = {
    math: { zh: "數學 · MATHEMATICS", en: "MATHEMATICS" },
    physics: { zh: "物理 · PHYSICS", en: "PHYSICS" },
    chemistry: { zh: "化學 · CHEMISTRY", en: "CHEMISTRY" },
};

const gnBi = (zh, en) => ({ zh, en });
const gnSection = (title, zhLines, enLines, formula = "", mark = "yellow") => ({
    title: gnBi(title[0], title[1]),
    lines: gnBi(zhLines, enLines),
    formula,
    mark,
});
const gnPage = (title, layout, sections, sketch, callout) => ({
    title: gnBi(title[0], title[1]),
    layout,
    sections,
    sketch,
    callout: gnBi(callout[0], callout[1]),
});

let goodnotesDocuments = [
    {
        id: "calculus",
        subject: "math",
        favorite: true,
        shared: false,
        preview: "DIFFERENTIATION",
        title: gnBi("微積分整理", "Calculus Review"),
        updated: gnBi("7月28日 下午8:14", "28 Jul, 8:14 PM"),
        date: gnBi("2026年7月28日", "28 JUL 2026"),
        pages: [
            gnPage(["導數工具箱", "Derivative toolkit"], "split", [
                gnSection(["先分辨結構", "Read the structure first"], ["外層 × 內層 → 鏈式法則", "兩個函數相乘 → 乘積法則"], ["outer × inner → chain rule", "two functions multiplied → product rule"], "[f(g(x))]′ = f′(g(x))g′(x)", "yellow"),
                gnSection(["最常用三條", "Three rules I keep using"], ["冪次先乘到前面，再把次方減 1", "商數法則分母記得平方"], ["bring the power down, then subtract one", "the quotient-rule denominator is squared"], "(uv)′ = u′v + uv′", "blue"),
            ], { type: "curve", labels: ["secant", "tangent", "gradient"] }, ["每行只做一個動作；最後先代數值，再整理。", "One algebra move per line; substitute before simplifying."]),
            gnPage(["積分＝反向求導", "Integration reverses differentiation"], "flow", [
                gnSection(["不定積分", "Indefinite integrals"], ["積完一定補 + C", "先把根式、分式寫成冪次"], ["always include + C", "rewrite roots and fractions as powers first"], "∫xⁿdx = xⁿ⁺¹/(n+1) + C", "mint"),
                gnSection(["定積分與面積", "Definite integrals and area"], ["上限代入減下限代入", "跨過 x 軸時要分段；幾何面積取絕對值"], ["upper value minus lower value", "split at x-axis crossings; geometric area is positive"], "∫ₐᵇf(x)dx = F(b) − F(a)", "pink"),
            ], { type: "area", labels: ["a", "signed area", "b"] }, ["積分答案微分一次，應該回到 integrand。", "Differentiate the result: it should return the integrand."]),
            gnPage(["切線與法線｜完整例題", "Tangent & normal — worked example"], "worked", [
                gnSection(["題目", "Question"], ["曲線 y = x² + 3x，在 x = 1 求切線及法線。"], ["For y = x² + 3x, find tangent and normal at x = 1."], "y(1)=4,  dy/dx = 2x+3", "yellow"),
                gnSection(["逐步做", "Working"], ["x=1 時斜率 mₜ=5", "法線斜率 mₙ=−1/5", "都通過點 (1,4)"], ["at x=1, tangent slope mₜ=5", "normal slope mₙ=−1/5", "both pass through (1,4)"], "y−4=5(x−1)  /  y−4=−⅕(x−1)", "violet"),
            ], { type: "curve", labels: ["(1,4)", "m=5", "m=−1/5"] }, ["兩條非垂直直線互相垂直 ⇒ 斜率乘積 = −1。", "Perpendicular non-vertical lines have slope product −1."]),
            gnPage(["最優化：先畫再設變量", "Optimisation: sketch, then define"], "map", [
                gnSection(["固定周長的長方形", "Rectangle with fixed perimeter"], ["周長 20 ⇒ y = 10−x", "面積 A=x(10−x)"], ["perimeter 20 ⇒ y = 10−x", "area A=x(10−x)"], "A′=10−2x=0  ⇒  x=5", "blue"),
                gnSection(["最大還是最小？", "Maximum or minimum?"], ["A″=−2 < 0，所以是最大值", "記得回答題目要的量及單位"], ["A″=−2 < 0, so this is a maximum", "state the requested quantity and units"], "Amax = 5×5 = 25", "yellow"),
            ], { type: "box", labels: ["x", "10−x", "Amax"] }, ["可行域也要檢查：這題 0 < x < 10。", "Check the feasible domain: here 0 < x < 10."]),
            gnPage(["微積分考前一頁", "One-page calculus check"], "checklist", [
                gnSection(["看到題目先問", "Before calculating"], ["函數的 domain？", "要的是斜率、面積，還是座標？", "答案需不需要 exact form？"], ["what is the domain?", "slope, area, or coordinates?", "is exact form required?"], "differentiate → solve → interpret", "mint"),
                gnSection(["最後 30 秒", "Final 30 seconds"], ["+C、上下限、正負號", "把答案代回條件", "單位與有效數字"], ["+C, limits, and signs", "substitute into the condition", "units and significant figures"], "✓ structure  ✓ algebra  ✓ meaning", "pink"),
            ], { type: "checklist", labels: ["rules", "working", "check"] }, ["我最常錯的不是 calculus，是太早把式子展開。", "My common error is expanding too early, not the calculus itself."]),
        ],
    },
    {
        id: "trigonometry",
        subject: "math",
        favorite: false,
        shared: false,
        preview: "TRIGONOMETRY",
        title: gnBi("三角函數公式", "Trigonometry Formulae"),
        updated: gnBi("7月24日 下午5:40", "24 Jul, 5:40 PM"),
        date: gnBi("2026年7月24日", "24 JUL 2026"),
        pages: [
            gnPage(["單位圓｜exact values", "Unit circle — exact values"], "map", [
                gnSection(["坐標就是答案", "Coordinates are the answer"], ["圓上點 = (cosθ, sinθ)", "tanθ = sinθ / cosθ"], ["point on circle = (cosθ, sinθ)", "tanθ = sinθ / cosθ"], "30°=π/6, 45°=π/4, 60°=π/3", "yellow"),
                gnSection(["象限符號", "Signs by quadrant"], ["I：全部正；II：sin 正", "III：tan 正；IV：cos 正"], ["I: all positive; II: sin positive", "III: tan positive; IV: cos positive"], "ASTC → All / Sin / Tan / Cos", "blue"),
            ], { type: "circle", labels: ["cosθ", "sinθ", "tanθ"] }, ["角度制 ↔ 弧度制：乘 π/180 或 180/π。", "Degrees ↔ radians: multiply by π/180 or 180/π."]),
            gnPage(["恆等式不是公式大亂鬥", "Identity strategy"], "split", [
                gnSection(["三個核心", "Three core identities"], ["需要消掉 tan，就改寫成 sin/cos", "看到 1−sin²x，就換成 cos²x"], ["rewrite tan as sin/cos when needed", "replace 1−sin²x with cos²x"], "sin²x+cos²x=1,  tanx=sinx/cosx", "mint"),
                gnSection(["雙角與降冪", "Double angle and power reduction"], ["依題目已有的函數選版本", "不要一開始把所有式子都展開"], ["choose the form matching the expression", "do not expand everything at once"], "cos2x = 1−2sin²x = 2cos²x−1", "pink"),
            ], { type: "identity", labels: ["sin²", "cos²", "1"] }, ["證明題只改一邊；不要同時改 LHS 和 RHS。", "For proofs, transform one side only."]),
            gnPage(["解方程：先基本角，再補週期", "Equations: principal angles, then cycles"], "worked", [
                gnSection(["例：sin2x = √3/2", "Example: sin2x = √3/2"], ["範圍 0≤x<2π，所以 0≤2x<4π", "2x = π/3, 2π/3, 7π/3, 8π/3"], ["0≤x<2π gives 0≤2x<4π", "2x = π/3, 2π/3, 7π/3, 8π/3"], "x = π/6, π/3, 7π/6, 4π/3", "yellow"),
                gnSection(["檢查", "Check"], ["逐個代回原式", "確認全部都在指定範圍"], ["substitute every value", "confirm every value is in range"], "period(sin2x)=π", "violet"),
            ], { type: "circle", labels: ["π/3", "2π/3", "+2π"] }, ["calculator 用 RAD 還是 DEG，要在第一行就確認。", "Confirm RAD or DEG before the first calculation."]),
            gnPage(["圖像變換", "Graph transformations"], "flow", [
                gnSection(["y = a sin(bx+c)+d", "y = a sin(bx+c)+d"], ["振幅 = |a|；中線 y=d", "週期 = 2π/|b|"], ["amplitude = |a|; midline y=d", "period = 2π/|b|"], "phase shift = −c/b", "blue"),
                gnSection(["畫圖次序", "Sketching order"], ["先畫中線與一個週期", "標出最大、最小及零點，再連成光滑曲線"], ["draw the midline and one period", "mark maxima, minima, zeros, then connect smoothly"], "range: [d−|a|, d+|a|]", "yellow"),
            ], { type: "wave", labels: ["amplitude", "period", "midline"] }, ["sin 從中線向上；cos 從極大值開始。", "sin starts upward at the midline; cos starts at a maximum."]),
            gnPage(["非直角三角形｜選哪條公式？", "Non-right triangles — which rule?"], "checklist", [
                gnSection(["正弦定理", "Sine rule"], ["已知一組對邊與對角時最好用", "SSA 要留意 ambiguous case"], ["best when one opposite side-angle pair is known", "SSA may have an ambiguous case"], "a/sinA = b/sinB = c/sinC", "mint"),
                gnSection(["餘弦定理＋面積", "Cosine rule and area"], ["SAS 或 SSS 用餘弦定理", "兩邊夾角可直接求面積"], ["use cosine rule for SAS or SSS", "two sides and included angle give area"], "a²=b²+c²−2bc cosA;  Area=½bc sinA", "pink"),
            ], { type: "triangle", labels: ["a↔A", "b↔B", "c↔C"] }, ["圖不一定按比例；邊和對角的配對要自己標。", "The diagram may not be to scale; label opposite pairs yourself."]),
        ],
    },
    {
        id: "statistics",
        subject: "math",
        favorite: false,
        shared: false,
        preview: "PROBABILITY",
        title: gnBi("概率與統計", "Probability & Statistics"),
        updated: gnBi("7月20日 上午10:22", "20 Jul, 10:22 AM"),
        date: gnBi("2026年7月20日", "20 JUL 2026"),
        pages: [
            gnPage(["條件概率｜樣本空間變了", "Conditional probability changes the sample"], "split", [
                gnSection(["核心", "Core idea"], ["條件 B 已發生，所以分母是 P(B)", "交集是 A 與 B 同時發生"], ["once B is known, the denominator is P(B)", "the intersection means A and B both occur"], "P(A|B)=P(A∩B)/P(B)", "yellow"),
                gnSection(["樹狀圖", "Probability trees"], ["沿同一路徑相乘", "互斥的完整路徑相加"], ["multiply along a path", "add mutually exclusive complete paths"], "P(A∩B)=P(A)P(B|A)", "blue"),
            ], { type: "tree", labels: ["A", "B|A", "not B"] }, ["獨立才可以寫 P(A∩B)=P(A)P(B)。", "Only independent events allow P(A∩B)=P(A)P(B)."]),
            gnPage(["二項分佈", "Binomial distribution"], "flow", [
                gnSection(["先驗四個條件", "Check four conditions"], ["固定試驗次數 n", "每次只有成功／失敗", "p 固定；各次獨立"], ["fixed number n", "success/failure only", "constant p; independent trials"], "X ~ B(n,p)", "mint"),
                gnSection(["概率、平均、離散程度", "Probability, mean, spread"], ["組合數決定成功出現在哪幾次", "方差不是標準差"], ["the combination counts placements of successes", "variance is not standard deviation"], "P(X=r)=ⁿCᵣpʳ(1−p)ⁿ⁻ʳ; μ=np; σ²=np(1−p)", "pink"),
            ], { type: "distribution", labels: ["0", "np", "n"] }, ["題目問至少 r：通常用 1−P(X≤r−1)。", "For at least r, usually use 1−P(X≤r−1)."]),
            gnPage(["Normal distribution｜標準化", "Normal distribution — standardise"], "worked", [
                gnSection(["把任何 N(μ,σ²) 轉成 Z", "Convert N(μ,σ²) to Z"], ["先畫鐘形圖並塗區域", "標準差是 σ，不是 σ²"], ["sketch and shade the required region", "use σ, not σ²"], "Z=(X−μ)/σ", "blue"),
                gnSection(["反求臨界值", "Finding a cutoff"], ["先從概率找 z 值", "再用 x=μ+zσ 轉回原單位"], ["find z from the probability", "then return with x=μ+zσ"], "P(X≤x)=0.90 ⇒ z≈1.282", "yellow"),
            ], { type: "distribution", labels: ["μ−σ", "μ", "μ+σ"] }, ["圖上的陰影方向可抓到大部分 calculator 尾端錯誤。", "The shaded sketch catches most tail-direction errors."]),
            gnPage(["假設檢驗｜證據有多極端？", "Hypothesis testing — how extreme?"], "checklist", [
                gnSection(["六步", "Six steps"], ["寫 H₀、H₁ 與顯著水平", "選統計量及其 H₀ 分佈", "算 p-value，與 α 比較"], ["state H₀, H₁, and significance", "choose statistic and null distribution", "calculate p-value and compare with α"], "p≤α ⇒ reject H₀", "yellow"),
                gnSection(["結論語言", "Conclusion wording"], ["說『有足夠證據支持 H₁』", "不要說『證明 H₀ 錯』"], ["say ‘sufficient evidence supports H₁’", "do not say ‘H₀ is proved false’"], "decision ≠ certainty", "pink"),
            ], { type: "checklist", labels: ["H₀", "p-value", "context"] }, ["一尾或兩尾由 H₁ 決定，不由數據長相決定。", "H₁ determines one- or two-tailed, not the data shape."]),
            gnPage(["相關、回歸與不能亂講因果", "Correlation, regression, and causation"], "map", [
                gnSection(["散點圖先看", "Read the scatter first"], ["方向、強度、形狀、離群值", "r 只量度線性相關"], ["direction, strength, form, outliers", "r measures linear association only"], "−1≤r≤1", "mint"),
                gnSection(["回歸線", "Regression line"], ["ŷ=a+bx 用來預測 y", "只在數據範圍內內插較可信"], ["ŷ=a+bx predicts y", "interpolation is safer than extrapolation"], "residual = observed − predicted", "blue"),
            ], { type: "scatter", labels: ["trend", "outlier", "residual"] }, ["相關不代表因果：可能有 lurking variable。", "Correlation is not causation; a lurking variable may explain both."]),
        ],
    },
    {
        id: "mechanics",
        subject: "physics",
        favorite: true,
        shared: false,
        preview: "MECHANICS",
        title: gnBi("力學與動量", "Mechanics & Momentum"),
        updated: gnBi("7月18日 下午9:06", "18 Jul, 9:06 PM"),
        date: gnBi("2026年7月18日", "18 JUL 2026"),
        pages: [
            gnPage(["受力圖：只畫作用在物體上的力", "Free-body diagrams"], "map", [
                gnSection(["斜面分解", "Resolve on a slope"], ["平行斜面：mg sinθ", "垂直斜面：mg cosθ", "N 不一定等於 mg"], ["parallel: mg sinθ", "perpendicular: mg cosθ", "N is not always mg"], "ΣF∥=ma;  ΣF⟂=0", "violet"),
                gnSection(["摩擦力", "Friction"], ["方向反抗相對運動或其趨勢", "極限摩擦 F=μN 只在臨界時用"], ["opposes relative motion or its tendency", "F=μN only at limiting friction"], "F≤μN", "yellow"),
            ], { type: "force", labels: ["N", "mg", "friction"] }, ["先選正方向，再寫每個力的正負；不要靠直覺改號。", "Choose positive direction before assigning signs."]),
            gnPage(["SUVAT｜只適用於等加速度", "SUVAT — constant acceleration only"], "split", [
                gnSection(["五個量", "Five quantities"], ["s 位移、u 初速、v 末速", "a 加速度、t 時間"], ["s displacement, u initial speed, v final speed", "a acceleration, t time"], "v=u+at;  s=ut+½at²", "blue"),
                gnSection(["選公式技巧", "Choosing an equation"], ["圈出已知量與所求量", "選一條不含未知干擾量的公式"], ["circle knowns and the target", "choose an equation excluding the unwanted unknown"], "v²=u²+2as", "mint"),
            ], { type: "motion", labels: ["u", "a", "v"] }, ["位移可為負；distance 與 displacement 不可混用。", "Displacement can be negative; it is not distance."]),
            gnPage(["衝量與動量守恆", "Impulse and momentum"], "worked", [
                gnSection(["系統觀點", "System view"], ["外力衝量可忽略 ⇒ 總動量守恆", "碰撞前後分開寫，再選正方向"], ["negligible external impulse ⇒ momentum conserved", "write before/after and choose a positive direction"], "m₁u₁+m₂u₂=m₁v₁+m₂v₂", "yellow"),
                gnSection(["力—時間圖", "Force–time graph"], ["曲線下的面積就是衝量", "衝量等於動量改變"], ["area under the graph is impulse", "impulse equals change in momentum"], "J=∫Fdt=Δp", "pink"),
            ], { type: "collision", labels: ["before", "impact", "after"] }, ["動能只在彈性碰撞守恆；動量在封閉系統都守恆。", "Kinetic energy is conserved only in elastic collisions."]),
            gnPage(["功、能量、功率", "Work, energy, power"], "flow", [
                gnSection(["能量帳本", "Energy bookkeeping"], ["先定 system boundary", "損失的機械能通常轉成熱或聲"], ["define the system boundary", "lost mechanical energy becomes heat or sound"], "W=Fs cosθ;  Ek=½mv²;  Ep=mgh", "mint"),
                gnSection(["功率", "Power"], ["功率是能量轉移速率", "恆速且力同方向時 P=Fv"], ["power is the rate of energy transfer", "at constant speed along force, P=Fv"], "P=W/t=Fv", "violet"),
            ], { type: "energy", labels: ["Ep", "Ek", "thermal"] }, ["每項都寫單位 J；功率單位 W = J s⁻¹。", "Use J for energy and W = J s⁻¹ for power."]),
            gnPage(["拋體運動：水平與鉛直分開", "Projectiles: split horizontal and vertical"], "map", [
                gnSection(["初速度分量", "Initial components"], ["uₓ=u cosθ；uᵧ=u sinθ", "忽略空氣阻力時 aₓ=0、aᵧ=−g"], ["uₓ=u cosθ; uᵧ=u sinθ", "without drag, aₓ=0 and aᵧ=−g"], "x=u cosθ·t", "blue"),
                gnSection(["同一個時間 t", "One shared time"], ["先用鉛直運動求 t", "再把 t 放入水平位移"], ["find t from vertical motion", "use the same t horizontally"], "y=u sinθ·t−½gt²", "yellow"),
            ], { type: "projectile", labels: ["u cosθ", "u sinθ", "g"] }, ["最高點只有 vᵧ=0；水平速度仍然存在。", "At the top only vᵧ=0; horizontal velocity remains."]),
        ],
    },
    {
        id: "waves",
        subject: "physics",
        favorite: false,
        shared: true,
        preview: "WAVES",
        title: gnBi("波與繞射", "Waves & Diffraction"),
        updated: gnBi("7月13日 下午12:13", "13 Jul, 12:13 PM"),
        date: gnBi("2026年7月13日", "13 JUL 2026"),
        pages: [
            gnPage(["波的語言", "The language of waves"], "split", [
                gnSection(["一條式連起三個量", "One relationship"], ["頻率由波源決定", "波速由介質決定；換介質時頻率不變"], ["frequency is fixed by the source", "speed depends on medium; frequency stays constant across a boundary"], "v=fλ", "violet"),
                gnSection(["相位差", "Phase difference"], ["相差一個波長 = 2π rad", "同相加強，反相抵消"], ["one wavelength corresponds to 2π rad", "in phase reinforces; antiphase cancels"], "Δφ=2πΔx/λ", "blue"),
            ], { type: "wave", labels: ["A", "λ", "T"] }, ["振幅影響能量，不改變同一介質中的波速。", "Amplitude affects energy, not wave speed in one medium."]),
            gnPage(["疊加與干涉", "Superposition and interference"], "map", [
                gnSection(["路程差", "Path difference"], ["相長：nλ", "相消：(n+½)λ"], ["constructive: nλ", "destructive: (n+½)λ"], "Δx = |S₁P−S₂P|", "yellow"),
                gnSection(["相干波源", "Coherent sources"], ["頻率相同且相位差固定", "強度圖樣穩定才看得到條紋"], ["same frequency and fixed phase difference", "stable phase gives a stable fringe pattern"], "Imax ∝ (A₁+A₂)²", "pink"),
            ], { type: "interference", labels: ["S₁", "S₂", "P"] }, ["先判斷題目給的是 phase difference 還是 path difference。", "Separate phase difference from path difference."]),
            gnPage(["單縫繞射", "Single-slit diffraction"], "worked", [
                gnSection(["最小值條件", "Minima condition"], ["a 是縫寬，不是屏幕距離", "中央亮紋寬度約為其他亮紋兩倍"], ["a is slit width, not screen distance", "the central maximum is about twice as wide"], "a sinθ=nλ,  n=1,2,3…", "blue"),
                gnSection(["圖樣怎樣變？", "How the pattern changes"], ["λ 增大 ⇒ 展開", "a 減小 ⇒ 展開"], ["larger λ ⇒ wider pattern", "smaller a ⇒ wider pattern"], "small angle: y≈nλD/a", "yellow"),
            ], { type: "diffraction", labels: ["slit a", "θ", "screen"] }, ["最明顯的繞射：孔徑尺寸和 λ 同量級。", "Diffraction is strongest when aperture and λ are comparable."]),
            gnPage(["折射與全內反射", "Refraction and total internal reflection"], "flow", [
                gnSection(["折射率", "Refractive index"], ["進入較慢介質時向法線偏", "頻率不變，速度與波長一起改"], ["slower medium bends toward the normal", "frequency stays; speed and wavelength change together"], "n=c/v;  n₁sinθ₁=n₂sinθ₂", "mint"),
                gnSection(["臨界角", "Critical angle"], ["只由較密介質射向較疏介質", "入射角大於 c 才全內反射"], ["only from higher n to lower n", "TIR occurs when incidence exceeds c"], "sin c = n₂/n₁", "violet"),
            ], { type: "refraction", labels: ["normal", "θ₁", "θ₂"] }, ["所有角度都從法線量，不是從界面量。", "Measure every angle from the normal."]),
            gnPage(["駐波與共振", "Standing waves and resonance"], "checklist", [
                gnSection(["駐波特徵", "Standing-wave features"], ["節點振幅為 0；腹點振幅最大", "相鄰節點距離 = λ/2"], ["nodes have zero amplitude; antinodes maximum", "adjacent nodes are λ/2 apart"], "string/open pipe: L=nλ/2", "yellow"),
                gnSection(["一端封閉氣柱", "One-end-closed pipe"], ["封閉端是位移節點", "只出現奇次諧波"], ["closed end is a displacement node", "only odd harmonics occur"], "L=(2n−1)λ/4", "blue"),
            ], { type: "standing", labels: ["node", "antinode", "node"] }, ["先畫邊界條件，再數四分之一波長。", "Draw boundary conditions before counting quarter wavelengths."]),
        ],
    },
    {
        id: "equilibrium",
        subject: "chemistry",
        favorite: true,
        shared: false,
        preview: "EQUILIBRIUM",
        title: gnBi("化學平衡與酸鹼", "Equilibrium & Acids"),
        updated: gnBi("7月9日 下午6:32", "9 Jul, 6:32 PM"),
        date: gnBi("2026年7月9日", "9 JUL 2026"),
        pages: [
            gnPage(["動態平衡與 Kc", "Dynamic equilibrium and Kc"], "split", [
                gnSection(["平衡不是停止", "Equilibrium is not stopped"], ["正逆反應仍進行，但速率相等", "濃度保持不變，不代表相等"], ["forward and reverse reactions continue at equal rates", "concentrations stay constant, not necessarily equal"], "rateforward = ratereverse", "mint"),
                gnSection(["寫 Kc", "Writing Kc"], ["次方來自化學計量係數", "純固體、純液體不寫入"], ["powers come from stoichiometric coefficients", "omit pure solids and liquids"], "aA+bB⇌cC+dD; Kc=[C]ᶜ[D]ᵈ/[A]ᵃ[B]ᵇ", "yellow"),
            ], { type: "equilibrium", labels: ["forward", "equal rates", "reverse"] }, ["同一反應只有溫度改變才會改變 Kc。", "Only temperature changes Kc for a fixed reaction."]),
            gnPage(["Le Châtelier：系統反抗改變", "Le Châtelier — opposing change"], "map", [
                gnSection(["濃度與壓力", "Concentration and pressure"], ["加反應物 ⇒ 向消耗它的方向", "加壓 ⇒ 向氣體摩爾數較少一側"], ["add reactant ⇒ shift to consume it", "higher pressure ⇒ fewer gas moles"], "position changes; Kc unchanged", "blue"),
                gnSection(["溫度", "Temperature"], ["把熱視為反應物或生成物", "升溫偏向吸熱方向，而且 Kc 改變"], ["treat heat as reactant or product", "higher T favours endothermic direction and changes Kc"], "exothermic: ΔH<0", "pink"),
            ], { type: "balance", labels: ["stress", "shift", "new equilibrium"] }, ["催化劑只加快到達平衡；不改變位置或 Kc。", "A catalyst changes time to equilibrium, not position or Kc."]),
            gnPage(["pH 計算｜先判斷強弱", "pH — decide strong or weak first"], "worked", [
                gnSection(["強酸例題", "Strong-acid example"], ["0.0020 mol dm⁻³ HCl 完全解離", "[H⁺]=2.0×10⁻³"], ["0.0020 mol dm⁻³ HCl fully dissociates", "[H⁺]=2.0×10⁻³"], "pH=−log(2.0×10⁻³)=2.70", "yellow"),
                gnSection(["25°C 水的關係", "Water at 25°C"], ["pH+pOH=14.00", "稀釋後 pH 靠近 7，但不會跨過 7"], ["pH+pOH=14.00", "dilution moves pH toward 7 without crossing it"], "Kw=[H⁺][OH⁻]=1.0×10⁻¹⁴", "mint"),
            ], { type: "ph", labels: ["acid", "7", "alkali"] }, ["濃度單位要先化成 mol dm⁻³。", "Convert concentration to mol dm⁻³ before using logs."]),
            gnPage(["滴定曲線怎樣讀", "Reading titration curves"], "flow", [
                gnSection(["先認四個區域", "Four regions"], ["初始 pH、緩衝區、當量點、過量滴定劑", "半當量點：pH=pKa（弱酸）"], ["initial pH, buffer, equivalence, excess titrant", "half-equivalence: pH=pKa for a weak acid"], "equivalence ≠ always pH 7", "violet"),
                gnSection(["指示劑選擇", "Choosing an indicator"], ["變色範圍要落在陡直區", "不是挑 pH 最接近 7 的指示劑"], ["transition range must lie inside the steep section", "do not simply choose one nearest pH 7"], "indicator range ⊂ vertical jump", "yellow"),
            ], { type: "titration", labels: ["buffer", "equivalence", "excess"] }, ["先標坐標：x 是加入體積，y 是 pH。", "Label axes first: volume added versus pH."]),
            gnPage(["Buffer｜少量酸鹼來了也頂住", "Buffers resist small acid/base additions"], "checklist", [
                gnSection(["組成", "Composition"], ["弱酸 HA + 其共軛鹼 A⁻", "加 H⁺ 時 A⁻ 消耗它；加 OH⁻ 時 HA 消耗它"], ["weak acid HA plus conjugate base A⁻", "A⁻ removes H⁺; HA removes OH⁻"], "pH=pKa+log([A⁻]/[HA])", "blue"),
                gnSection(["容量與限制", "Capacity and limits"], ["兩者濃度越高，buffer capacity 越大", "加入太多酸鹼仍會失效"], ["higher component concentrations give more capacity", "too much acid/base overwhelms the buffer"], "best near pH≈pKa", "mint"),
            ], { type: "balance", labels: ["HA", "H⁺/OH⁻", "A⁻"] }, ["稀釋理想 buffer 時比例近乎不變，所以 pH 近乎不變。", "Dilution keeps the ratio, so ideal buffer pH changes little."]),
        ],
    },
    {
        id: "organic",
        subject: "chemistry",
        favorite: false,
        shared: true,
        preview: "ORGANIC",
        title: gnBi("有機反應路線", "Organic Reaction Routes"),
        updated: gnBi("7月4日 下午3:18", "4 Jul, 3:18 PM"),
        date: gnBi("2026年7月4日", "4 JUL 2026"),
        pages: [
            gnPage(["官能團先認清，再選反應", "Functional groups first"], "map", [
                gnSection(["碳碳鍵路線", "Carbon–carbon routes"], ["alkane → haloalkane：free-radical substitution", "alkene → alcohol：hydration"], ["alkane → haloalkane: free-radical substitution", "alkene → alcohol: hydration"], "C=C  →  C−C", "mint"),
                gnSection(["含氧官能團", "Oxygen groups"], ["primary alcohol 可氧化成 aldehyde，再成 acid", "secondary alcohol 氧化成 ketone"], ["primary alcohol oxidises to aldehyde, then acid", "secondary alcohol oxidises to ketone"], "1° alcohol → aldehyde → carboxylic acid", "yellow"),
            ], { type: "reaction", labels: ["functional group", "reagent", "product"] }, ["箭嘴上寫 reagent；箭嘴下寫 condition。", "Put reagent above the arrow and conditions below."]),
            gnPage(["機理：curly arrow 從電子出發", "Mechanisms — arrows start at electrons"], "worked", [
                gnSection(["親電加成", "Electrophilic addition"], ["π 鍵電子攻擊 electrophile", "中間體再被 nucleophile 攻擊"], ["π electrons attack the electrophile", "the intermediate is attacked by a nucleophile"], "alkene + HBr → bromoalkane", "pink"),
                gnSection(["標記電荷", "Show charges"], ["所有 lone pair、δ⁺/δ⁻、formal charge 都畫", "箭嘴頭指向新鍵或接受電子的原子"], ["draw lone pairs, δ⁺/δ⁻, and formal charges", "arrowhead points to the new bond or electron receiver"], "electron pair: source ↷ destination", "violet"),
            ], { type: "mechanism", labels: ["π electrons", "carbocation", "Br⁻"] }, ["半箭嘴代表單電子；一般 ionic mechanism 用全箭嘴。", "Half-headed arrows are for single electrons; ionic mechanisms use full arrows."]),
            gnPage(["氧化、還原與條件", "Oxidation, reduction, and conditions"], "split", [
                gnSection(["控制 aldehyde 或 acid", "Stop at aldehyde or continue"], ["蒸餾：aldehyde 生成後移走", "回流＋過量 oxidant：到 carboxylic acid"], ["distil aldehyde as it forms", "reflux with excess oxidant to the acid"], "K₂Cr₂O₇/H⁺: orange → green", "yellow"),
                gnSection(["還原", "Reduction"], ["NaBH₄ 還原 aldehyde/ketone", "H₂/Ni 可還原 C=C"], ["NaBH₄ reduces aldehydes/ketones", "H₂/Ni reduces C=C"], "C=O + 2[H] → CH−OH", "blue"),
            ], { type: "reaction", labels: ["distil", "reflux", "reduce"] }, ["『heat』不夠：要寫 reflux / distillation 及試劑。", "‘Heat’ is not enough: state reflux/distillation and reagent."]),
            gnPage(["光譜拼圖：每種證據答一件事", "Spectroscopy as a puzzle"], "flow", [
                gnSection(["IR", "IR"], ["寬闊 O−H 約 2500–3300 cm⁻¹（acid）", "強 C=O 約 1700 cm⁻¹"], ["broad O−H around 2500–3300 cm⁻¹ for acids", "strong C=O near 1700 cm⁻¹"], "bond type ← absorption position", "mint"),
                gnSection(["¹H NMR + mass spectrum", "¹H NMR + mass spectrum"], ["峰組數＝不同 proton environment", "integration 給相對 H 數；M⁺ 給 Mr"], ["signal count gives proton environments", "integration gives H ratio; M⁺ gives Mr"], "structure = formula + IR + NMR", "pink"),
            ], { type: "spectrum", labels: ["chemical shift", "integration", "splitting"] }, ["先寫 molecular formula，再檢查總 H 數與不飽和度。", "Start with molecular formula; check H total and unsaturation."]),
            gnPage(["合成題｜由目標倒推", "Synthesis planning — work backwards"], "checklist", [
                gnSection(["Retrosynthesis", "Retrosynthesis"], ["圈出目標官能團，問它可由什麼前體生成", "再把逆向步驟翻回正向路線"], ["circle the target group and identify a precursor", "then reverse the steps into a forward route"], "target ⇐ precursor ⇐ starting material", "blue"),
                gnSection(["每一步要齊", "Every step needs"], ["試劑、條件、主要產物", "必要時寫 purification 或 observation"], ["reagent, conditions, major product", "include purification or observation when required"], "reagent + condition + transformation", "yellow"),
            ], { type: "reaction", labels: ["start", "intermediate", "target"] }, ["最後逐個碳原子數一次，避免無意中增碳或減碳。", "Count carbons at every step to catch accidental chain changes."]),
        ],
    },
];

let goodnotesFilter = "all";
let goodnotesQuery = "";
let goodnotesKind = "all";
let goodnotesLayout = "grid";
let goodnotesCurrentDocument = "calculus";
let goodnotesSortAlphabetically = false;
let goodnotesToastTimer = null;
let goodnotesMenuDocument = null;
let goodnotesDraftSequence = 0;
let goodnotesCurrentPage = 1;
let goodnotesPageCount = 5;

function goodnotesText(copy) {
    return copy?.[language()] || copy?.en || copy?.zh || "";
}

const goodnotesLibraryTitleCopy = {
    all: { zh: "文件", en: "Documents" },
    favorites: { zh: "最愛", en: "Favorites" },
    shared: { zh: "分享", en: "Shared" },
    marketplace: { zh: "市集", en: "Marketplace" },
    math: { zh: "數學", en: "Mathematics" },
    physics: { zh: "物理", en: "Physics" },
    chemistry: { zh: "化學", en: "Chemistry" },
};

function updateGoodnotesLibraryTitle() {
    const copy = goodnotesLibraryTitleCopy[goodnotesFilter] || goodnotesLibraryTitleCopy.all;
    goodnotesLibraryTitles.forEach((title) => title.replaceChildren(localizedSpan(copy)));
}

function updateGoodnotesPageStatus() {
    if (goodnotesPageStatusZh) goodnotesPageStatusZh.textContent = `第${goodnotesCurrentPage}頁，共${goodnotesPageCount}頁`;
    if (goodnotesPageStatusEn) goodnotesPageStatusEn.textContent = `Page ${goodnotesCurrentPage} of ${goodnotesPageCount}`;
    const footer = goodnotesPaper?.querySelector("footer");
    if (footer) footer.textContent = String(goodnotesCurrentPage);
}

function createGoodnotesPageButton(pageNumber, documentItem = goodnotesDocuments.find((item) => item.id === goodnotesCurrentDocument)) {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.gnPageNumber = String(pageNumber);
    button.dataset.subject = documentItem?.subject || "math";
    const page = goodnotesPageData(documentItem, pageNumber);
    button.setAttribute("aria-label", `${language() === "zh" ? "第" : "Page "}${pageNumber}${language() === "zh" ? "頁" : ""}: ${goodnotesText(page?.title)}`);
    button.classList.toggle("is-active", pageNumber === goodnotesCurrentPage);

    const preview = document.createElement("span");
    const previewNames = ["one", "two", "three", "four", "five"];
    preview.className = `gn-mini-paper is-${previewNames[(pageNumber - 1) % previewNames.length]}`;
    const miniTitle = document.createElement("b");
    miniTitle.textContent = goodnotesText(page?.title);
    preview.append(miniTitle, document.createElement("i"), document.createElement("i"), document.createElement("i"));

    const number = document.createElement("small");
    number.textContent = String(pageNumber);
    button.append(preview, number);
    bindGoodnotesPageButton(button);
    return button;
}

function syncGoodnotesPageGrid(documentItem) {
    if (!goodnotesPageGrid) return;
    const requestedCount = Array.isArray(documentItem?.pages)
        ? documentItem.pages.length
        : Number(documentItem?.pages ?? 5);
    goodnotesPageCount = Number.isFinite(requestedCount) ? Math.max(1, Math.floor(requestedCount)) : 5;
    goodnotesCurrentPage = Math.min(Math.max(1, goodnotesCurrentPage), goodnotesPageCount);
    goodnotesPageGrid.querySelectorAll("[data-gn-page-number]").forEach((button) => button.remove());
    const addButton = goodnotesPageGrid.querySelector("[data-gn-add-page]");
    const pages = Array.from({ length: goodnotesPageCount }, (_, index) => createGoodnotesPageButton(index + 1, documentItem));
    pages.forEach((button) => goodnotesPageGrid.insertBefore(button, addButton));
    updateGoodnotesPageStatus();
}

function showGoodnotesToast(copy) {
    if (!goodnotesToast) return;
    if (goodnotesToastTimer) window.clearTimeout(goodnotesToastTimer);
    goodnotesToast.textContent = goodnotesText(copy);
    goodnotesToast.hidden = false;
    goodnotesToastTimer = window.setTimeout(() => {
        goodnotesToast.hidden = true;
    }, reducedMotion.matches ? 800 : 2200);
}

function createGoodnotesCard(documentItem) {
    const card = document.createElement("article");
    card.className = "gn-document-card";
    card.dataset.gnDocumentCard = documentItem.id;
    card.dataset.subject = documentItem.subject;
    card.dataset.shared = String(documentItem.shared);
    card.dataset.searchTarget = `${documentItem.title.zh} ${documentItem.title.en} ${documentItem.preview} ${documentItem.subject}`.toLocaleLowerCase();

    const openButton = document.createElement("button");
    openButton.type = "button";
    openButton.className = "gn-document-open";
    openButton.dataset.gnDocument = documentItem.id;
    openButton.setAttribute("aria-label", goodnotesText(documentItem.title));

    const preview = document.createElement("span");
    preview.className = `gn-note-preview is-${documentItem.subject}`;
    preview.setAttribute("aria-hidden", "true");
    const previewTitle = document.createElement("b");
    previewTitle.textContent = documentItem.preview;
    const previewPage = goodnotesPageData(documentItem, 1);
    const previewLines = document.createElement("span");
    previewLines.className = "gn-preview-scribbles";
    previewLines.append(document.createElement("i"), document.createElement("i"), document.createElement("i"));
    const previewFormula = document.createElement("em");
    previewFormula.textContent = previewPage?.sections?.[0]?.formula || "";
    preview.append(previewTitle, previewLines, previewFormula);

    const title = document.createElement("strong");
    title.append(localizedSpan(documentItem.title));
    const updated = document.createElement("small");
    updated.append(localizedSpan(documentItem.updated));
    openButton.append(preview, title, updated);

    const favorite = document.createElement("button");
    favorite.type = "button";
    favorite.className = "gn-favorite";
    favorite.classList.toggle("is-active", documentItem.favorite);
    favorite.dataset.gnFavorite = documentItem.id;
    favorite.setAttribute("aria-pressed", String(documentItem.favorite));
    favorite.setAttribute("aria-label", documentItem.favorite ? "Remove from favorites" : "Add to favorites");
    favorite.innerHTML = '<svg class="gn-icon" aria-hidden="true"><use href="#gn-star-icon"></use></svg>';
    card.append(openButton, favorite);
    return card;
}

function goodnotesMatchesFilter(documentItem) {
    if (goodnotesFilter === "favorites") return documentItem.favorite;
    if (goodnotesFilter === "shared") return documentItem.shared;
    if (["math", "physics", "chemistry"].includes(goodnotesFilter)) {
        return documentItem.subject === goodnotesFilter;
    }
    if (goodnotesFilter === "marketplace") return false;
    return true;
}

function applyGoodnotesFilter() {
    const cards = [...(goodnotesGrid?.querySelectorAll("[data-gn-document-card]") || [])];
    let visibleCount = 0;
    cards.forEach((card) => {
        const documentItem = goodnotesDocuments.find((item) => item.id === card.dataset.gnDocumentCard);
        const visible = goodnotesKind !== "folders" && Boolean(documentItem && goodnotesMatchesFilter(documentItem));
        card.hidden = !visible;
        if (visible) visibleCount += 1;
    });
    goodnotesFolderButtons.forEach((button) => {
        button.hidden = goodnotesKind === "documents" || goodnotesFilter !== "all";
    });
    const visibleFolders = goodnotesFolderButtons.filter((button) => !button.hidden).length;
    if (goodnotesEmpty) {
        const empty = visibleCount + visibleFolders === 0;
        const copy = goodnotesFilter === "marketplace"
            ? { zh: "市集內容未在這個示範中連線", en: "Marketplace content is not connected in this demo" }
            : { zh: "沒有符合的筆記", en: "No matching notes" };
        goodnotesEmpty.replaceChildren(localizedSpan(copy));
        goodnotesEmpty.hidden = !empty;
    }
}

function sortedGoodnotesDocuments() {
    const sorted = [...goodnotesDocuments];
    if (goodnotesSortAlphabetically) {
        sorted.sort((a, b) => goodnotesText(a.title).localeCompare(goodnotesText(b.title), language() === "zh" ? "zh-Hant" : "en"));
    }
    return sorted;
}

const goodnotesSketches = {
    curve: '<path d="M24 132H282M42 146V18"/><path class="gn-sketch-soft" d="M45 122C82 120 96 106 119 76s55-62 143-53"/><path d="M76 116 245 38"/><circle cx="154" cy="80" r="4"/>',
    area: '<path d="M25 132H282M42 146V18"/><path class="gn-sketch-soft" d="M45 124C82 110 102 54 154 48s77 49 116 70"/><path class="gn-sketch-fill" d="M72 132V100C96 70 120 50 154 48c35-2 60 25 82 52v32Z"/><path d="M72 132V100M236 132V100"/>',
    box: '<rect x="79" y="42" width="142" height="78" rx="2"/><path d="M79 128c38 8 104 8 142 0M67 43c-8 20-8 55 0 77M88 31c33-8 91-8 124 0"/><path d="m194 99 18-18m-4 3 4-3-1 5"/>',
    circle: '<circle cx="150" cy="80" r="60"/><path d="M62 80h176M150 8v144M150 80l43-43M186 37a60 60 0 0 1 24 43"/><path class="gn-sketch-soft" d="m188 33 9 2-3 9"/><circle cx="193" cy="37" r="4"/>',
    identity: '<path d="M150 22 57 132h186Z"/><path d="M150 22v110M57 132l93-52 93 52"/><circle cx="150" cy="80" r="8"/><path class="gn-sketch-soft" d="m102 63 21 10m54 0 21-10m-31 45 18 10"/>',
    wave: '<path d="M18 83h270M28 34v98"/><path class="gn-sketch-soft" d="M28 82c22-56 43-56 65 0s43 56 65 0 43-56 65 0 43 56 65 0"/><path d="M94 34v96M223 34v96M96 26h124m-5-4 5 4-5 4"/>',
    triangle: '<path d="M49 128 244 128 178 33Z"/><path d="m49 128 25-1-1-24M174 35l2 19 19-7"/><path class="gn-sketch-soft" d="M85 128a36 36 0 0 1-24-29M220 128a34 34 0 0 0 13-27"/>',
    tree: '<path d="M36 80h45M81 80l62-46M81 80l62 46M143 34l75-22M143 34l75 40M143 126l75-40M143 126l75 22"/><circle cx="81" cy="80" r="4"/><circle cx="143" cy="34" r="4"/><circle cx="143" cy="126" r="4"/><path class="gn-sketch-soft" d="m203 10 15 2-9 12m-6 62 15 0-8 12"/>',
    distribution: '<path d="M22 132H283M43 144V24"/><path class="gn-sketch-soft" d="M45 130c35-1 48-5 62-30 14-28 20-63 48-64s35 35 49 64c13 25 29 29 64 30"/><path class="gn-sketch-fill" d="M155 36c29 0 35 35 49 64 13 25 29 29 64 30H155Z"/><path d="M155 36v96"/>',
    scatter: '<path d="M28 132H280M43 145V20"/><path class="gn-sketch-soft" d="m55 120 205-84"/><g class="gn-sketch-dots"><circle cx="64" cy="115" r="4"/><circle cx="87" cy="99" r="4"/><circle cx="109" cy="105" r="4"/><circle cx="134" cy="77" r="4"/><circle cx="158" cy="70" r="4"/><circle cx="183" cy="66" r="4"/><circle cx="205" cy="46" r="4"/><circle cx="235" cy="38" r="4"/><circle cx="232" cy="96" r="5"/></g>',
    force: '<path d="M42 129 237 129 170 55Z"/><rect x="128" y="67" width="54" height="40" rx="4" transform="rotate(-31 155 87)"/><path d="M155 86v-62m0 0-6 11m6-11 6 11M155 86v64m0 0-6-11m6 11 6-11M155 86l49-31m0 0-12 1m12-1-5 11M155 86l-48 31m0 0 12-1m-12 1 5-11"/>',
    motion: '<path d="M28 121h250M53 121c41 0 62-9 92-32 34-27 66-45 116-45"/><path d="m252 38 9 6-11 4M62 105 43 121l19 16"/><circle cx="103" cy="107" r="6"/><circle cx="191" cy="62" r="6"/>',
    collision: '<rect x="34" y="62" width="62" height="42" rx="8"/><rect x="208" y="62" width="62" height="42" rx="8"/><path d="M105 83h46m-9-7 9 7-9 7M199 83h-42m9-7-9 7 9 7"/><path class="gn-sketch-soft" d="m145 46 9 17 15-12-4 21 22 2-19 10 15 15-22-4-1 22-10-19-15 15 5-22-22-1 19-11-14-16 21 5Z"/>',
    energy: '<path d="M31 126h245M53 126l57-91 55 91 56-59 38 59"/><circle cx="110" cy="35" r="7"/><path d="M103 52 83 83m74 30 38-36"/><path class="gn-sketch-soft" d="m232 41 13 15 13-15m-13 15v49"/>',
    projectile: '<path d="M23 132h264M43 144V26"/><path class="gn-sketch-soft" d="M43 126C92 19 176 19 260 126"/><path d="M43 126 88 62m-45 64 65 0M43 126l45-64m0 0-13 5m13-5-1 14M132 45v48m0 0-6-11m6 11 6-11"/>',
    interference: '<circle cx="72" cy="80" r="7"/><circle cx="72" cy="80" r="24"/><circle cx="72" cy="80" r="43"/><circle cx="72" cy="80" r="62"/><circle cx="228" cy="80" r="7"/><circle cx="228" cy="80" r="24"/><circle cx="228" cy="80" r="43"/><circle cx="228" cy="80" r="62"/><path class="gn-sketch-soft" d="M150 18v124"/>',
    diffraction: '<path d="M68 15v53m0 25v53M70 68h36M70 93h36M106 68v25"/><path class="gn-sketch-soft" d="M107 80c35-5 50-18 62-42m-62 42c42 0 63 0 92 0m-92 0c35 5 50 18 62 42"/><path d="M238 16v128M226 50h24M217 80h42M226 110h24"/>',
    refraction: '<path d="M18 82h270M150 12v136"/><path class="gn-sketch-fill" d="M18 82h270v66H18Z"/><path d="m80 24 70 58 43 54M150 82l50-36m-50 36 24 24"/><path class="gn-sketch-soft" d="M123 60a36 36 0 0 1 27-14m0 63a29 29 0 0 0 18-7"/>',
    standing: '<path d="M25 28v104M280 28v104"/><path class="gn-sketch-soft" d="M25 80c31-60 64-60 96 0s64 60 96 0 32-60 63 0M25 80c31 60 64 60 96 0s64-60 96 0 32 60 63 0"/><circle cx="25" cy="80" r="4"/><circle cx="121" cy="80" r="4"/><circle cx="217" cy="80" r="4"/><circle cx="280" cy="80" r="4"/>',
    equilibrium: '<path d="M30 118h240M52 118c35-1 61-38 92-74 31 36 57 73 94 74M52 43c37 2 61 38 92 75 31-36 57-72 94-75"/><path d="M107 77h77m-9-7 9 7-9 7m2 12h-77m9-7-9 7 9 7"/><circle cx="144" cy="80" r="5"/>',
    balance: '<path d="M150 23v107M79 47h142M100 47 60 119h80Zm100 0-40 72h80ZM119 139h62"/><path class="gn-sketch-soft" d="M61 119c17 9 62 9 79 0m20 0c17 9 62 9 79 0"/>',
    ph: '<path d="M24 80h258"/><path class="gn-sketch-fill" d="M24 62h126v36H24Zm126 0h132v36H150Z"/><path d="M150 46v68M60 68v24m45-24v24m90-24v24m45-24v24"/><circle cx="95" cy="80" r="9"/><circle cx="222" cy="80" r="9"/>',
    titration: '<path d="M26 135h255M43 145V18"/><path class="gn-sketch-soft" d="M45 124c47 0 80-3 106-16 18-9 20-58 37-68 16-9 44-11 81-11"/><path d="M171 25v108M137 85h68"/><circle cx="171" cy="76" r="5"/>',
    reaction: '<rect x="20" y="55" width="70" height="50" rx="14"/><rect x="210" y="55" width="70" height="50" rx="14"/><path d="M102 80h95m-12-8 12 8-12 8"/><path class="gn-sketch-soft" d="M118 52h63M128 108h43"/><circle cx="55" cy="80" r="10"/><circle cx="245" cy="80" r="10"/>',
    mechanism: '<path d="M35 98 87 68l52 30 52-30 73 30"/><path d="M86 67c15-42 61-42 69 1m0 0-9-8m9 8 3-11"/><circle cx="87" cy="68" r="5"/><circle cx="191" cy="68" r="5"/><path class="gn-sketch-soft" d="m121 114 28 13 28-13"/>',
    spectrum: '<path d="M23 132H282M42 144V20"/><path d="M65 132V92m24 40V46m17 86V72m39 60V29m18 103V86m41 46V61m29 71V104m24 28V51"/><path class="gn-sketch-soft" d="M52 35c30 12 51 3 76 11s47 2 72-10 43-8 69 5"/>',
    checklist: '<path d="m45 42 10 10 20-24M45 82l10 10 20-24M45 122l10 10 20-24M93 42h154M93 82h132M93 122h146"/><path class="gn-sketch-soft" d="M103 52h94m-94 40h73m-73 40h105"/>',
};

function goodnotesPageData(documentItem, pageNumber = goodnotesCurrentPage) {
    if (Array.isArray(documentItem?.pages) && documentItem.pages.length) {
        return documentItem.pages[Math.min(documentItem.pages.length, Math.max(1, pageNumber)) - 1];
    }
    return {
        title: documentItem?.title,
        layout: "flow",
        sections: documentItem?.blocks || [],
        sketch: { type: "checklist", labels: documentItem?.diagram || [] },
        callout: documentItem?.callout || gnBi("開始書寫。", "Start writing."),
    };
}

function createGoodnotesSketch(sketch = {}) {
    const figure = document.createElement("figure");
    const type = goodnotesSketches[sketch.type] ? sketch.type : "checklist";
    figure.className = "gn-hand-sketch";
    figure.dataset.sketch = type;
    figure.setAttribute("aria-label", (sketch.labels || []).join(" → "));

    const drawing = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    drawing.setAttribute("viewBox", "0 0 300 160");
    drawing.setAttribute("aria-hidden", "true");
    drawing.innerHTML = goodnotesSketches[type];

    const caption = document.createElement("figcaption");
    (sketch.labels || []).forEach((label, index) => {
        const text = document.createElement("span");
        text.textContent = label;
        caption.append(text);
        if (index < sketch.labels.length - 1) {
            const arrow = document.createElement("b");
            arrow.setAttribute("aria-hidden", "true");
            arrow.textContent = "→";
            caption.append(arrow);
        }
    });
    figure.append(drawing, caption);
    return figure;
}

function bindGoodnotesCards(root) {
    root?.querySelectorAll("[data-gn-document]").forEach((button) => {
        button.addEventListener("click", () => openGoodnotesDocument(button.dataset.gnDocument));
    });
    root?.querySelectorAll("[data-gn-favorite]").forEach((button) => {
        button.addEventListener("click", () => {
            const documentItem = goodnotesDocuments.find((item) => item.id === button.dataset.gnFavorite);
            if (!documentItem) return;
            documentItem.favorite = !documentItem.favorite;
            renderGoodnotesDocuments();
            showGoodnotesToast(documentItem.favorite
                ? { zh: "已加入最愛", en: "Added to Favorites" }
                : { zh: "已從最愛移除", en: "Removed from Favorites" });
        });
    });
    root?.querySelectorAll("[data-gn-document-card]").forEach((card) => {
        card.addEventListener("contextmenu", (event) => {
            event.preventDefault();
            openGoodnotesDocumentMenu(card, event.clientX, event.clientY);
        });
    });
}

function closeGoodnotesDocumentMenu() {
    goodnotesDocumentMenu?.setAttribute("hidden", "");
    document.querySelectorAll(".gn-document-card.is-menu-open").forEach((card) => card.classList.remove("is-menu-open"));
    goodnotesMenuDocument = null;
}

function openGoodnotesDocumentMenu(card, clientX, clientY) {
    if (!goodnotesDocumentMenu || !goodnotesLibraryMain) return;
    closeGoodnotesMenus();
    closeGoodnotesDocumentMenu();
    goodnotesMenuDocument = card.dataset.gnDocumentCard;
    card.classList.add("is-menu-open");
    goodnotesDocumentMenu.hidden = false;

    const mainRect = goodnotesLibraryMain.getBoundingClientRect();
    const menuRect = goodnotesDocumentMenu.getBoundingClientRect();
    const requestedLeft = clientX - mainRect.left + goodnotesLibraryMain.scrollLeft;
    const requestedTop = clientY - mainRect.top + goodnotesLibraryMain.scrollTop;
    const maximumLeft = goodnotesLibraryMain.clientWidth - menuRect.width - 8;
    const maximumTop = goodnotesLibraryMain.scrollTop + goodnotesLibraryMain.clientHeight - menuRect.height - 8;
    goodnotesDocumentMenu.style.left = `${Math.max(8, Math.min(requestedLeft, maximumLeft))}px`;
    goodnotesDocumentMenu.style.top = `${Math.max(goodnotesLibraryMain.scrollTop + 8, Math.min(requestedTop, maximumTop))}px`;
}

function renderGoodnotesSearchResults() {
    if (!goodnotesSearchResults) return;
    const matches = sortedGoodnotesDocuments().filter((item) => {
        if (!goodnotesQuery) return true;
        const target = `${item.title.zh} ${item.title.en} ${item.preview} ${item.subject}`.toLocaleLowerCase();
        return target.includes(goodnotesQuery);
    });
    goodnotesSearchResults.replaceChildren(...matches.map(createGoodnotesCard));
    goodnotesSearchResults.classList.toggle("is-list", goodnotesLayout === "list");
    goodnotesSearchScreen?.classList.toggle("has-query", Boolean(goodnotesQuery));
    if (goodnotesSearchEmpty) goodnotesSearchEmpty.hidden = !goodnotesQuery || matches.length > 0;
    bindGoodnotesCards(goodnotesSearchResults);
}

function renderGoodnotesDocuments() {
    if (!goodnotesGrid) return;
    goodnotesGrid.replaceChildren(...sortedGoodnotesDocuments().map(createGoodnotesCard));
    goodnotesItemsGrid?.classList.toggle("is-list", goodnotesLayout === "list");
    bindGoodnotesCards(goodnotesGrid);
    applyGoodnotesFilter();
    renderGoodnotesSearchResults();
}

function renderGoodnotesPage(documentItem) {
    if (!documentItem || !goodnotesNoteContent) return;
    goodnotesCurrentDocument = documentItem.id;
    const page = goodnotesPageData(documentItem);
    if (goodnotesEditorTitle) goodnotesEditorTitle.textContent = goodnotesText(documentItem.title);
    if (goodnotesPageSubject) goodnotesPageSubject.textContent = goodnotesText(goodnotesSubjectCopy[documentItem.subject]);
    if (goodnotesPageTitle) goodnotesPageTitle.textContent = goodnotesText(page.title || documentItem.title);
    if (goodnotesPageDate) goodnotesPageDate.textContent = `${goodnotesText(documentItem.date)} · ${goodnotesCurrentPage}/${goodnotesPageCount}`;
    if (goodnotesPaper) {
        goodnotesPaper.dataset.subject = documentItem.subject;
        goodnotesPaper.dataset.pageLayout = page.layout || "flow";
    }

    const content = document.createDocumentFragment();
    (page.sections || []).forEach((blockCopy, index) => {
        const block = document.createElement("section");
        block.className = "gn-note-block gn-hand-section";
        block.dataset.mark = blockCopy.mark || ["yellow", "blue", "pink", "mint"][index % 4];
        const title = document.createElement("h4");
        title.textContent = goodnotesText(blockCopy.title);
        block.append(title);
        const list = document.createElement("ul");
        const lines = goodnotesText(blockCopy.lines);
        (Array.isArray(lines) ? lines : [lines]).filter(Boolean).forEach((line) => {
            const item = document.createElement("li");
            item.textContent = line;
            list.append(item);
        });
        block.append(list);
        if (blockCopy.formula) {
            const formula = document.createElement("strong");
            formula.className = "gn-formula";
            formula.textContent = blockCopy.formula;
            block.append(formula);
        }
        content.append(block);
    });

    const diagram = createGoodnotesSketch(page.sketch);
    const callout = document.createElement("aside");
    callout.className = "gn-note-callout gn-margin-note";
    const calloutLabel = document.createElement("b");
    calloutLabel.textContent = language() === "zh" ? "記住！" : "remember!";
    const calloutCopy = document.createElement("span");
    calloutCopy.textContent = goodnotesText(page.callout);
    callout.append(calloutLabel, calloutCopy);
    content.append(diagram, callout);
    goodnotesNoteContent.replaceChildren(content);
    updateGoodnotesPageStatus();
}

function closeGoodnotesMenus(exception = null) {
    closeGoodnotesDocumentMenu();
    [goodnotesFilterMenu, goodnotesViewMenu, goodnotesNewMenu].forEach((menu) => {
        if (!menu || menu === exception) return;
        menu.hidden = true;
    });
    document.querySelectorAll("[data-gn-filter-menu-button], [data-gn-view-menu-button], [data-gn-new-menu-button]").forEach((button) => {
        const controlsException =
            (button.hasAttribute("data-gn-filter-menu-button") && exception === goodnotesFilterMenu) ||
            (button.hasAttribute("data-gn-view-menu-button") && exception === goodnotesViewMenu) ||
            (button.hasAttribute("data-gn-new-menu-button") && exception === goodnotesNewMenu);
        button.setAttribute("aria-expanded", String(controlsException && !exception.hidden));
    });
}

function toggleGoodnotesMenu(menu) {
    if (!menu) return;
    const willOpen = menu.hidden;
    closeGoodnotesMenus(menu);
    menu.hidden = !willOpen;
    closeGoodnotesMenus(willOpen ? menu : null);
}

function setGoodnotesSearch(open) {
    if (!goodnotesSearchScreen) return;
    goodnotesSearchScreen.hidden = !open;
    goodnotesLibraryMain?.querySelectorAll(".gn-library-header, .gn-library-toolbar, .gn-items-grid, .gn-empty").forEach((element) => {
        element.inert = open;
        element.setAttribute("aria-hidden", String(open));
    });
    closeGoodnotesMenus();
    if (!open) {
        goodnotesQuery = "";
        if (goodnotesSearch) goodnotesSearch.value = "";
        goodnotesSearchScreen.classList.remove("has-query");
        renderGoodnotesSearchResults();
        return;
    }
    renderGoodnotesSearchResults();
    window.requestAnimationFrame(() => goodnotesSearch?.focus());
}

function setGoodnotesView(view) {
    goodnotesViews.forEach((panel) => setPanelVisibility(panel, panel.dataset.gnView === view));
    goodnotesWindow?.classList.toggle("is-note-open", view === "editor");
    if (view === "library") {
        goodnotesWindow?.classList.remove("is-pages-open", "is-editing");
        if (goodnotesPageStrip) goodnotesPageStrip.hidden = true;
        if (goodnotesEditTools) goodnotesEditTools.hidden = true;
        const modeButton = document.querySelector("[data-gn-mode]");
        modeButton?.setAttribute("aria-pressed", "false");
        modeButton?.querySelector('[data-copy-lang="zh"]')?.replaceChildren("唯讀");
        modeButton?.querySelector('[data-copy-lang="en"]')?.replaceChildren("Read only");
        document.querySelector("[data-gn-page-toggle]")?.setAttribute("aria-pressed", "false");
    }
    closeGoodnotesMenus();
    animatePanel(goodnotesViews.find((panel) => panel.dataset.gnView === view), { y: view === "editor" ? 6 : 3 });
}

function openGoodnotesDocument(documentId) {
    const documentItem = goodnotesDocuments.find((item) => item.id === documentId);
    if (!documentItem) return;
    goodnotesCurrentPage = 1;
    syncGoodnotesPageGrid(documentItem);
    renderGoodnotesPage(documentItem);
    setGoodnotesView("editor");
    announce(`${goodnotesText(documentItem.title)} ${pageCopy[language()].open}`);
}

function setGoodnotesFilter(filter) {
    goodnotesFilter = filter;
    goodnotesFilterButtons.forEach((button) => {
        const active = button.dataset.gnFilter === filter;
        button.classList.toggle("is-active", active);
        button.setAttribute("aria-pressed", String(active));
    });
    updateGoodnotesLibraryTitle();
    if (goodnotesLibraryMain) goodnotesLibraryMain.scrollTop = 0;
    applyGoodnotesFilter();
    closeGoodnotesMenus();
}

goodnotesFilterButtons.forEach((button) => {
    button.addEventListener("click", () => setGoodnotesFilter(button.dataset.gnFilter));
});

goodnotesFolderButtons.forEach((button) => {
    button.addEventListener("click", () => setGoodnotesFilter(button.dataset.gnFolder));
});

goodnotesSearch?.addEventListener("input", () => {
    goodnotesQuery = goodnotesSearch.value.trim().toLocaleLowerCase();
    renderGoodnotesSearchResults();
});

goodnotesLibraryButtons.forEach((button) => {
    button.addEventListener("click", () => {
        setGoodnotesSearch(false);
        setGoodnotesView("library");
    });
});

document.querySelectorAll("[data-gn-search-toggle]").forEach((button) => {
    button.addEventListener("click", () => setGoodnotesSearch(true));
});
document.querySelector("[data-gn-search-back]")?.addEventListener("click", () => setGoodnotesSearch(false));
document.querySelector("[data-gn-search-clear]")?.addEventListener("click", () => {
    if (goodnotesSearch) goodnotesSearch.value = "";
    goodnotesQuery = "";
    renderGoodnotesSearchResults();
    goodnotesSearch?.focus();
});

document.querySelectorAll("[data-gn-search-chip]").forEach((button) => {
    button.addEventListener("click", () => {
        goodnotesQuery = button.dataset.gnSearchChip.toLocaleLowerCase();
        if (goodnotesSearch) goodnotesSearch.value = button.dataset.gnSearchChip;
        renderGoodnotesSearchResults();
    });
});

document.querySelector("[data-gn-clear-recents]")?.addEventListener("click", () => {
    if (goodnotesSearchRecents) goodnotesSearchRecents.hidden = true;
});

document.querySelector("[data-gn-filter-menu-button]")?.addEventListener("click", () => toggleGoodnotesMenu(goodnotesFilterMenu));
document.querySelector("[data-gn-view-menu-button]")?.addEventListener("click", () => toggleGoodnotesMenu(goodnotesViewMenu));
document.querySelector("[data-gn-new-menu-button]")?.addEventListener("click", () => toggleGoodnotesMenu(goodnotesNewMenu));

const goodnotesKindCopy = {
    all: { zh: "全部", en: "All" },
    documents: { zh: "文件", en: "Documents" },
    folders: { zh: "資料夾", en: "Folders" },
};

function updateGoodnotesKindLabel() {
    const label = document.querySelector("[data-gn-kind-label]");
    if (label) label.textContent = goodnotesText(goodnotesKindCopy[goodnotesKind]);
}

document.querySelectorAll("[data-gn-kind]").forEach((button) => {
    button.addEventListener("click", () => {
        goodnotesKind = button.dataset.gnKind;
        document.querySelectorAll("[data-gn-kind]").forEach((item) => {
            const active = item === button;
            item.classList.toggle("is-selected", active);
            item.setAttribute("aria-checked", String(active));
        });
        updateGoodnotesKindLabel();
        applyGoodnotesFilter();
        closeGoodnotesMenus();
    });
});

document.querySelectorAll("[data-gn-layout]").forEach((button) => {
    button.addEventListener("click", () => {
        goodnotesLayout = button.dataset.gnLayout;
        document.querySelectorAll("[data-gn-layout]").forEach((item) => {
            const active = item === button;
            item.classList.toggle("is-selected", active);
            item.setAttribute("aria-checked", String(active));
        });
        goodnotesLayoutIcon?.setAttribute("href", goodnotesLayout === "list" ? "#gn-list-icon" : "#gn-grid-icon");
        renderGoodnotesDocuments();
        closeGoodnotesMenus();
    });
});

goodnotesLibraryMain?.addEventListener("scroll", () => {
    const scrolled = goodnotesLibraryMain.scrollTop > 28;
    goodnotesLibraryMain.classList.toggle("is-scrolled", scrolled);
    if (goodnotesCompactHeader) {
        goodnotesCompactHeader.inert = !scrolled;
        goodnotesCompactHeader.setAttribute("aria-hidden", String(!scrolled));
    }
}, { passive: true });

goodnotesToolButtons.forEach((button) => {
    button.addEventListener("click", () => {
        goodnotesToolButtons.forEach((tool) => {
            const active = tool === button;
            tool.classList.toggle("is-active", active);
            tool.setAttribute("aria-pressed", String(active));
        });
    });
});

document.querySelector("[data-gn-page-toggle]")?.addEventListener("click", (event) => {
    const willOpen = goodnotesPageStrip?.hidden ?? false;
    if (goodnotesPageStrip) goodnotesPageStrip.hidden = !willOpen;
    goodnotesWindow?.classList.toggle("is-pages-open", willOpen);
    event.currentTarget.setAttribute("aria-pressed", String(willOpen));
    if (willOpen) setGoodnotesPageSidebarView("pages");
});

document.querySelector("[data-gn-page-close]")?.addEventListener("click", () => {
    if (goodnotesPageStrip) goodnotesPageStrip.hidden = true;
    goodnotesWindow?.classList.remove("is-pages-open");
    document.querySelector("[data-gn-page-toggle]")?.setAttribute("aria-pressed", "false");
});

function setGoodnotesPageSidebarView(view) {
    const copy = {
        pages: { zh: "頁面", en: "Pages" },
        outline: { zh: "大綱", en: "Outline" },
        transcripts: { zh: "轉錄", en: "Transcripts" },
    }[view] || { zh: "頁面", en: "Pages" };
    document.querySelectorAll("[data-gn-page-view]").forEach((tab) => {
        const active = tab.dataset.gnPageView === view;
        tab.classList.toggle("is-active", active);
        tab.setAttribute("aria-selected", String(active));
    });
    const title = goodnotesPageStrip?.querySelector("header strong");
    if (title) title.replaceChildren(localizedSpan(copy));
    const pagesVisible = view === "pages";
    if (goodnotesPageGrid) goodnotesPageGrid.hidden = !pagesVisible;
    if (goodnotesPageFilter) goodnotesPageFilter.hidden = !pagesVisible;
    if (goodnotesPageEmpty) {
        goodnotesPageEmpty.hidden = pagesVisible;
        goodnotesPageEmpty.replaceChildren(localizedSpan(view === "outline"
            ? { zh: "這份筆記尚未建立大綱", en: "This note has no outline yet" }
            : { zh: "這份筆記尚未建立音訊轉錄", en: "This note has no audio transcript yet" }));
    }
}

document.querySelectorAll("[data-gn-page-view]").forEach((button) => {
    button.addEventListener("click", () => setGoodnotesPageSidebarView(button.dataset.gnPageView));
});

function selectGoodnotesPage(button) {
    const pageNumber = Number(button.dataset.gnPageNumber || 1);
    if (!Number.isFinite(pageNumber)) return;
    goodnotesCurrentPage = pageNumber;
    document.querySelectorAll("[data-gn-page-number]").forEach((page) => page.classList.toggle("is-active", page === button));
    const documentItem = goodnotesDocuments.find((item) => item.id === goodnotesCurrentDocument);
    if (documentItem) renderGoodnotesPage(documentItem);
    else updateGoodnotesPageStatus();
}

function bindGoodnotesPageButton(button) {
    button.addEventListener("click", () => selectGoodnotesPage(button));
}

document.querySelectorAll("[data-gn-page-number]").forEach(bindGoodnotesPageButton);

document.querySelector("[data-gn-mode]")?.addEventListener("click", (event) => {
    const editing = event.currentTarget.getAttribute("aria-pressed") !== "true";
    event.currentTarget.setAttribute("aria-pressed", String(editing));
    goodnotesWindow?.classList.toggle("is-editing", editing);
    if (goodnotesEditTools) goodnotesEditTools.hidden = !editing;
    const zhLabel = event.currentTarget.querySelector('[data-copy-lang="zh"]');
    const enLabel = event.currentTarget.querySelector('[data-copy-lang="en"]');
    if (zhLabel) zhLabel.textContent = editing ? "完成" : "唯讀";
    if (enLabel) enLabel.textContent = editing ? "Done" : "Read only";
});

document.querySelector("[data-gn-sort]")?.addEventListener("click", (event) => {
    goodnotesSortAlphabetically = !goodnotesSortAlphabetically;
    event.currentTarget.classList.toggle("is-active", goodnotesSortAlphabetically);
    event.currentTarget.setAttribute("aria-pressed", String(goodnotesSortAlphabetically));
    renderGoodnotesDocuments();
    closeGoodnotesMenus();
});

function createGoodnotesDraft(action) {
    const type = {
        notebook: { preview: "NEW NOTE", title: { zh: "未命名筆記本", en: "Untitled Notebook" } },
        whiteboard: { preview: "WHITEBOARD", title: { zh: "未命名白板", en: "Untitled Whiteboard" } },
        text: { preview: "TEXT DOCUMENT", title: { zh: "未命名文本文檔", en: "Untitled Text Document" } },
        quicknote: { preview: "QUICKNOTE", title: { zh: "快速筆記", en: "QuickNote" } },
    }[action];
    if (!type) return null;
    goodnotesDraftSequence += 1;
    return {
        id: `new-draft-${goodnotesDraftSequence}`,
        subject: "math",
        favorite: false,
        shared: false,
        preview: type.preview,
        title: type.title,
        updated: { zh: "剛剛", en: "Just now" },
        date: { zh: "2026年8月4日", en: "4 AUG 2026" },
        pages: [gnPage(["開始書寫", "Start writing"], "flow", [
            gnSection(["今天要記低…", "Today I want to note…"], ["先寫問題，再留下完整 working。", "用螢光筆只標真正要回看的關鍵。"], ["write the question before the full working", "highlight only what should be reviewed later"], "idea → working → answer", "yellow"),
        ], { type: "checklist", labels: ["idea", "working", "answer"] }, ["用上方工具列選擇書寫工具。", "Choose a writing tool from the toolbar."])],
    };
}

document.querySelectorAll("[data-gn-new-action]").forEach((button) => {
    button.addEventListener("click", () => {
        const action = button.dataset.gnNewAction;
        const draft = createGoodnotesDraft(action);
        if (!draft) {
            const feedback = {
                import: { zh: "匯入功能在示範模式中不會讀取你的檔案", en: "Demo mode does not read your files" },
                recording: { zh: "示範模式不會啟動麥克風", en: "Demo mode does not start the microphone" },
                studyset: { zh: "學習卡組入口已保留", en: "The Study Set entry is preserved" },
                image: { zh: "示範模式不會開啟相片資料庫", en: "Demo mode does not open your photo library" },
                camera: { zh: "示範模式不會啟動相機", en: "Demo mode does not start the camera" },
                folder: { zh: "資料夾建立入口已保留", en: "The folder creation entry is preserved" },
                cloud: { zh: "雲端匯入目前已鎖定", en: "Cloud import is currently locked" },
            }[action] || { zh: "這個入口已保留", en: "This entry is preserved" };
            closeGoodnotesMenus();
            showGoodnotesToast(feedback);
            return;
        }
        goodnotesDocuments = [draft, ...goodnotesDocuments];
        goodnotesFilter = "all";
        goodnotesQuery = "";
        if (goodnotesSearch) goodnotesSearch.value = "";
        renderGoodnotesDocuments();
        setGoodnotesFilter("all");
        closeGoodnotesMenus();
        openGoodnotesDocument(draft.id);
        showGoodnotesToast({ zh: "已建立新筆記", en: "New note created" });
    });
});

/* Keep the legacy marker functional for older cached markup. */
document.querySelector("[data-gn-new]:not([data-gn-new-action])")?.addEventListener("click", () => {
    const draft = createGoodnotesDraft("notebook");
    if (!draft) return;
    goodnotesDocuments = [draft, ...goodnotesDocuments];
    goodnotesFilter = "all";
    goodnotesQuery = "";
    if (goodnotesSearch) goodnotesSearch.value = "";
    renderGoodnotesDocuments();
    setGoodnotesFilter("all");
    closeGoodnotesMenus();
    openGoodnotesDocument(draft.id);
    showGoodnotesToast({ zh: "已建立新筆記", en: "New note created" });
});

document.querySelector("[data-gn-add-page]")?.addEventListener("click", () => {
    if (!goodnotesPageGrid) return;
    goodnotesPageCount += 1;
    const current = goodnotesDocuments.find((item) => item.id === goodnotesCurrentDocument);
    if (current) {
        if (Array.isArray(current.pages)) {
            current.pages.push(gnPage(
                ["新一頁", "New page"],
                "flow",
                [gnSection(["繼續整理", "Continue writing"], [""], [""], "", "yellow")],
                { type: "checklist", labels: ["note", "working", "check"] },
                ["留一點空位給之後的補充。", "Leave some space for later additions."],
            ));
        } else {
            current.pages = goodnotesPageCount;
        }
    }
    const button = createGoodnotesPageButton(goodnotesPageCount, current);
    goodnotesPageGrid.insertBefore(button, document.querySelector("[data-gn-add-page]"));
    selectGoodnotesPage(button);
    showGoodnotesToast({ zh: `已新增第${goodnotesPageCount}頁`, en: `Page ${goodnotesPageCount} added` });
});

goodnotesDocumentMenu?.querySelectorAll("[data-gn-menu-action]").forEach((button) => {
    button.addEventListener("click", () => {
        const documentItem = goodnotesDocuments.find((item) => item.id === goodnotesMenuDocument);
        const action = button.dataset.gnMenuAction;
        if (action === "duplicate" && documentItem) {
            const duplicate = typeof structuredClone === "function"
                ? structuredClone(documentItem)
                : JSON.parse(JSON.stringify(documentItem));
            goodnotesDraftSequence += 1;
            duplicate.id = `${documentItem.id}-copy-${goodnotesDraftSequence}`;
            duplicate.title = { zh: `${documentItem.title.zh} 副本`, en: `${documentItem.title.en} Copy` };
            duplicate.updated = { zh: "剛剛", en: "Just now" };
            goodnotesDocuments = [duplicate, ...goodnotesDocuments];
            setGoodnotesFilter("all");
            renderGoodnotesDocuments();
            showGoodnotesToast({ zh: "已建立副本", en: "Copy created" });
        } else if (action === "window" && documentItem) {
            openGoodnotesDocument(documentItem.id);
            showGoodnotesToast({ zh: "已開啟筆記", en: "Note opened" });
        } else if (action === "move") {
            showGoodnotesToast({ zh: "移動入口已保留；示範模式不會改動資料夾", en: "Demo mode does not move your folders" });
        } else if (action === "export") {
            showGoodnotesToast({ zh: "輸出入口已保留；示範模式不會建立檔案", en: "Demo mode does not create export files" });
        } else if (action === "trash") {
            showGoodnotesToast({ zh: "示範介面不會刪除筆記", en: "Demo mode keeps the note safely in place" });
        }
        closeGoodnotesDocumentMenu();
    });
});

const goodnotesFeedbackCopy = {
    notifications: { zh: "目前沒有新通知", en: "No new notifications" },
    "library-more": { zh: "更多文件操作已準備好", en: "More document actions are ready" },
    sync: { zh: "所有變更已同步", en: "All changes are synced" },
    "note-search": { zh: "這份示範筆記沒有更多搜尋結果", en: "No additional matches in this demo note" },
    ai: { zh: "示範模式不會連接 Goodnotes AI 帳號", en: "Demo mode does not connect a Goodnotes AI account" },
    share: { zh: "示範模式不會分享私人內容", en: "Demo mode does not share private content" },
    "note-more": { zh: "更多筆記操作已準備好", en: "More note actions are ready" },
    "page-options": { zh: "頁面操作已準備好", en: "Page actions are ready" },
    "page-filter": { zh: "目前顯示所有頁面", en: "Showing all pages" },
};

document.querySelectorAll("[data-gn-feedback]").forEach((button) => {
    button.addEventListener("click", () => {
        showGoodnotesToast(goodnotesFeedbackCopy[button.dataset.gnFeedback]);
    });
});

goodnotesWindow?.addEventListener("click", (event) => {
    if (event.target.closest(".gn-menu, .gn-new-menu, .gn-document-menu, [data-gn-filter-menu-button], [data-gn-view-menu-button], [data-gn-new-menu-button]")) return;
    closeGoodnotesMenus();
});

goodnotesWindow?.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (goodnotesSearchScreen && !goodnotesSearchScreen.hidden) {
        setGoodnotesSearch(false);
        return;
    }
    closeGoodnotesMenus();
});

refreshGoodnotesCopy = () => {
    if (goodnotesSearch) {
        goodnotesSearch.placeholder = language() === "zh" ? "搜尋" : "Search";
        goodnotesSearch.setAttribute("aria-label", language() === "zh" ? "搜尋筆記" : "Search notes");
    }
    const modeButton = document.querySelector("[data-gn-mode]");
    const editing = modeButton?.getAttribute("aria-pressed") === "true";
    if (modeButton) {
        const zhLabel = modeButton.querySelector('[data-copy-lang="zh"]');
        const enLabel = modeButton.querySelector('[data-copy-lang="en"]');
        if (zhLabel) zhLabel.textContent = editing ? "完成" : "唯讀";
        if (enLabel) enLabel.textContent = editing ? "Done" : "Read only";
    }
    updateGoodnotesKindLabel();
    updateGoodnotesLibraryTitle();
    updateGoodnotesPageStatus();
    renderGoodnotesDocuments();
    const current = goodnotesDocuments.find((item) => item.id === goodnotesCurrentDocument);
    if (current) {
        syncGoodnotesPageGrid(current);
        renderGoodnotesPage(current);
    }
    const activePageView = document.querySelector("[data-gn-page-view].is-active")?.dataset.gnPageView;
    if (activePageView) setGoodnotesPageSidebarView(activePageView);
};

renderGoodnotesDocuments();
syncGoodnotesPageGrid(goodnotesDocuments[0]);
renderGoodnotesPage(goodnotesDocuments[0]);
updateGoodnotesLibraryTitle();
updateGoodnotesPageStatus();
setGoodnotesView("library");

const booksCatalog = {
    wuthering: {
        title: "啸风山庄",
        author: "艾蜜莉·布朗忒（Emily Brontë）",
        heading: "Wuthering Heights",
        progress: 39,
        copy: {
            zh: "閱讀器會保留這本書目前顯示的進度與 Apple Books 工具列配置；網站只記錄書目，不複製私人標註或原書內文。",
            en: "The reader preserves the visible progress and Apple Books toolbar layout. The site records the title only and does not copy private annotations or book text.",
        },
    },
    deer: {
        title: "鹿鼎記（全集）",
        author: "金庸",
        heading: "鹿鼎記",
        progress: 1,
        copy: {
            zh: "目前閱讀進度為 1%。這個閱讀器重現 Apple Books 的版面與控制，不公開受版權保護的書籍正文。",
            en: "Current reading progress is 1%. This reader reproduces the Apple Books layout and controls without publishing copyrighted book text.",
        },
    },
    proust: {
        title: "追忆似水年华（全七册）",
        author: "马塞尔·普鲁斯特",
        heading: "追忆似水年华",
        progress: 1,
        copy: {
            zh: "目前閱讀進度為 1%。書目和進度來自你明確授權查看的 Apple Books『繼續』區域。",
            en: "Current reading progress is 1%. The title and progress come from the Apple Books Continue section you explicitly authorised for inspection.",
        },
    },
};

let booksCurrentView = "home";
let booksLastLibraryView = "home";

function closeBooksMoreMenu() {
    if (booksMoreMenu) booksMoreMenu.hidden = true;
    booksMoreButton?.setAttribute("aria-expanded", "false");
}

function setBooksView(view, options = {}) {
    const { remember = true, focusSearch = true } = options;
    if (remember && view !== "reader") booksLastLibraryView = view;
    booksCurrentView = view;
    booksViews.forEach((panel) => setPanelVisibility(panel, panel.dataset.booksView === view));
    booksWindow?.classList.toggle("is-reader-open", view === "reader");
    booksNavButtons.forEach((button) => {
        const selected = button.dataset.booksNav === view;
        button.classList.toggle("is-active", selected);
        button.setAttribute("aria-pressed", String(selected));
    });
    closeBooksMoreMenu();
    const panel = booksViews.find((item) => item.dataset.booksView === view);
    animatePanel(panel, { y: view === "reader" ? 2 : 3 });
    if (view === "search" && focusSearch) {
        window.requestAnimationFrame(() => booksSearch?.focus());
    }
}

function openBooksReader(bookId) {
    const book = booksCatalog[bookId];
    if (!book) return;
    if (booksCurrentView !== "reader") booksLastLibraryView = booksCurrentView;
    if (booksReaderTitle) booksReaderTitle.textContent = book.title;
    if (booksReaderAuthor) booksReaderAuthor.textContent = book.author;
    if (booksReaderHeading) booksReaderHeading.textContent = book.heading;
    if (booksReaderCopy) booksReaderCopy.textContent = book.copy[language()];
    if (booksReaderProgress) booksReaderProgress.textContent = `${book.progress}%`;
    if (booksReaderRange) booksReaderRange.value = String(book.progress);
    booksWindow.dataset.booksCurrent = bookId;
    setBooksView("reader", { remember: false });
    announce(`${book.title} ${pageCopy[language()].open}`);
}

function renderBooksSearch() {
    const query = booksSearch?.value.trim().toLocaleLowerCase() || "";
    booksSearch?.closest(".books-search-field")?.classList.toggle("has-value", Boolean(query));
    const cards = [...(booksSearchResults?.querySelectorAll("[data-books-search-target]") || [])];
    if (!query) {
        if (booksSearchResults) booksSearchResults.hidden = true;
        if (booksSearchEmpty) booksSearchEmpty.hidden = true;
        if (booksTrending) booksTrending.hidden = false;
        if (booksTrendingTitle) booksTrendingTitle.hidden = false;
        return;
    }
    let visible = 0;
    cards.forEach((card) => {
        const match = card.dataset.booksSearchTarget.toLocaleLowerCase().includes(query);
        card.hidden = !match;
        if (match) visible += 1;
    });
    if (booksSearchResults) booksSearchResults.hidden = visible === 0;
    if (booksSearchEmpty) booksSearchEmpty.hidden = visible !== 0;
    if (booksTrending) booksTrending.hidden = true;
    if (booksTrendingTitle) booksTrendingTitle.hidden = true;
}

function updateBooksScrollThumb(panel, scroller, thumbHeight) {
    if (!panel || !scroller) return;
    const maxScroll = Math.max(1, scroller.scrollHeight - scroller.clientHeight);
    const progress = Math.min(1, scroller.scrollTop / maxScroll);
    const travel = Math.max(0, scroller.clientHeight - 65 - thumbHeight);
    panel.style.setProperty("--books-scroll-y", `${progress * travel}px`);
}

booksNavButtons.forEach((button) => {
    button.addEventListener("click", () => setBooksView(button.dataset.booksNav));
});

booksOpenButtons.forEach((button) => {
    button.addEventListener("click", () => openBooksReader(button.dataset.booksOpen));
});

document.querySelector("[data-books-reader-back]")?.addEventListener("click", () => {
    setBooksView(booksLastLibraryView || "home", { remember: false });
});

booksSearch?.addEventListener("input", renderBooksSearch);
booksSearchClear?.addEventListener("click", () => {
    if (booksSearch) booksSearch.value = "";
    renderBooksSearch();
    booksSearch?.focus();
});

document.querySelectorAll(".books-trending button").forEach((button) => {
    button.addEventListener("click", () => {
        if (booksSearch) booksSearch.value = button.textContent.trim();
        renderBooksSearch();
    });
});

booksMoreButton?.addEventListener("click", (event) => {
    event.stopPropagation();
    const open = booksMoreMenu?.hidden ?? true;
    if (booksMoreMenu) booksMoreMenu.hidden = !open;
    booksMoreButton.setAttribute("aria-expanded", String(open));
});

booksHomeScroll?.addEventListener("scroll", () => {
    updateBooksScrollThumb(document.querySelector(".books-home"), booksHomeScroll, 214);
}, { passive: true });

booksLibraryScroll?.addEventListener("scroll", () => {
    updateBooksScrollThumb(document.querySelector(".books-library"), booksLibraryScroll, 104);
}, { passive: true });

booksWindow?.addEventListener("click", (event) => {
    if (event.target.closest("[data-books-more], [data-books-more-menu]")) return;
    closeBooksMoreMenu();
});

booksWindow?.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (booksCurrentView === "reader") {
        setBooksView(booksLastLibraryView || "home", { remember: false });
        return;
    }
    closeBooksMoreMenu();
});

refreshBooksCopy = () => {
    if (booksSearch) booksSearch.setAttribute("aria-label", language() === "zh" ? "搜尋 Apple Books" : "Search Apple Books");
    const book = booksCatalog[booksWindow?.dataset.booksCurrent];
    if (book && booksReaderCopy) booksReaderCopy.textContent = book.copy[language()];
};

renderBooksSearch();
setBooksView("home", { focusSearch: false });
updateBooksScrollThumb(document.querySelector(".books-home"), booksHomeScroll, 214);
updateBooksScrollThumb(document.querySelector(".books-library"), booksLibraryScroll, 104);

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

    if (message.type !== "anson-vscode-pointer" || !pixelCursor || !finePointer.matches) return;
    if (message.phase === "leave") {
        pixelCursor.classList.remove("is-visible", "is-pressed", "is-hovering");
        return;
    }

    const frameRect = vscodeFrame.getBoundingClientRect();
    pixelCursor.style.left = `${frameRect.left + Number(message.x || 0)}px`;
    pixelCursor.style.top = `${frameRect.top + Number(message.y || 0)}px`;
    pixelCursor.classList.add("is-visible");
    pixelCursor.classList.toggle("is-hovering", Boolean(message.interactive));
    pixelCursor.classList.toggle("is-pressed", message.phase === "down");
});

const dockItems = dock ? [...dock.querySelectorAll(".dock-item")] : [];
let activeDockLabelItem = null;
let lastDockPointer = null;
let dockLabelReconcileFrame = 0;

function dockLabelText(item) {
    if (!item) return "";
    return language() === "en"
        ? item.dataset.dockLabelEn
        : item.dataset.dockLabelZh;
}

function positionDockHoverLabel(item = activeDockLabelItem) {
    if (!dock || !dockHoverLabel || !item) return;
    const icon = item.querySelector(".dock-icon");
    if (!icon) return;
    const dockRect = dock.getBoundingClientRect();
    const iconRect = icon.getBoundingClientRect();
    dockHoverLabel.style.left = `${iconRect.left + (iconRect.width / 2) - dockRect.left}px`;
    dockHoverLabel.style.bottom = `${dockRect.bottom - iconRect.top + 12}px`;
}

function activateDockHoverLabel(item) {
    if (!dockHoverLabel || !item?.querySelector(".dock-icon")) return;
    activeDockLabelItem = item;
    dockHoverLabel.textContent = dockLabelText(item);
    dockHoverLabel.classList.add("is-visible");
    positionDockHoverLabel(item);
}

function clearDockHoverLabel() {
    activeDockLabelItem = null;
    dockHoverLabel?.classList.remove("is-visible");
}

function dockItemAtPoint(clientX, clientY) {
    return dockItems.find((item) => {
        const rect = item.querySelector(".dock-icon")?.getBoundingClientRect();
        return rect
            && clientX >= rect.left
            && clientX <= rect.right
            && clientY >= rect.top
            && clientY <= rect.bottom;
    }) || null;
}

function pointIsInDockTransferZone(clientX, clientY) {
    if (!dock || !dockItems.length) return false;
    const dockRect = dock.getBoundingClientRect();
    const iconRects = dockItems
        .map((item) => item.querySelector(".dock-icon")?.getBoundingClientRect())
        .filter(Boolean);
    const left = Math.min(dockRect.left, ...iconRects.map((rect) => rect.left));
    const right = Math.max(dockRect.right, ...iconRects.map((rect) => rect.right));
    const top = Math.min(dockRect.top, ...iconRects.map((rect) => rect.top));
    const bottom = Math.max(dockRect.bottom, ...iconRects.map((rect) => rect.bottom));
    return clientX >= left
        && clientX <= right
        && clientY >= top
        && clientY <= bottom;
}

function reconcileDockHoverLabel(clientX, clientY, pointerType = "mouse") {
    if (pointerType === "touch" || window.innerWidth <= 760) {
        clearDockHoverLabel();
        return;
    }
    const nextItem = dockItemAtPoint(clientX, clientY);
    if (nextItem) {
        if (nextItem !== activeDockLabelItem) activateDockHoverLabel(nextItem);
        else positionDockHoverLabel(nextItem);
        return;
    }
    if (activeDockLabelItem && !pointIsInDockTransferZone(clientX, clientY)) {
        clearDockHoverLabel();
    }
}

function queueDockHoverReconcile() {
    if (!lastDockPointer || dockLabelReconcileFrame) return;
    dockLabelReconcileFrame = window.requestAnimationFrame(() => {
        dockLabelReconcileFrame = 0;
        reconcileDockHoverLabel(
            lastDockPointer.clientX,
            lastDockPointer.clientY,
            lastDockPointer.pointerType,
        );
    });
}

function updateDockHoverLabel(event) {
    lastDockPointer = {
        clientX: event.clientX,
        clientY: event.clientY,
        pointerType: event.pointerType,
    };
    reconcileDockHoverLabel(event.clientX, event.clientY, event.pointerType);
}

refreshDockHoverLabel = () => {
    if (!activeDockLabelItem || !dockHoverLabel) return;
    dockHoverLabel.textContent = dockLabelText(activeDockLabelItem);
    positionDockHoverLabel(activeDockLabelItem);
};

document.addEventListener("pointermove", updateDockHoverLabel, { passive: true });
dockItems.forEach((item) => {
    item.addEventListener("focus", () => activateDockHoverLabel(item));
});
dock?.addEventListener("focusout", (event) => {
    if (!dock.contains(event.relatedTarget)) clearDockHoverLabel();
});
window.addEventListener("resize", () => {
    if (window.innerWidth <= 760) clearDockHoverLabel();
    else positionDockHoverLabel();
}, { passive: true });

function setupDockMagnification() {
    if (!dock || !finePointer.matches || reducedMotion.matches || !hasGsap()) return;

    const glass = dock.querySelector(".dock-glass");
    const items = [...dock.querySelectorAll(".dock-item")];
    const records = items
        .map((item) => {
            const icon = item.querySelector(".dock-icon");
            if (!icon) return null;
            const state = { zoomValue: 1, offsetValue: 0 };
            const record = {
                item,
                icon,
                state,
                center: 0,
                width: 58,
                render: null,
                scaleTo: null,
                xTo: null,
            };
            record.render = () => {
                window.gsap.set(icon, {
                    scale: state.zoomValue,
                    x: state.offsetValue,
                });
                if (activeDockLabelItem === item) positionDockHoverLabel(item);
                queueDockHoverReconcile();
            };
            record.scaleTo = window.gsap.quickTo(state, "zoomValue", {
                duration: 0.28,
                ease: "power3.out",
                onUpdate: record.render,
            });
            record.xTo = window.gsap.quickTo(state, "offsetValue", {
                duration: 0.28,
                ease: "power3.out",
                onUpdate: record.render,
            });
            return record;
        })
        .filter(Boolean);
    const glassState = { stretchValue: 1 };
    const renderGlass = () => {
        if (!glass) return;
        window.gsap.set(glass, { scaleX: glassState.stretchValue });
    };
    const glassScaleTo = glass
        ? window.gsap.quickTo(glassState, "stretchValue", {
            duration: 0.3,
            ease: "power3.out",
            onUpdate: renderGlass,
        })
        : null;
    let dockCenter = 0;
    let dockWidth = 0;
    let baseItemsWidth = 0;

    function measureDockItems() {
        const dockRect = dock.getBoundingClientRect();
        dockWidth = dockRect.width;
        dockCenter = dockRect.left + dockRect.width / 2;
        records.forEach((record) => {
            const rect = record.item.getBoundingClientRect();
            record.center = rect.left + rect.width / 2;
            record.width = rect.width;
        });
        baseItemsWidth = records.reduce((total, record) => total + record.width, 0);
        positionDockHoverLabel();
    }

    function resetDockMagnification() {
        records.forEach((record) => {
            record.scaleTo(1);
            record.xTo(0);
        });
        glassScaleTo?.(1);
    }

    function updateDockMagnification(event) {
        if (event.pointerType === "touch" || window.innerWidth <= 760) {
            resetDockMagnification();
            return;
        }

        if (!records[0]?.center) measureDockItems();
        const maxScaleGain = (128 / 58) - 1;

        const scales = records.map((record) => {
            const distance = record.center - event.clientX;
            const absoluteDistance = Math.abs(distance);
            const influence = Math.exp(-((absoluteDistance / 52) ** 2));
            return 1 + maxScaleGain * influence;
        });
        const targetWidths = records.map((record, index) => record.width * scales[index]);
        const totalTargetWidth = targetWidths.reduce((total, width) => total + width, 0);
        let nextLeft = dockCenter - totalTargetWidth / 2;

        records.forEach((record, index) => {
            const desiredCenter = nextLeft + targetWidths[index] / 2;
            record.scaleTo(scales[index]);
            record.xTo(desiredCenter - record.center);
            nextLeft += targetWidths[index];
        });

        const chromeWidth = Math.max(0, dockWidth - baseItemsWidth);
        glassScaleTo?.((totalTargetWidth + chromeWidth) / Math.max(dockWidth, 1));
    }

    function handleDockResize() {
        measureDockItems();
        if (window.innerWidth <= 760) resetDockMagnification();
    }

    dock.addEventListener("pointerenter", measureDockItems, { passive: true });
    dock.addEventListener("pointermove", updateDockMagnification, { passive: true });
    dock.addEventListener("pointerleave", resetDockMagnification, { passive: true });
    window.addEventListener("resize", handleDockResize, { passive: true });
}

setupDockMagnification();

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

    scheduleVscodeWarmup();
}

boot();

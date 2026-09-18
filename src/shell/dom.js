export default function createShellRefs() {
    const root = document.documentElement;
    const body = document.body;
    const os = document.querySelector("[data-os]");
    const desktop = document.querySelector("[data-desktop]");
    const windowLayer = document.querySelector("[data-window-layer]");
    const dock = document.querySelector(".dock");
    const dockHoverLabel = document.querySelector("[data-dock-hover-label]");
    const menuBar = document.querySelector(".menu-bar");
    const activeAppName = document.querySelector("[data-active-app]");

    const description = document.querySelector('meta[name="description"]');

    const languageButtons = [...document.querySelectorAll("[data-set-language]")];
    const languageToggles = [...document.querySelectorAll("[data-language-toggle]")];
    const clock = document.querySelector("[data-clock]");
    const appWindows = new Map(
        [...document.querySelectorAll("[data-window]")].map((element) => [element.dataset.window, element]),
    );
    const appIds = [...appWindows.keys()];
    const dockButtons = new Map(
        [...document.querySelectorAll("[data-dock-app]")].map((element) => [
            element.dataset.dockApp,
            element,
        ]),
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

    return {
        root,
        body,
        os,
        desktop,
        windowLayer,
        dock,
        dockHoverLabel,
        menuBar,
        activeAppName,
        description,
        languageButtons,
        languageToggles,
        clock,
        appWindows,
        appIds,
        dockButtons,
        dockExploreButton,
        launchpad,
        launchpadInput,
        launchpadResults,
        launchpadEmpty,
        explorePanel,
        exploreBackdrop,
        exploreInput,
        exploreResults,
        exploreEmpty,
        exploreFilters,
        menuTriggers,
        menuPanels,
        statusTriggers,
        statusPanels,
        contextMenu,
        viewOptions,
        desktopIconSize,
        desktopGridSpacing,
        displayBrightness,
        calendarWeekday,
        calendarDay,
        calendarMonth,
    };
}

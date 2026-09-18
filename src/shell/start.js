import renderLaunchers from "./render-launchers.js";
import createShellRefs from "./dom.js";
import initWindows from "./windows.js";
import initMenus from "./menus.js";
import initOverlays from "./overlays.js";
import initDock from "./dock.js";
import initPointer from "./pointer.js";
import initLocale from "./locale.js";
import bootShell from "./boot.js";
import { createAppRegistry } from "../shared/app-registry.js";

export function startShell(appManifest, factories, shellIcons) {
    renderLaunchers({ appManifest, shellIcons });
    const refs = createShellRefs();
    const apps = createAppRegistry(appManifest, factories);

    // Late-bound service functions resolve the shell's mutual UI dependencies.
    // They are not invoked until the corresponding modules have initialized.
    const services = {
        ...refs,
        appManifest,
        appManifestById: new Map(appManifest.map((app) => [app.id, app])),
        notifyApp: (id, event) => apps.notify(id, event),
        notifyLanguageChanged: () => apps.languageChanged(),
        openApp: (...args) => windows.openApp(...args),
        closeApp: (...args) => windows.closeApp(...args),
        minimizeApp: (...args) => windows.minimizeApp(...args),
        toggleMaximize: (...args) => windows.toggleMaximize(...args),
        visibleWindows: () => windows.visibleWindows(),
        focusWindow: (...args) => windows.focusWindow(...args),
        closeAllWindowsImmediately: () => windows.closeAllWindowsImmediately(),
        closeMenuPopovers: (...args) => menus.closeMenuPopovers(...args),
        closeStatusPanels: (...args) => menus.closeStatusPanels(...args),
        hideContextMenu: () => menus.hideContextMenu(),
        activeWindowId: () => menus.activeWindowId(),
        openLaunchpad: (...args) => overlays.openLaunchpad(...args),
        closeLaunchpad: (...args) => overlays.closeLaunchpad(...args),
        openExplore: (...args) => overlays.openExplore(...args),
        closeExplore: (...args) => overlays.closeExplore(...args),
        getDockVisualRect: (...args) => dock.getDockVisualRect(...args),
        refreshDockHoverLabel: () => dock.refreshDockHoverLabel(),
        setLanguage: (...args) => locale.setLanguage(...args),
    };
    const windows = initWindows(services);
    const menus = initMenus(services);
    const overlays = initOverlays(services);
    const dock = initDock(services);
    const pointer = initPointer(services);
    const locale = initLocale(services);
    apps.mountAll({ openApp: services.openApp, reportPointer: pointer.reportPointer });
    bootShell(services);
}

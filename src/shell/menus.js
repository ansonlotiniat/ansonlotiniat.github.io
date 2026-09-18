import { hasGsap } from "../shared/motion.js";
import { language } from "../shared/i18n.js";

export default function initMenus({
    menuPanels,
    menuTriggers,
    statusPanels,
    statusTriggers,
    contextMenu,
    viewOptions,
    visibleWindows,
    openApp,
    openLaunchpad,
    openExplore,
    closeApp,
    minimizeApp,
    toggleMaximize,
    setLanguage,
    focusWindow,
    desktop,
    root,
    desktopIconSize,
    desktopGridSpacing,
    displayBrightness,
}) {
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
                const trigger = menuTriggers.find(
                    (item) => item.dataset.menuTrigger === panel.dataset.menuPanel,
                );
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
            const trigger = statusTriggers.find(
                (item) => item.dataset.statusTrigger === panel.dataset.statusPanel,
            );
            trigger?.setAttribute("aria-expanded", String(keepOpen));
            trigger?.classList.toggle("is-active", keepOpen);
        });
    }

    statusTriggers.forEach((trigger) => {
        trigger.addEventListener("click", (event) => {
            event.stopPropagation();
            const panel = statusPanels.find(
                (item) => item.dataset.statusPanel === trigger.dataset.statusTrigger,
            );
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
                {
                    x: 0,
                    rotate: 0,
                    duration: 0.38,
                    stagger: 0.04,
                    ease: "back.out(2)",
                    clearProps: "transform",
                },
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

    document
        .querySelectorAll(".menu-popover [data-open-app], .status-panel [data-open-app]")
        .forEach((item) => {
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

    document
        .querySelector("[data-close-view-options]")
        ?.addEventListener("click", () => toggleViewOptions(false));
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
        if (
            viewOptions &&
            !viewOptions.hidden &&
            !event.target.closest(
                "[data-view-options], [data-menu-command='show-view-options'], [data-context-command='show-view-options']",
            )
        ) {
            toggleViewOptions(false);
        }
    });

    return { closeMenuPopovers, closeStatusPanels, hideContextMenu, activeWindowId };
}

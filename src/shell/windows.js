import { hasGsap } from "../shared/motion.js";
import { announce, language } from "../shared/i18n.js";
import { pageCopy } from "./copy.js";
export default function initWindows({
    appManifestById,
    appWindows,
    dockButtons,
    activeAppName,
    getDockVisualRect,
    notifyApp,
    closeExplore,
    closeLaunchpad,
    desktop,
    windowLayer,
    body,
}) {
    let zIndex = 120;
    let dragState = null;
    const mobileWindowMode = window.matchMedia("(max-width: 700px)");
    function appLabel(appId) {
        return appManifestById.get(appId)?.appLabel || appWindows.get(appId)?.dataset.appLabel || appId;
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
        const dockRect = getDockVisualRect(dockButton);
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
        const { historyMode = "push", restoreFocus = true, animate = true } = options;

        notifyApp(appId, "open");

        closeExplore(false);
        closeLaunchpad(false);

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
        notifyApp(appId, action);
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

    function closeAllWindowsImmediately() {
        appWindows.forEach((appWindow, appId) => {
            const surface = appWindow.querySelector(".window-surface");
            appWindow.hidden = true;
            appWindow.inert = true;
            appWindow.setAttribute("aria-hidden", "true");
            appWindow.classList.remove("is-open", "is-focused");
            appWindow.dataset.minimized = "false";
            updateDockState(appId, "closed");
            notifyApp(appId, "close");
            if (window.gsap && surface) {
                window.gsap.set(surface, { clearProps: "transform,opacity,visibility" });
            }
        });
        setDesktopActive();
    }

    return {
        openApp,
        closeApp,
        minimizeApp,
        toggleMaximize,
        focusWindow,
        visibleWindows,
        closeAllWindowsImmediately,
    };
}

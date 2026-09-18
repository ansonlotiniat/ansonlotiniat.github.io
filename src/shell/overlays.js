import { hasGsap } from "../shared/motion.js";

export default function initOverlays({
    launchpadInput,
    launchpadResults,
    launchpadEmpty,
    desktop,
    windowLayer,
    menuBar,
    launchpad,
    closeMenuPopovers,
    closeStatusPanels,
    hideContextMenu,
    body,
    dockExploreButton,
    exploreResults,
    exploreInput,
    exploreFilters,
    exploreEmpty,
    dock,
    explorePanel,
    exploreBackdrop,
    openApp,
    activeWindowId,
    closeApp,
    minimizeApp,
    appManifest,
}) {
    let exploreOpen = false;
    let launchpadOpen = false;
    let selectedExploreIndex = 0;
    let previousExploreFocus = null;
    let previousLaunchpadFocus = null;
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
        const columns = Math.max(
            1,
            Number.parseInt(
                getComputedStyle(launchpad.querySelector(".launchpad-grid")).gridTemplateColumns.split(" ")
                    .length,
                10,
            ),
        );
        const delta =
            event.key === "ArrowLeft"
                ? -1
                : event.key === "ArrowRight"
                  ? 1
                  : event.key === "ArrowUp"
                    ? -columns
                    : columns;
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

    document.addEventListener(
        "keydown",
        (event) => {
            const target = event.target;
            const typing =
                target instanceof HTMLInputElement ||
                target instanceof HTMLTextAreaElement ||
                target?.isContentEditable;
            const exploreShortcut =
                (event.metaKey && event.code === "Space") ||
                ((event.metaKey || event.ctrlKey) && event.key.toLocaleLowerCase() === "k");

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
        },
        true,
    );

    return { openLaunchpad, closeLaunchpad, openExplore, closeExplore };
}

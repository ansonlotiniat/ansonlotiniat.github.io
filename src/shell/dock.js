import { language } from "../shared/i18n.js";
import { reducedMotion, hasGsap } from "../shared/motion.js";

export default function initDock({ dock, dockButtons, dockHoverLabel, explorePanel }) {
    const finePointer = window.matchMedia("(pointer: fine)");
    const dockItems = dock ? [...dock.querySelectorAll(".dock-item")] : [];
    let activeDockLabelItem = null;
    let lastDockPointer = null;
    let dockLabelReconcileFrame = 0;

    function resolveDockItem(itemOrAppId) {
        if (itemOrAppId instanceof Element) return itemOrAppId.closest(".dock-item");
        return dockButtons.get(String(itemOrAppId || "")) || null;
    }

    function getDockVisualRect(itemOrAppId) {
        const item = resolveDockItem(itemOrAppId);
        const icon = item?.querySelector(".dock-icon");
        return (icon || item || dock).getBoundingClientRect();
    }

    function dockLabelText(item) {
        if (!item) return "";
        return language() === "en" ? item.dataset.dockLabelEn : item.dataset.dockLabelZh;
    }

    function positionDockHoverLabel(item = activeDockLabelItem) {
        if (!dock || !dockHoverLabel || !item) return;
        const dockRect = dock.getBoundingClientRect();
        const iconRect = getDockVisualRect(item);
        dockHoverLabel.style.left = `${iconRect.left + iconRect.width / 2 - dockRect.left}px`;
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
        return (
            dockItems.find((item) => {
                const rect = getDockVisualRect(item);
                return (
                    rect &&
                    clientX >= rect.left &&
                    clientX <= rect.right &&
                    clientY >= rect.top &&
                    clientY <= rect.bottom
                );
            }) || null
        );
    }

    function pointIsInDockTransferZone(clientX, clientY) {
        if (!dock || !dockItems.length) return false;
        const dockRect = dock.getBoundingClientRect();
        const iconRects = dockItems.map((item) => getDockVisualRect(item)).filter(Boolean);
        const left = Math.min(dockRect.left, ...iconRects.map((rect) => rect.left));
        const right = Math.max(dockRect.right, ...iconRects.map((rect) => rect.right));
        const top = Math.min(dockRect.top, ...iconRects.map((rect) => rect.top));
        const bottom = Math.max(dockRect.bottom, ...iconRects.map((rect) => rect.bottom));
        return clientX >= left && clientX <= right && clientY >= top && clientY <= bottom;
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

    const refreshDockHoverLabel = () => {
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
    window.addEventListener(
        "resize",
        () => {
            if (window.innerWidth <= 760) clearDockHoverLabel();
            else positionDockHoverLabel();
        },
        { passive: true },
    );

    function setupDockMagnification() {
        if (!dock || !finePointer.matches || reducedMotion.matches || !hasGsap()) return;

        const glass = dock.querySelector(".dock-glass");
        const items = [...dock.querySelectorAll(".dock-item")];
        const records = items
            .map((item) => {
                const visual = item.querySelector(".dock-visual");
                const icon = item.querySelector(".dock-icon");
                if (!visual || !icon) return null;
                const state = { zoomValue: 1, offsetValue: 0 };
                const record = {
                    item,
                    visual,
                    icon,
                    state,
                    center: 0,
                    width: 58,
                    render: null,
                    scaleTo: null,
                    xTo: null,
                };
                record.render = () => {
                    window.gsap.set(visual, { x: state.offsetValue });
                    window.gsap.set(icon, { scale: state.zoomValue });
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

        function dockMetric(name, fallback) {
            const value = Number.parseFloat(getComputedStyle(dock).getPropertyValue(name));
            return Number.isFinite(value) ? value : fallback;
        }

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
            const maximumSize = dockMetric("--dock-maximum-size", 128);
            const influenceRadius = dockMetric("--dock-influence-radius", 52);

            const scales = records.map((record) => {
                const distance = record.center - event.clientX;
                const absoluteDistance = Math.abs(distance);
                const influence = Math.exp(-((absoluteDistance / influenceRadius) ** 2));
                return 1 + (maximumSize / record.width - 1) * influence;
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
            surface.addEventListener(
                "pointermove",
                (event) => {
                    const rect = surface.getBoundingClientRect();
                    const x = ((event.clientX - rect.left) / Math.max(rect.width, 1)) * 100;
                    const y = ((event.clientY - rect.top) / Math.max(rect.height, 1)) * 100;
                    surface.style.setProperty("--glass-x", `${x}%`);
                    surface.style.setProperty("--glass-y", `${y}%`);
                },
                { passive: true },
            );
            surface.addEventListener("pointerleave", () => {
                surface.style.setProperty("--glass-x", "50%");
                surface.style.setProperty("--glass-y", "0%");
            });
        });
    }

    return { getDockVisualRect, refreshDockHoverLabel };
}

import { hasGsap } from "../shared/motion.js";

export default function bootShell({ appIds, openApp, closeAllWindowsImmediately, body }) {
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
}

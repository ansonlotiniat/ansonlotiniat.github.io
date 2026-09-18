export const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

export function hasGsap() {
    return Boolean(window.gsap) && !reducedMotion.matches;
}

export function setPanelVisibility(panel, active) {
    panel.hidden = !active;
    panel.inert = !active;
    panel.classList.toggle("is-active", active);
    panel.setAttribute("aria-hidden", String(!active));
}

export function animatePanel(panel, options = {}) {
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

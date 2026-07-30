const root = document.documentElement;
const body = document.body;
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const languageButtons = [...document.querySelectorAll("[data-set-language]")];
const menuButton = document.querySelector("[data-menu-toggle]");
const navigation = document.querySelector("[data-nav]");
const header = document.querySelector("[data-header]");
const navLinks = [...document.querySelectorAll("[data-nav] a[href^='#']")];
const description = document.querySelector('meta[name="description"]');
const atlasStage = document.querySelector("[data-atlas-stage]");
const atlasButtons = [...document.querySelectorAll("[data-atlas-mode]")];
const atlasPanels = [...document.querySelectorAll("[data-atlas-panel]")];
const atlasIndex = document.querySelector("[data-atlas-index]");
const caseButtons = [...document.querySelectorAll("[data-case-tab]")];
const casePanels = [...document.querySelectorAll("[data-case-panel]")];
const sportsInstrument = document.querySelector("[data-sports-stage]");
const sportsRange = document.querySelector("[data-sports-range]");
const sportsOutput = document.querySelector("[data-sports-output]");
const debateInstrument = document.querySelector("[data-debate-view]");
const debateButtons = [...document.querySelectorAll("[data-debate-mode]")];
const debateCopies = [...document.querySelectorAll("[data-debate-copy]")];
const igemInstrument = document.querySelector("[data-igem-instrument]");
const igemRange = document.querySelector("[data-igem-range]");
const igemOutput = document.querySelector("[data-igem-output]");
const archiveViewer = document.querySelector("[data-archive-viewer]");
const archiveLens = document.querySelector("[data-archive-lens]");
const poemBell = document.querySelector(".poem-bell");
const poemButton = document.querySelector("[data-poem-toggle]");

const pageCopy = {
    zh: {
        title: "Anson Lo — 系統、表達與文字",
        description: "Anson Lo，來自澳門的學生開發者、編輯與演講者。",
        atlasLabel: "可拖曳及用鍵盤旋轉的澳門三層立體地形",
        sportsStages: ["活動前", "活動中", "在現場"],
        openMenu: "開啟目錄",
        closeMenu: "關閉目錄",
    },
    en: {
        title: "Anson Lo — Systems, Voice & Words",
        description: "Anson Lo is a student developer, editor, and speaker from Macao.",
        atlasLabel: "A three-layer relief of Macao that can be rotated by dragging or keyboard",
        sportsStages: ["Before", "Live", "On site"],
        openMenu: "Open menu",
        closeMenu: "Close menu",
    },
};

let activeAtlasMode = 0;
let activeCase = 0;
let activeDebateView = "team";
let lastScrollY = window.scrollY;
let headerFrame = 0;

function language() {
    return root.dataset.language === "en" ? "en" : "zh";
}

function updateSportsStage() {
    if (!sportsRange || !sportsInstrument || !sportsOutput) return;
    const stage = Math.max(0, Math.min(2, Number(sportsRange.value)));
    sportsInstrument.dataset.sportsStage = String(stage);
    sportsOutput.textContent = pageCopy[language()].sportsStages[stage];
}

function setLanguage(nextLanguage, persist = true) {
    const next = nextLanguage === "en" ? "en" : "zh";
    root.dataset.language = next;
    root.lang = next === "zh" ? "zh-Hant" : "en";
    document.title = pageCopy[next].title;
    description?.setAttribute("content", pageCopy[next].description);
    atlasStage?.setAttribute("aria-label", pageCopy[next].atlasLabel);
    syncMenuLabel();

    languageButtons.forEach((button) => {
        button.setAttribute("aria-pressed", String(button.dataset.setLanguage === next));
    });

    updateSportsStage();

    if (persist) {
        try {
            localStorage.setItem("anson-language", next);
        } catch {
            // Language switching remains available when storage is blocked.
        }
    }

    requestAnimationFrame(() => window.ScrollTrigger?.refresh());
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

function closeMenu() {
    menuButton?.setAttribute("aria-expanded", "false");
    navigation?.classList.remove("is-open");
    body.classList.remove("menu-open");
    syncMenuLabel();
}

function syncMenuLabel() {
    if (!menuButton) return;
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-label", pageCopy[language()][isOpen ? "closeMenu" : "openMenu"]);
}

menuButton?.addEventListener("click", () => {
    const willOpen = menuButton.getAttribute("aria-expanded") !== "true";
    menuButton.setAttribute("aria-expanded", String(willOpen));
    navigation?.classList.toggle("is-open", willOpen);
    body.classList.toggle("menu-open", willOpen);
    syncMenuLabel();
});

navLinks.forEach((link) => link.addEventListener("click", closeMenu));
window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeMenu();
        if (poemBell?.classList.contains("is-ringing")) {
            poemBell.classList.remove("is-ringing");
            poemButton?.setAttribute("aria-expanded", "false");
            poemButton?.focus();
        }
    }
});

function animateAtlasPanel(panel) {
    if (!panel || reducedMotion.matches || !window.gsap) return;
    const targets = panel.querySelectorAll(".micro-label, h2, p:last-child");
    window.gsap.killTweensOf(targets);
    window.gsap.fromTo(
        targets,
        { autoAlpha: 0, y: 18 },
        {
            autoAlpha: 1,
            y: 0,
            duration: 0.58,
            stagger: 0.055,
            ease: "power3.out",
            clearProps: "opacity,visibility,transform",
        },
    );
}

function setAtlasMode(index, moveFocus = false) {
    const next = Math.max(0, Math.min(atlasButtons.length - 1, Number(index) || 0));
    activeAtlasMode = next;

    atlasButtons.forEach((button, buttonIndex) => {
        const active = buttonIndex === next;
        button.setAttribute("aria-pressed", String(active));
        button.classList.toggle("is-active", active);
        if (active && moveFocus) button.focus();
    });

    atlasPanels.forEach((panel, panelIndex) => {
        const active = panelIndex === next;
        panel.hidden = !active;
        panel.classList.toggle("is-active", active);
        if (active) animateAtlasPanel(panel);
    });

    if (atlasIndex) atlasIndex.textContent = String(next + 1).padStart(2, "0");
    window.dispatchEvent(new CustomEvent("atlas:mode", { detail: { mode: next } }));
}

function nextKeyIndex(event, index, total) {
    if (event.key === "Home") return 0;
    if (event.key === "End") return total - 1;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") return (index + 1) % total;
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") return (index - 1 + total) % total;
    return null;
}

atlasButtons.forEach((button, index) => {
    button.addEventListener("click", () => setAtlasMode(index));
    button.addEventListener("keydown", (event) => {
        const next = nextKeyIndex(event, index, atlasButtons.length);
        if (next === null) return;
        event.preventDefault();
        setAtlasMode(next, true);
    });
});

window.addEventListener("atlas:ready", () => setAtlasMode(activeAtlasMode));
window.addEventListener("atlas:mode-request", (event) => {
    setAtlasMode(event.detail?.mode ?? activeAtlasMode);
});
setAtlasMode(0);

function animateCasePanel(panel) {
    if (!panel || reducedMotion.matches || !window.gsap) return;
    const copy = panel.querySelector(".case-copy");
    const instrument = panel.querySelector(".instrument");
    window.gsap.killTweensOf([copy, instrument]);
    window.gsap
        .timeline({ defaults: { duration: 0.68, ease: "power3.out" } })
        .fromTo(copy, { autoAlpha: 0, x: -28 }, { autoAlpha: 1, x: 0, clearProps: "opacity,visibility,transform" })
        .fromTo(
            instrument,
            { autoAlpha: 0, x: 34, rotate: 1.2 },
            { autoAlpha: 1, x: 0, rotate: 0, clearProps: "opacity,visibility,transform" },
            0.08,
        );
}

function setCase(index, moveFocus = false) {
    const next = Math.max(0, Math.min(caseButtons.length - 1, Number(index) || 0));
    activeCase = next;

    caseButtons.forEach((button, buttonIndex) => {
        const active = buttonIndex === next;
        button.setAttribute("aria-selected", String(active));
        button.tabIndex = active ? 0 : -1;
        if (active && moveFocus) button.focus();
    });

    casePanels.forEach((panel, panelIndex) => {
        const active = panelIndex === next;
        panel.hidden = !active;
        panel.classList.toggle("is-active", active);
        if (active) animateCasePanel(panel);
    });
}

caseButtons.forEach((button, index) => {
    button.addEventListener("click", () => setCase(index));
    button.addEventListener("keydown", (event) => {
        const next = nextKeyIndex(event, index, caseButtons.length);
        if (next === null) return;
        event.preventDefault();
        setCase(next, true);
    });
});
setCase(0);

sportsRange?.addEventListener("input", updateSportsStage);
updateSportsStage();

function setDebateView(view) {
    activeDebateView = view === "tournament" ? "tournament" : "team";
    if (debateInstrument) debateInstrument.dataset.debateView = activeDebateView;

    debateButtons.forEach((button) => {
        button.setAttribute("aria-pressed", String(button.dataset.debateMode === activeDebateView));
    });
    debateCopies.forEach((copy) => {
        copy.hidden = copy.dataset.debateCopy !== activeDebateView;
    });
}

debateButtons.forEach((button) => {
    button.addEventListener("click", () => setDebateView(button.dataset.debateMode));
});
setDebateView("team");

function updateIgemAlignment() {
    if (!igemRange || !igemInstrument || !igemOutput) return;
    const value = Math.max(0, Math.min(100, Number(igemRange.value)));
    const separation = (100 - value) / 100;
    igemInstrument.style.setProperty("--left-offset", `${(-7 * separation).toFixed(2)}rem`);
    igemInstrument.style.setProperty("--middle-offset", `${(2.2 * separation).toFixed(2)}rem`);
    igemInstrument.style.setProperty("--right-offset", `${(7 * separation).toFixed(2)}rem`);
    igemInstrument.classList.toggle("is-aligned", value >= 86);
    igemOutput.textContent = `${value}% ALIGNED`;
}

igemRange?.addEventListener("input", updateIgemAlignment);
updateIgemAlignment();

archiveViewer?.addEventListener("pointermove", (event) => {
    if (!archiveLens || event.pointerType === "touch") return;
    const bounds = archiveViewer.getBoundingClientRect();
    const x = Math.max(0, Math.min(bounds.width, event.clientX - bounds.left));
    const y = Math.max(0, Math.min(bounds.height, event.clientY - bounds.top));
    archiveLens.style.left = `${x}px`;
    archiveLens.style.top = `${y}px`;
    archiveLens.style.backgroundPosition = `${(x / bounds.width) * 100}% ${(y / bounds.height) * 100}%`;
});

poemButton?.addEventListener("click", () => {
    const expanded = poemButton.getAttribute("aria-expanded") !== "true";
    poemButton.setAttribute("aria-expanded", String(expanded));
    poemBell?.classList.toggle("is-ringing", expanded);
});

function updateActiveNavigation() {
    headerFrame = 0;
    const scrollY = window.scrollY;
    const direction = scrollY > lastScrollY ? 1 : -1;
    const hideHeader = direction > 0 && scrollY > 180 && !body.classList.contains("menu-open");
    header?.classList.toggle("is-hidden", hideHeader);
    lastScrollY = scrollY;

    let activeId = "top";
    const marker = window.innerHeight * 0.42;
    for (const link of navLinks) {
        const id = link.hash.slice(1);
        const target = document.getElementById(id);
        if (target && target.getBoundingClientRect().top <= marker) activeId = id;
    }

    navLinks.forEach((link) => {
        if (link.hash === `#${activeId}`) link.setAttribute("aria-current", "true");
        else link.removeAttribute("aria-current");
    });
}

window.addEventListener(
    "scroll",
    () => {
        if (!headerFrame) headerFrame = requestAnimationFrame(updateActiveNavigation);
    },
    { passive: true },
);
updateActiveNavigation();

function initialiseMotion() {
    if (!window.gsap || reducedMotion.matches) return;
    const { gsap, ScrollTrigger } = window;
    if (ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

    gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .fromTo(".hero-name", { autoAlpha: 0, scale: 0.94 }, { autoAlpha: 1, scale: 1, duration: 1.15 })
        .fromTo(
            "[data-hero-enter]",
            { autoAlpha: 0, y: 30 },
            { autoAlpha: 1, y: 0, duration: 0.82, stagger: 0.12, clearProps: "opacity,visibility,transform" },
            0.12,
        )
        .fromTo(
            ".atlas-stage",
            { autoAlpha: 0, scale: 0.95 },
            { autoAlpha: 1, scale: 1, duration: 1, clearProps: "opacity,visibility,transform" },
            0.18,
        );

    if (ScrollTrigger) {
        gsap.utils.toArray("[data-reveal]").forEach((element) => {
            gsap.fromTo(
                element,
                { autoAlpha: 0, y: 42 },
                {
                    autoAlpha: 1,
                    y: 0,
                    duration: 0.9,
                    ease: "power3.out",
                    clearProps: "opacity,visibility,transform",
                    scrollTrigger: {
                        trigger: element,
                        start: "top 86%",
                        once: true,
                    },
                },
            );
        });
    }
}

initialiseMotion();
document.querySelector("[data-year]").textContent = String(new Date().getFullYear());

const root = document.documentElement;
const body = document.body;
const menuButton = document.querySelector("[data-menu-button]");
const navigation = document.querySelector("[data-navigation]");
const languageButtons = [...document.querySelectorAll("[data-set-language]")];
const navLinks = [...document.querySelectorAll(".site-navigation a")];
const siteHeader = document.querySelector("[data-site-header]");
const sections = [
    document.getElementById("top"),
    document.getElementById("about"),
    document.getElementById("work"),
    document.getElementById("publications"),
    document.getElementById("contact"),
].filter(Boolean);
const description = document.querySelector('meta[name="description"]');
const dialogs = [...document.querySelectorAll("[data-dialog]")];
const methodFrames = [...document.querySelectorAll("[data-method-frame]")];
const methodButtons = [...document.querySelectorAll("[data-method-jump]")];
const methodCounts = [...document.querySelectorAll("[data-method-count]")];
const projectPanels = [...document.querySelectorAll("[data-project-panel]")];
const projectButtons = [...document.querySelectorAll("[data-project-jump]")];
const projectCount = document.querySelector("[data-project-count]");
const projectViewport = document.querySelector("[data-project-viewport]");
const projectTrack = document.querySelector("[data-project-track]");
const nextStep = document.querySelector("[data-next-step]");
const nextStepIndex = document.querySelector("[data-next-index]");
const nextStepLink = document.querySelector("[data-next-link]");
const nextStepLabel = document.querySelector("[data-next-label]");

const pageCopy = {
    zh: {
        title: "Anson Lo — 設計、系統與文字",
        description: "Anson Lo，來自澳門的學生開發者、編輯與演講者。",
    },
    en: {
        title: "Anson Lo — Design, Systems & Words",
        description: "Anson Lo is a student developer, editor, and speaker from Macao.",
    },
};

let activeSectionId = "top";
let activeMethod = 0;
let activeProject = 0;
let methodTrigger = null;
let projectTrigger = null;
let projectTween = null;
let lastScrollY = window.scrollY;
let headerIsHidden = false;
let scrollFrame = 0;
let mobileProjectFrame = 0;

function closeMenu() {
    menuButton?.setAttribute("aria-expanded", "false");
    navigation?.classList.remove("is-open");
    body.classList.remove("menu-open");
}

menuButton?.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isOpen));
    navigation?.classList.toggle("is-open", !isOpen);
    body.classList.toggle("menu-open", !isOpen);
});

navLinks.forEach((link) => link.addEventListener("click", closeMenu));

function getLanguage() {
    return root.dataset.language === "en" ? "en" : "zh";
}

function updateNextStep() {
    const currentIndex = sections.findIndex((section) => section.id === activeSectionId);
    const nextSection = sections[currentIndex + 1];

    if (!nextStep || !nextStepLink || !nextSection) {
        nextStep?.classList.add("is-hidden");
        return;
    }

    const language = getLanguage();
    const labelKey = language === "en" ? "sectionNameEn" : "sectionNameZh";
    nextStep.classList.remove("is-hidden");
    nextStepLink.href = `#${nextSection.id}`;
    nextStepLabel.textContent = nextSection.dataset[labelKey] || nextSection.id;
    nextStepIndex.textContent = String(currentIndex + 1).padStart(2, "0");
}

function setLanguage(language, persist = true) {
    const next = language === "en" ? "en" : "zh";
    root.dataset.language = next;
    root.lang = next === "zh" ? "zh-Hant" : "en";
    document.title = pageCopy[next].title;
    description?.setAttribute("content", pageCopy[next].description);

    languageButtons.forEach((button) => {
        button.setAttribute("aria-pressed", String(button.dataset.setLanguage === next));
    });
    projectButtons.forEach((button) => {
        const label = next === "en" ? button.dataset.labelEn : button.dataset.labelZh;
        if (label) button.setAttribute("aria-label", label);
    });

    updateNextStep();

    if (persist) {
        try {
            localStorage.setItem("anson-language", next);
        } catch {
            // The language switch still works if storage is unavailable.
        }
    }

    if (window.ScrollTrigger) {
        requestAnimationFrame(() => requestAnimationFrame(() => window.ScrollTrigger.refresh()));
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

function setMethodActive(index) {
    const next = Math.max(0, Math.min(methodFrames.length - 1, index));
    if (activeMethod === next && methodButtons[next]?.getAttribute("aria-current") === "step") return;
    activeMethod = next;

    methodFrames.forEach((frame, frameIndex) => {
        frame.classList.toggle("is-active", frameIndex === next);
    });
    methodButtons.forEach((button, buttonIndex) => {
        if (buttonIndex === next) button.setAttribute("aria-current", "step");
        else button.removeAttribute("aria-current");
    });
    methodCounts.forEach((count) => {
        count.textContent = String(next + 1).padStart(2, "0");
    });
}

function goToMethod(index) {
    const next = Math.max(0, Math.min(methodFrames.length - 1, index));
    if (methodTrigger && window.innerWidth > 800) {
        const progressStops = [0.04, 0.5, 0.96];
        const scrollTop = methodTrigger.start
            + (methodTrigger.end - methodTrigger.start) * progressStops[next];
        window.scrollTo({ top: scrollTop, behavior: "smooth" });
        return;
    }

    methodFrames[next]?.scrollIntoView({ behavior: "smooth", block: "center" });
}

methodButtons.forEach((button, index) => {
    button.addEventListener("click", () => goToMethod(index));
    button.addEventListener("keydown", (event) => {
        const handled = ["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp", "Home", "End"];
        if (!handled.includes(event.key)) return;
        event.preventDefault();

        let next = index;
        if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (index + 1) % methodButtons.length;
        if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (index - 1 + methodButtons.length) % methodButtons.length;
        if (event.key === "Home") next = 0;
        if (event.key === "End") next = methodButtons.length - 1;
        methodButtons[next]?.focus();
        goToMethod(next);
    });
});

function setProjectActive(index) {
    const next = Math.max(0, Math.min(projectPanels.length - 1, index));
    activeProject = next;

    projectButtons.forEach((button, buttonIndex) => {
        if (buttonIndex === next) button.setAttribute("aria-current", "step");
        else button.removeAttribute("aria-current");
    });
    if (projectCount) projectCount.textContent = String(next + 1).padStart(2, "0");
    syncProjectAccessibility();
}

function syncProjectAccessibility() {
    const constrainPanels = Boolean(
        projectTrigger
        && window.innerWidth > 800
        && !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    );

    projectPanels.forEach((panel, panelIndex) => {
        if (constrainPanels) {
            panel.toggleAttribute("inert", panelIndex !== activeProject);
            panel.setAttribute("aria-hidden", String(panelIndex !== activeProject));
        } else {
            panel.removeAttribute("inert");
            panel.removeAttribute("aria-hidden");
        }
    });
}

function goToProject(index) {
    const next = Math.max(0, Math.min(projectPanels.length - 1, index));
    if (projectTrigger && window.innerWidth > 800 && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        const progress = projectPanels.length > 1
            ? Math.min(0.985, next / (projectPanels.length - 1))
            : 0;
        const scrollTop = projectTrigger.start + (projectTrigger.end - projectTrigger.start) * progress;
        window.scrollTo({ top: scrollTop, behavior: "smooth" });
        return;
    }

    projectPanels[next]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "start",
    });
}

projectButtons.forEach((button, index) => {
    button.addEventListener("click", () => goToProject(index));
    button.addEventListener("keydown", (event) => {
        const handled = ["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp", "Home", "End"];
        if (!handled.includes(event.key)) return;
        event.preventDefault();

        let next = index;
        if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (index + 1) % projectButtons.length;
        if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (index - 1 + projectButtons.length) % projectButtons.length;
        if (event.key === "Home") next = 0;
        if (event.key === "End") next = projectButtons.length - 1;
        projectButtons[next]?.focus();
        goToProject(next);
    });
});

projectViewport?.addEventListener(
    "scroll",
    () => {
        if (window.innerWidth > 800 || mobileProjectFrame) return;
        mobileProjectFrame = requestAnimationFrame(() => {
            mobileProjectFrame = 0;
            const panelWidth = projectPanels[0]?.getBoundingClientRect().width || 1;
            const gap = parseFloat(getComputedStyle(projectTrack).gap) || 0;
            setProjectActive(Math.round(projectViewport.scrollLeft / (panelWidth + gap)));
        });
    },
    { passive: true },
);

document.querySelectorAll("[data-open-dialog]").forEach((button) => {
    button.addEventListener("click", () => {
        const dialog = document.getElementById(button.dataset.openDialog);
        if (!(dialog instanceof HTMLDialogElement)) return;
        dialog.showModal();
        body.classList.add("dialog-open");

        if (window.gsap && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            window.gsap.fromTo(
                dialog.querySelector(".dialog-shell"),
                { y: 24, scale: 0.985, autoAlpha: 0 },
                { y: 0, scale: 1, autoAlpha: 1, duration: 0.55, ease: "power3.out" },
            );
        }
    });
});

dialogs.forEach((dialog) => {
    dialog.querySelector("[data-close-dialog]")?.addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", (event) => {
        if (event.target === dialog) dialog.close();
    });
    dialog.addEventListener("close", () => {
        if (!dialogs.some((item) => item.open)) body.classList.remove("dialog-open");
    });
});

document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    const wasMenuOpen = menuButton?.getAttribute("aria-expanded") === "true";
    closeMenu();
    if (wasMenuOpen) menuButton?.focus();
});

function updateActiveSection() {
    const activationLine = window.innerHeight * 0.52;
    let current = sections[0];

    sections.forEach((section) => {
        if (section.getBoundingClientRect().top <= activationLine) current = section;
    });

    if (!current || current.id === activeSectionId) return;
    activeSectionId = current.id;

    navLinks.forEach((link) => {
        if (link.getAttribute("href") === `#${activeSectionId}`) {
            link.setAttribute("aria-current", "true");
        } else {
            link.removeAttribute("aria-current");
        }
    });
    updateNextStep();
}

function setHeaderHidden(hidden) {
    if (headerIsHidden === hidden || !siteHeader) return;
    headerIsHidden = hidden;

    if (window.gsap) {
        window.gsap.to(siteHeader, {
            yPercent: hidden ? -115 : 0,
            duration: hidden ? 0.36 : 0.52,
            ease: "power3.out",
            overwrite: true,
        });
    } else {
        siteHeader.style.transform = hidden ? "translateY(-115%)" : "translateY(0)";
    }
}

function updateScrollState() {
    scrollFrame = 0;
    const currentY = window.scrollY;
    const delta = currentY - lastScrollY;

    if (Math.abs(delta) > 4 && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        if (delta > 0 && currentY > 180 && !body.classList.contains("menu-open")) setHeaderHidden(true);
        if (delta < 0) setHeaderHidden(false);
        lastScrollY = currentY;
    }

    updateActiveSection();
}

window.addEventListener(
    "scroll",
    () => {
        if (scrollFrame) return;
        scrollFrame = requestAnimationFrame(updateScrollState);
    },
    { passive: true },
);

window.addEventListener("resize", () => {
    if (window.innerWidth > 1120) closeMenu();
    updateActiveSection();
});

function createPointerInteractions(gsap) {
    const controller = new AbortController();
    const listenerOptions = { signal: controller.signal };
    const systemField = document.querySelector("[data-system-field]");
    const systemMain = document.querySelector('[data-system-layer="main"]');
    const systemChips = [...document.querySelectorAll('[data-system-layer="chip"]')];

    if (systemField && systemMain) {
        const mainX = gsap.quickTo(systemMain, "x", { duration: 0.7, ease: "power3.out" });
        const mainY = gsap.quickTo(systemMain, "y", { duration: 0.7, ease: "power3.out" });
        const chipMovers = systemChips.map((chip, index) => ({
            x: gsap.quickTo(chip, "x", { duration: 0.55 + index * 0.08, ease: "power3.out" }),
            y: gsap.quickTo(chip, "y", { duration: 0.55 + index * 0.08, ease: "power3.out" }),
            depth: 10 + index * 5,
        }));

        systemField.addEventListener("pointermove", (event) => {
            const rect = systemField.getBoundingClientRect();
            const x = (event.clientX - rect.left) / rect.width - 0.5;
            const y = (event.clientY - rect.top) / rect.height - 0.5;
            mainX(x * -12);
            mainY(y * -12);
            chipMovers.forEach((mover) => {
                mover.x(x * mover.depth);
                mover.y(y * mover.depth);
            });
        }, listenerOptions);

        systemField.addEventListener("pointerleave", () => {
            mainX(0);
            mainY(0);
            chipMovers.forEach((mover) => {
                mover.x(0);
                mover.y(0);
            });
        }, listenerOptions);
    }

    document.querySelectorAll(".magnetic").forEach((element) => {
        const xTo = gsap.quickTo(element, "x", { duration: 0.35, ease: "power3.out" });
        const yTo = gsap.quickTo(element, "y", { duration: 0.35, ease: "power3.out" });

        element.addEventListener("pointermove", (event) => {
            const rect = element.getBoundingClientRect();
            xTo((event.clientX - rect.left - rect.width / 2) * 0.12);
            yTo((event.clientY - rect.top - rect.height / 2) * 0.16);
        }, listenerOptions);
        element.addEventListener("pointerleave", () => {
            xTo(0);
            yTo(0);
        }, listenerOptions);
    });

    document.querySelectorAll("[data-tilt-card]").forEach((card) => {
        const rotateX = gsap.quickTo(card, "rotationX", { duration: 0.55, ease: "power3.out" });
        const rotateY = gsap.quickTo(card, "rotationY", { duration: 0.55, ease: "power3.out" });

        card.addEventListener("pointermove", (event) => {
            const rect = card.getBoundingClientRect();
            const x = (event.clientX - rect.left) / rect.width - 0.5;
            const y = (event.clientY - rect.top) / rect.height - 0.5;
            rotateX(y * -4);
            rotateY(x * 4);
        }, listenerOptions);
        card.addEventListener("pointerleave", () => {
            rotateX(0);
            rotateY(0);
        }, listenerOptions);
    });

    return () => controller.abort();
}

function createHeroMotion(gsap, ScrollTrigger) {
    const intro = gsap.timeline({
        defaults: { ease: "power3.out" },
    });

    intro
        .from("[data-hero-kicker]", { y: 14, autoAlpha: 0, duration: 0.55 })
        .from("[data-hero-line]", {
            yPercent: 115,
            rotation: 1.2,
            duration: 1.05,
            stagger: 0.075,
        }, 0.08)
        .from("[data-hero-support]", { y: 22, autoAlpha: 0, duration: 0.7 }, 0.38)
        .from("[data-hero-system]", { y: 44, rotation: 1.5, autoAlpha: 0, duration: 1.05 }, 0.18)
        .from("[data-system-layer='chip']", {
            y: 18,
            scale: 0.92,
            autoAlpha: 0,
            duration: 0.6,
            stagger: 0.08,
        }, 0.62)
        .from("[data-hero-footer]", { y: 10, autoAlpha: 0, duration: 0.55 }, 0.78);

    gsap.to(".hero-copy", {
        y: -70,
        ease: "none",
        scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: 0.8,
        },
    });

    gsap.to("[data-hero-system]", {
        y: 105,
        rotation: 1.5,
        ease: "none",
        scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: 0.9,
        },
    });
}

function createMethodMotion(gsap, ScrollTrigger) {
    const methodScroll = document.querySelector("[data-method-scroll]");
    const methodPin = document.querySelector("[data-method-pin]");
    if (!methodScroll || !methodPin || methodFrames.length < 3) return;

    gsap.set(methodFrames, { clearProps: "all" });
    gsap.set(methodFrames[0], { autoAlpha: 1, y: 0 });
    gsap.set(methodFrames.slice(1), { autoAlpha: 0, y: 36 });

    const timeline = gsap.timeline({
        scrollTrigger: {
            id: "method-story",
            trigger: methodScroll,
            start: "top top",
            end: () => `+=${Math.max(window.innerHeight * 2.45, 1800)}`,
            pin: methodPin,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => setMethodActive(Math.min(2, Math.floor(self.progress * 3))),
        },
    });

    timeline
        .to({}, { duration: 0.65 })
        .to(methodFrames[0], { autoAlpha: 0, y: -34, duration: 0.28 })
        .fromTo(methodFrames[1], { autoAlpha: 0, y: 36 }, { autoAlpha: 1, y: 0, duration: 0.32 }, "<")
        .to({}, { duration: 0.72 })
        .to(methodFrames[1], { autoAlpha: 0, y: -34, duration: 0.28 })
        .fromTo(methodFrames[2], { autoAlpha: 0, y: 36 }, { autoAlpha: 1, y: 0, duration: 0.32 }, "<")
        .to({}, { duration: 0.65 });

    methodTrigger = timeline.scrollTrigger;
}

function createProjectMotion(gsap, ScrollTrigger) {
    const projectScroll = document.querySelector("[data-project-scroll]");
    const projectPin = document.querySelector("[data-project-pin]");
    if (!projectScroll || !projectPin || !projectTrack || !projectViewport) return;

    const getDistance = () => Math.max(0, projectTrack.scrollWidth - projectViewport.clientWidth);

    projectTween = gsap.to(projectTrack, {
        x: () => -getDistance(),
        ease: "none",
        scrollTrigger: {
            id: "project-reel",
            trigger: projectScroll,
            start: "top top",
            end: () => `+=${Math.max(getDistance(), window.innerWidth * 1.6)}`,
            pin: projectPin,
            scrub: 0.85,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
                setProjectActive(Math.min(projectPanels.length - 1, Math.round(self.progress * (projectPanels.length - 1))));
            },
        },
    });

    projectTrigger = projectTween.scrollTrigger;
    syncProjectAccessibility();

    projectPanels.slice(1).forEach((panel) => {
        const copy = panel.querySelector(".project-copy");
        const visual = panel.querySelector(".project-visual");

        gsap.fromTo(
            copy,
            { x: 55, autoAlpha: 0.32 },
            {
                x: 0,
                autoAlpha: 1,
                ease: "none",
                scrollTrigger: {
                    trigger: panel,
                    containerAnimation: projectTween,
                    start: "left 90%",
                    end: "left 42%",
                    scrub: 0.45,
                },
            },
        );

        gsap.fromTo(
            visual,
            { x: 80, rotation: 2.2, scale: 0.94 },
            {
                x: 0,
                rotation: 0,
                scale: 1,
                ease: "none",
                scrollTrigger: {
                    trigger: panel,
                    containerAnimation: projectTween,
                    start: "left 95%",
                    end: "left 48%",
                    scrub: 0.55,
                },
            },
        );
    });
}

function createRevealMotion(gsap, ScrollTrigger) {
    const revealTargets = [
        ...document.querySelectorAll("[data-reveal]"),
        ...document.querySelectorAll(".section-intro"),
        document.querySelector(".projects-heading"),
    ].filter(Boolean);

    revealTargets.forEach((target) => {
        gsap.from(target, {
            y: 42,
            autoAlpha: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
                trigger: target,
                start: "top 86%",
                toggleActions: "play none none none",
                once: true,
            },
        });
    });

    gsap.from(".footer-main > *", {
        y: 36,
        autoAlpha: 0,
        duration: 0.9,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
            trigger: ".site-footer",
            start: "top 62%",
            toggleActions: "play none none reverse",
        },
    });

    gsap.to(".footer-orbit", {
        rotation: 28,
        y: -60,
        ease: "none",
        scrollTrigger: {
            trigger: ".site-footer",
            start: "top bottom",
            end: "bottom bottom",
            scrub: 1,
        },
    });
}

function initialiseGsap() {
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;

    if (!gsap || !ScrollTrigger) {
        root.classList.add("gsap-unavailable");
        setMethodActive(0);
        setProjectActive(0);
        return;
    }

    gsap.registerPlugin(ScrollTrigger);
    root.classList.add("gsap-ready");
    gsap.defaults({ duration: 0.65, ease: "power3.out" });

    const media = gsap.matchMedia();
    media.add(
        {
            desktop: "(min-width: 801px)",
            pointerFine: "(pointer: fine)",
            reduceMotion: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
            const { desktop, pointerFine, reduceMotion } = context.conditions;
            let removePointerInteractions = null;

            if (!reduceMotion) {
                createHeroMotion(gsap, ScrollTrigger);
                createRevealMotion(gsap, ScrollTrigger);
            }

            if (desktop && !reduceMotion) {
                createMethodMotion(gsap, ScrollTrigger);
                createProjectMotion(gsap, ScrollTrigger);
            } else {
                methodTrigger = null;
                projectTrigger = null;
                projectTween = null;
                gsap.set(methodFrames, { clearProps: "all" });
                gsap.set(projectTrack, { clearProps: "transform" });
            }

            if (pointerFine && !reduceMotion) {
                removePointerInteractions = createPointerInteractions(gsap);
            }

            return () => {
                removePointerInteractions?.();
                methodTrigger = null;
                projectTrigger = null;
                projectTween = null;
                syncProjectAccessibility();
            };
        },
    );

    if (document.fonts?.ready) {
        document.fonts.ready.then(() => ScrollTrigger.refresh());
    } else {
        window.addEventListener("load", () => ScrollTrigger.refresh(), { once: true });
    }
}

const year = document.querySelector("[data-year]");
if (year) year.textContent = String(new Date().getFullYear());

setMethodActive(0);
setProjectActive(0);
updateActiveSection();
updateNextStep();
initialiseGsap();

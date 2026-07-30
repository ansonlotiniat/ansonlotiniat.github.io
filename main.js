const root = document.documentElement;
const menuButton = document.querySelector("[data-menu-button]");
const navigation = document.querySelector("[data-navigation]");
const progress = document.querySelector("[data-progress]");
const languageButtons = [...document.querySelectorAll("[data-set-language]")];
const navLinks = [...document.querySelectorAll(".site-navigation a")];
const sections = [...document.querySelectorAll("main section[id]")];

function closeMenu() {
    menuButton?.setAttribute("aria-expanded", "false");
    navigation?.classList.remove("is-open");
    document.body.classList.remove("menu-open");
}

menuButton?.addEventListener("click", () => {
    const open = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!open));
    navigation?.classList.toggle("is-open", !open);
    document.body.classList.toggle("menu-open", !open);
});

navLinks.forEach((link) => link.addEventListener("click", closeMenu));

document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    const wasOpen = menuButton?.getAttribute("aria-expanded") === "true";
    closeMenu();
    if (wasOpen) menuButton?.focus();
});

window.addEventListener("resize", () => {
    if (window.innerWidth > 864) closeMenu();
});

function setLanguage(language, persist = true) {
    const next = language === "en" ? "en" : "zh";
    root.dataset.language = next;
    root.lang = next === "zh" ? "zh-Hant" : "en";
    languageButtons.forEach((button) => {
        button.setAttribute("aria-pressed", String(button.dataset.setLanguage === next));
    });

    if (!persist) return;
    try {
        localStorage.setItem("anson-language", next);
    } catch {
        // The page still works when browser storage is unavailable.
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

function updateProgress() {
    if (!progress) return;
    const available = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = available > 0 ? Math.min(window.scrollY / available, 1) : 0;
    progress.style.transform = `scaleX(${ratio})`;
}

updateProgress();
window.addEventListener("scroll", updateProgress, { passive: true });
window.addEventListener("resize", updateProgress);

const sectionObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            navLinks.forEach((link) => {
                const active = link.getAttribute("href") === `#${entry.target.id}`;
                if (active) link.setAttribute("aria-current", "true");
                else link.removeAttribute("aria-current");
            });
        });
    },
    { rootMargin: "-38% 0px -56% 0px", threshold: 0 },
);

sections.forEach((section) => sectionObserver.observe(section));

const revealTargets = document.querySelectorAll(
    ".profile-pillars article, .build-item, .record-group, .interest-list li",
);

revealTargets.forEach((element) => element.setAttribute("data-reveal", ""));

if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    revealTargets.forEach((element) => element.classList.add("is-visible"));
} else {
    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            });
        },
        { threshold: 0.1 },
    );

    revealTargets.forEach((element) => revealObserver.observe(element));
}

const year = document.querySelector("[data-year]");
if (year) year.textContent = String(new Date().getFullYear());

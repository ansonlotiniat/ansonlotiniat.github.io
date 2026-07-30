const root = document.documentElement;
const menuButton = document.querySelector("[data-menu-button]");
const navigation = document.querySelector("[data-navigation]");
const languageButtons = [...document.querySelectorAll("[data-set-language]")];
const navLinks = [...document.querySelectorAll(".site-navigation a")];
const sections = [...document.querySelectorAll("main section[id], footer[id]")];
const description = document.querySelector('meta[name="description"]');
const caseTabs = [...document.querySelectorAll("[data-case-tab]")];
const casePanels = [...document.querySelectorAll("[data-case-panel]")];
const dialogs = [...document.querySelectorAll("[data-dialog]")];

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

function closeMenu() {
    menuButton?.setAttribute("aria-expanded", "false");
    navigation?.classList.remove("is-open");
    document.body.classList.remove("menu-open");
}

menuButton?.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isOpen));
    navigation?.classList.toggle("is-open", !isOpen);
    document.body.classList.toggle("menu-open", !isOpen);
});

navLinks.forEach((link) => link.addEventListener("click", closeMenu));

function setLanguage(language, persist = true) {
    const next = language === "en" ? "en" : "zh";
    root.dataset.language = next;
    root.lang = next === "zh" ? "zh-Hant" : "en";
    document.title = pageCopy[next].title;
    description?.setAttribute("content", pageCopy[next].description);

    languageButtons.forEach((button) => {
        button.setAttribute("aria-pressed", String(button.dataset.setLanguage === next));
    });

    if (!persist) return;
    try {
        localStorage.setItem("anson-language", next);
    } catch {
        // The switch still works when storage is unavailable.
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

function selectCase(key, moveFocus = false) {
    caseTabs.forEach((tab) => {
        const isActive = tab.dataset.caseTab === key;
        tab.setAttribute("aria-selected", String(isActive));
        tab.tabIndex = isActive ? 0 : -1;
        if (isActive && moveFocus) tab.focus();
    });

    casePanels.forEach((panel) => {
        panel.hidden = panel.dataset.casePanel !== key;
    });
}

caseTabs.forEach((tab, index) => {
    tab.addEventListener("click", () => selectCase(tab.dataset.caseTab));

    tab.addEventListener("keydown", (event) => {
        const keys = ["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft", "Home", "End"];
        if (!keys.includes(event.key)) return;
        event.preventDefault();

        let nextIndex = index;
        if (event.key === "ArrowDown" || event.key === "ArrowRight") {
            nextIndex = (index + 1) % caseTabs.length;
        }
        if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
            nextIndex = (index - 1 + caseTabs.length) % caseTabs.length;
        }
        if (event.key === "Home") nextIndex = 0;
        if (event.key === "End") nextIndex = caseTabs.length - 1;

        selectCase(caseTabs[nextIndex].dataset.caseTab, true);
    });
});

document.querySelectorAll("[data-open-dialog]").forEach((button) => {
    button.addEventListener("click", () => {
        const dialog = document.getElementById(button.dataset.openDialog);
        if (!(dialog instanceof HTMLDialogElement)) return;
        dialog.showModal();
        document.body.classList.add("dialog-open");
    });
});

dialogs.forEach((dialog) => {
    dialog.querySelector("[data-close-dialog]")?.addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", (event) => {
        if (event.target === dialog) dialog.close();
    });
    dialog.addEventListener("close", () => {
        if (!dialogs.some((item) => item.open)) {
            document.body.classList.remove("dialog-open");
        }
    });
});

document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    const wasMenuOpen = menuButton?.getAttribute("aria-expanded") === "true";
    closeMenu();
    if (wasMenuOpen) menuButton?.focus();
});

window.addEventListener("resize", () => {
    if (window.innerWidth > 992) closeMenu();
});

if ("IntersectionObserver" in window) {
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
}

const revealTargets = document.querySelectorAll(
    ".about-copy, .method-list li, .case-explorer, .publication-card, .now-list > div",
);

revealTargets.forEach((element) => element.setAttribute("data-reveal", ""));

if (
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
    || !("IntersectionObserver" in window)
) {
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
        { threshold: 0.08 },
    );

    revealTargets.forEach((element) => revealObserver.observe(element));
}

const year = document.querySelector("[data-year]");
if (year) year.textContent = String(new Date().getFullYear());

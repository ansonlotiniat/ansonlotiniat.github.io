import { language } from "../shared/i18n.js";
import { pageCopy } from "./copy.js";
export default function initLocale({
    root,
    description,
    exploreInput,
    launchpadInput,
    languageButtons,
    languageToggles,
    refreshDockHoverLabel,
    notifyLanguageChanged,
    clock,
    calendarWeekday,
    calendarDay,
    calendarMonth,
}) {
    function setLanguage(nextLanguage, persist = true) {
        const next = nextLanguage === "en" ? "en" : "zh";
        root.dataset.language = next;
        root.lang = next === "zh" ? "zh-Hant" : "en";
        document.title = pageCopy[next].title;
        description?.setAttribute("content", pageCopy[next].description);

        if (exploreInput) {
            exploreInput.placeholder = pageCopy[next].searchPlaceholder;
            exploreInput.setAttribute("aria-label", pageCopy[next].searchLabel);
        }
        if (launchpadInput) {
            launchpadInput.placeholder = pageCopy[next].launchpadPlaceholder;
            launchpadInput.setAttribute("aria-label", pageCopy[next].launchpadLabel);
        }

        languageButtons.forEach((button) => {
            button.setAttribute("aria-pressed", String(button.dataset.setLanguage === next));
        });
        languageToggles.forEach((button) => {
            button.setAttribute("aria-label", pageCopy[next].switchLanguage);
        });

        document.querySelectorAll("[data-window-action]").forEach((button) => {
            const action = button.dataset.windowAction;
            button.setAttribute("aria-label", pageCopy[next].windowActions[action] || action);
        });

        document.querySelectorAll("[data-dock-label-zh]").forEach((item) => {
            item.setAttribute(
                "aria-label",
                next === "en" ? item.dataset.dockLabelEn : item.dataset.dockLabelZh,
            );
        });
        refreshDockHoverLabel();
        notifyLanguageChanged();

        updateClock();

        if (persist) {
            try {
                localStorage.setItem("anson-language", next);
            } catch {
                // Language remains available when storage is blocked.
            }
        }
    }

    let savedLanguage;
    try {
        savedLanguage = localStorage.getItem("anson-language");
    } catch {
        savedLanguage = null;
    }
    setLanguage(savedLanguage === "en" ? "en" : "zh", false);
    languageButtons.forEach((button) => {
        button.addEventListener("click", () => setLanguage(button.dataset.setLanguage));
    });
    languageToggles.forEach((button) => {
        button.addEventListener("click", () => {
            setLanguage(language() === "zh" ? "en" : "zh");
        });
    });

    function updateClock() {
        if (!clock) return;
        const now = new Date();
        const compact = window.innerWidth <= 560;
        const options = compact
            ? { hour: "numeric", minute: "2-digit", hour12: true }
            : {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
              };
        const locale = language() === "zh" ? "zh-Hant-MO" : "en-US";
        const formatted = new Intl.DateTimeFormat(locale, options).format(now).replaceAll(",", "");
        clock.textContent = formatted;
        clock.dateTime = now.toISOString();

        if (calendarWeekday) {
            calendarWeekday.textContent = new Intl.DateTimeFormat(locale, { weekday: "long" }).format(now);
        }
        if (calendarDay) calendarDay.textContent = String(now.getDate());
        if (calendarMonth) {
            calendarMonth.textContent = new Intl.DateTimeFormat(locale, {
                month: "long",
                year: "numeric",
            }).format(now);
        }
    }

    updateClock();
    window.setInterval(updateClock, 30000);

    return { setLanguage };
}

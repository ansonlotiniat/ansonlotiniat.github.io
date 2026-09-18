export function language() {
    return document.documentElement.dataset.language === "en" ? "en" : "zh";
}

export function localizedSpan(copy) {
    const fragment = document.createDocumentFragment();
    ["zh", "en"].forEach((locale) => {
        const span = document.createElement("span");
        span.dataset.copyLang = locale;
        span.textContent = copy?.[locale] || copy?.en || copy?.zh || "";
        fragment.append(span);
    });
    return fragment;
}

export function announce(message) {
    const announcer = document.querySelector("[data-announcer]");
    if (!announcer) return;
    announcer.textContent = "";
    window.requestAnimationFrame(() => {
        announcer.textContent = message;
    });
}

export function announceOpened(label) {
    announce(`${label} ${language() === "zh" ? "已打開" : "opened"}`);
}

import { language } from "../../shared/i18n.js";
import { setPanelVisibility, animatePanel, hasGsap, reducedMotion } from "../../shared/motion.js";

export default function mount({ root }) {
    const overleafButtons = [...root.querySelectorAll("[data-overleaf-doc]")];
    const overleafSources = [...root.querySelectorAll("[data-overleaf-source]")];
    const overleafPreviews = [...root.querySelectorAll("[data-overleaf-preview]")];
    const overleafSourceTabs = [...root.querySelectorAll("[data-source-tab]")];
    const currentTex = root.querySelector("[data-current-tex]");
    const compileButton = root.querySelector("[data-compile-button]");
    const compileStatus = root.querySelector("[data-compile-status]");
    const compileTime = root.querySelector("[data-compile-time]");
    const bookProof = root.querySelector("[data-book-proof]");
    const proofLens = root.querySelector("[data-proof-lens]");
    let compileState = "done";
    let compileTimer = null;
    function updateCompileCopy() {
        if (!compileStatus) return;
        compileStatus.textContent =
            compileState === "working"
                ? language() === "zh"
                    ? "正在編譯…"
                    : "Compiling…"
                : language() === "zh"
                  ? "PDF 已更新"
                  : "PDF up to date";
    }
    function setOverleafDocument(documentId) {
        overleafButtons.forEach((button) => {
            const active = button.dataset.overleafDoc === documentId;
            button.setAttribute("aria-selected", String(active));
            button.tabIndex = active ? 0 : -1;
        });
        overleafSources.forEach((panel) =>
            setPanelVisibility(panel, panel.dataset.overleafSource === documentId),
        );
        overleafPreviews.forEach((panel) =>
            setPanelVisibility(panel, panel.dataset.overleafPreview === documentId),
        );
        overleafSourceTabs.forEach((tab) =>
            tab.classList.toggle("is-active", tab.dataset.sourceTab === documentId),
        );
        if (currentTex)
            currentTex.textContent = documentId === "diary" ? "macao-diary.tex" : "between-bells.tex";
        animatePanel(
            overleafSources.find((panel) => panel.dataset.overleafSource === documentId),
            { y: 3 },
        );
        animatePanel(
            overleafPreviews.find((panel) => panel.dataset.overleafPreview === documentId),
            { y: 5 },
        );
    }

    overleafButtons.forEach((button) => {
        button.addEventListener("click", () => setOverleafDocument(button.dataset.overleafDoc));
    });

    compileButton?.addEventListener("click", () => {
        if (compileTimer) window.clearTimeout(compileTimer);
        compileState = "working";
        compileButton.classList.add("is-compiling");
        updateCompileCopy();
        if (compileTime) compileTime.textContent = "Compiling…";

        compileTimer = window.setTimeout(
            () => {
                compileState = "done";
                compileButton.classList.remove("is-compiling");
                updateCompileCopy();
                if (compileTime) compileTime.textContent = "Compiled just now";
                if (hasGsap()) {
                    window.gsap.fromTo(
                        overleafPreviews.filter((panel) => !panel.hidden),
                        { autoAlpha: 0.72 },
                        { autoAlpha: 1, duration: 0.28, clearProps: "opacity,visibility" },
                    );
                }
            },
            reducedMotion.matches ? 50 : 720,
        );
    });

    if (bookProof && proofLens) {
        const bookImage = bookProof.querySelector("img");
        bookImage?.addEventListener("pointerenter", (event) => {
            if (event.pointerType === "touch") return;
            bookProof.classList.add("is-inspecting");
        });
        bookImage?.addEventListener("pointerleave", () => {
            bookProof.classList.remove("is-inspecting");
        });
        bookImage?.addEventListener("pointermove", (event) => {
            if (event.pointerType === "touch") return;
            const imageRect = bookImage.getBoundingClientRect();
            const figureRect = bookImage.parentElement.getBoundingClientRect();
            const x = Math.max(0, Math.min(imageRect.width, event.clientX - imageRect.left));
            const y = Math.max(0, Math.min(imageRect.height, event.clientY - imageRect.top));
            const lensRadius = proofLens.offsetWidth / 2;
            const scale = 2.25;
            proofLens.style.left = `${event.clientX - figureRect.left}px`;
            proofLens.style.top = `${event.clientY - figureRect.top}px`;
            proofLens.style.backgroundSize = `${imageRect.width * scale}px ${imageRect.height * scale}px`;
            proofLens.style.backgroundPosition = `${lensRadius - x * scale}px ${lensRadius - y * scale}px`;
        });
    }

    setOverleafDocument("diary");
    updateCompileCopy();

    return { languageChanged: updateCompileCopy };
}

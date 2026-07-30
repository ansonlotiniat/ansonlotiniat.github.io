const root = document.documentElement;
const body = document.body;
const fieldApp = document.querySelector("[data-field-app]");
const fieldMain = document.querySelector(".field-main");
const fieldHeader = document.querySelector(".field-header");
const routeDock = document.querySelector(".route-dock");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const sceneOrder = ["overview", "systems", "voice", "words"];
const scenePanels = [...document.querySelectorAll("[data-scene-panel]")];
const sceneLinks = [...document.querySelectorAll("[data-scene-link]")];
const sceneNumber = document.querySelector("[data-scene-number]");
const sceneName = document.querySelector("[data-scene-name]");
const pulseBars = [...document.querySelectorAll(".scene-pulse i")];
const languageButtons = [...document.querySelectorAll("[data-set-language]")];
const description = document.querySelector('meta[name="description"]');
const mapStage = document.querySelector("[data-map-stage]");

const infoToggle = document.querySelector("[data-info-toggle]");
const infoDrawer = document.querySelector("[data-info-drawer]");
const infoBackdrop = document.querySelector("[data-info-backdrop]");
const infoClose = document.querySelector("[data-info-close]");

const systemButtons = [...document.querySelectorAll("[data-system-tab]")];
const systemPanels = [...document.querySelectorAll("[data-system-panel]")];
const sportsInstrument = document.querySelector("[data-sports-stage]");
const sportsRange = document.querySelector("[data-sports-range]");
const sportsOutput = document.querySelector("[data-sports-output]");
const debateInstrument = document.querySelector("[data-debate-view]");
const debateButtons = [...document.querySelectorAll("[data-debate-mode]")];
const debateCopies = [...document.querySelectorAll("[data-debate-copy]")];
const igemInstrument = document.querySelector("[data-igem-instrument]");
const igemRange = document.querySelector("[data-igem-range]");
const igemOutput = document.querySelector("[data-igem-output]");

const voiceConsole = document.querySelector("[data-voice-console]");
const voiceButtons = [...document.querySelectorAll("[data-voice-step]")].filter((element) => element.matches("button"));
const voiceCopies = [...document.querySelectorAll("[data-voice-copy]")];
const voiceOutput = document.querySelector("[data-voice-output]");

const artifactButtons = [...document.querySelectorAll("[data-artifact-tab]")];
const artifactPanels = [...document.querySelectorAll("[data-artifact-panel]")];
const archiveViewer = document.querySelector("[data-archive-viewer]");
const archiveLens = document.querySelector("[data-archive-lens]");
const poemField = document.querySelector(".poem-field");
const poemButton = document.querySelector("[data-poem-toggle]");

const sceneMeta = {
    overview: { number: "00", name: "OVERVIEW" },
    systems: { number: "01", name: "SYSTEMS" },
    voice: { number: "02", name: "VOICE" },
    words: { number: "03", name: "WORDS" },
};

const pageCopy = {
    zh: {
        title: "Anson Lo — 澳門工作地圖",
        description: "Anson Lo，來自澳門的學生開發者、編輯與演講者。以一個可探索的澳門工作地圖，呈現系統、表達與文字。",
        mapLabel: "可拖曳、使用滾輪縮放及用鍵盤旋轉的澳門三層立體地圖",
        openInfo: "打開個人資料",
        closeInfo: "關閉個人資料",
        sports: ["活動前", "活動中", "在現場"],
    },
    en: {
        title: "Anson Lo — Macao Working Atlas",
        description: "Anson Lo is a student developer, editor, and speaker from Macao, presented through a spatial atlas of systems, voice, and words.",
        mapLabel: "A three-layer relief of Macao that can be dragged, zoomed with the wheel, and rotated by keyboard",
        openInfo: "Open profile notes",
        closeInfo: "Close profile notes",
        sports: ["Before", "Live", "On site"],
    },
};

let activeScene = "overview";
let activeSystem = 0;
let activeArtifact = 0;
let activeVoiceStep = 0;
let activeDebateView = "team";
let sceneTimeline = null;
let transitioning = false;
let queuedScene = null;
let previousFocus = null;
let swipeStart = null;

function language() {
    return root.dataset.language === "en" ? "en" : "zh";
}

function syncInfoLabel() {
    if (!infoToggle) return;
    const open = infoToggle.getAttribute("aria-expanded") === "true";
    infoToggle.setAttribute("aria-label", pageCopy[language()][open ? "closeInfo" : "openInfo"]);
}

function updateSportsStage() {
    if (!sportsRange || !sportsInstrument || !sportsOutput) return;
    const stage = Math.max(0, Math.min(2, Number(sportsRange.value)));
    sportsInstrument.dataset.sportsStage = String(stage);
    sportsOutput.textContent = pageCopy[language()].sports[stage];
}

function setLanguage(nextLanguage, persist = true) {
    const next = nextLanguage === "en" ? "en" : "zh";
    root.dataset.language = next;
    root.lang = next === "zh" ? "zh-Hant" : "en";
    document.title = pageCopy[next].title;
    description?.setAttribute("content", pageCopy[next].description);
    mapStage?.setAttribute("aria-label", pageCopy[next].mapLabel);

    languageButtons.forEach((button) => {
        button.setAttribute("aria-pressed", String(button.dataset.setLanguage === next));
    });

    syncInfoLabel();
    updateSportsStage();

    if (persist) {
        try {
            localStorage.setItem("anson-language", next);
        } catch {
            // The language switch remains functional without storage.
        }
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

function setPanelState(panel, active) {
    panel.classList.toggle("is-active", active);
    panel.setAttribute("aria-hidden", String(!active));
    panel.inert = !active;
}

function sceneTargets(panel) {
    if (panel.dataset.scenePanel === "overview") {
        return [
            panel.querySelector(".identity-block"),
            panel.querySelector(".overview-statement"),
            panel.querySelector(".current-signal"),
            panel.querySelector(".field-instruction"),
        ].filter(Boolean);
    }
    return [panel.querySelector(".scene-surface")].filter(Boolean);
}

function updateSceneControls(scene) {
    const meta = sceneMeta[scene];
    if (sceneNumber) sceneNumber.textContent = meta.number;
    if (sceneName) sceneName.textContent = meta.name;

    sceneLinks.forEach((link) => {
        const selected = link.dataset.sceneLink === scene;
        if (link.matches(".route-dock button, .field-node")) {
            link.setAttribute("aria-pressed", String(selected));
        }
        if (link.matches("a")) {
            if (selected) link.setAttribute("aria-current", "page");
            else link.removeAttribute("aria-current");
        }
    });
}

function writeSceneHistory(scene, mode) {
    if (mode === "none") return;
    const url = scene === "overview"
        ? `${window.location.pathname}${window.location.search}`
        : `#${scene}`;
    const method = mode === "replace" ? "replaceState" : "pushState";
    history[method]({ scene }, "", url);
}

function focusSceneHeading(panel) {
    const heading = panel.querySelector("h1, h2");
    if (!heading) return;
    heading.tabIndex = -1;
    heading.focus({ preventScroll: true });
    heading.addEventListener("blur", () => heading.removeAttribute("tabindex"), { once: true });
}

function finishSceneChange(outgoing, incoming, requestFocus) {
    scenePanels.forEach((panel) => setPanelState(panel, panel === incoming));
    if (window.gsap) {
        window.gsap.set(scenePanels.flatMap(sceneTargets), { clearProps: "all" });
        window.gsap.set(pulseBars, { clearProps: "all" });
    }
    transitioning = false;
    sceneTimeline = null;
    const queued = queuedScene;
    queuedScene = null;
    if (queued) {
        requestAnimationFrame(() => setScene(queued.scene, queued.options));
    } else if (requestFocus) {
        focusSceneHeading(incoming);
    }
}

function setScene(nextScene, options = {}) {
    const next = sceneOrder.includes(nextScene) ? nextScene : "overview";
    const {
        animate = true,
        historyMode = "push",
        focus = false,
    } = options;

    if (transitioning) {
        if (next !== activeScene) queuedScene = { scene: next, options };
        return;
    }

    if (next === activeScene) {
        if (next === activeScene && focus) {
            const panel = scenePanels.find((item) => item.dataset.scenePanel === next);
            if (panel) focusSceneHeading(panel);
        }
        return;
    }

    const previous = activeScene;
    const outgoing = scenePanels.find((panel) => panel.dataset.scenePanel === previous);
    const incoming = scenePanels.find((panel) => panel.dataset.scenePanel === next);
    if (!outgoing || !incoming) return;

    const previousIndex = sceneOrder.indexOf(previous);
    const nextIndex = sceneOrder.indexOf(next);
    const direction = nextIndex >= previousIndex ? 1 : -1;

    activeScene = next;
    fieldApp.dataset.scene = next;
    updateSceneControls(next);
    writeSceneHistory(next, historyMode);
    setPanelState(incoming, true);
    window.dispatchEvent(new CustomEvent("field:scene", { detail: { scene: next, index: nextIndex } }));

    const canAnimate = animate && window.gsap && !reducedMotion.matches;
    if (!canAnimate) {
        finishSceneChange(outgoing, incoming, focus);
        return;
    }

    transitioning = true;
    const outgoingTargets = sceneTargets(outgoing);
    const incomingTargets = sceneTargets(incoming);
    const { gsap } = window;
    gsap.killTweensOf([...outgoingTargets, ...incomingTargets, ...pulseBars]);
    gsap.set(incomingTargets, { autoAlpha: 0, x: direction * 120, scale: 0.96 });
    gsap.set(pulseBars, { scaleY: 0, transformOrigin: direction > 0 ? "bottom" : "top" });

    sceneTimeline = gsap.timeline({
        defaults: { ease: "power3.inOut" },
        onComplete: () => finishSceneChange(outgoing, incoming, focus),
    });
    sceneTimeline
        .to(pulseBars, { scaleY: 1, duration: 0.34, stagger: 0.045 }, 0)
        .to(outgoingTargets, { autoAlpha: 0, x: direction * -65, scale: 0.95, duration: 0.42 }, 0)
        .addLabel("cross", 0.24)
        .to(pulseBars, {
            scaleY: 0,
            transformOrigin: direction > 0 ? "top" : "bottom",
            duration: 0.42,
            stagger: 0.045,
        }, "cross")
        .to(incomingTargets, {
            autoAlpha: 1,
            x: 0,
            scale: 1,
            duration: 0.62,
            ease: "power3.out",
        }, "cross+=0.08");
}

sceneLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
        event.preventDefault();
        setScene(link.dataset.sceneLink, {
            focus: event.detail === 0,
        });
    });
});

function sceneFromLocation() {
    const hash = window.location.hash.slice(1);
    return sceneOrder.includes(hash) ? hash : "overview";
}

window.addEventListener("popstate", () => {
    setScene(sceneFromLocation(), { historyMode: "none", focus: false });
});

function setInitialScene(scene) {
    activeScene = scene;
    fieldApp.dataset.scene = scene;
    scenePanels.forEach((panel) => setPanelState(panel, panel.dataset.scenePanel === scene));
    updateSceneControls(scene);
    window.dispatchEvent(new CustomEvent("field:scene", {
        detail: { scene, index: sceneOrder.indexOf(scene) },
    }));
}
setInitialScene(sceneFromLocation());

function isTypingTarget(target) {
    return target instanceof HTMLElement
        && Boolean(target.closest("input, textarea, select, [contenteditable='true']"));
}

window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        if (!infoDrawer?.hidden) closeInfo();
        else if (activeScene !== "overview") setScene("overview", { focus: true });
        return;
    }

    if (isTypingTarget(event.target) || !infoDrawer?.hidden) return;
    const numericIndex = Number(event.key);
    if (Number.isInteger(numericIndex) && numericIndex >= 0 && numericIndex < sceneOrder.length) {
        event.preventDefault();
        setScene(sceneOrder[numericIndex], { focus: true });
        return;
    }

    if (event.target instanceof HTMLElement && event.target.closest("button, a, [data-map-stage]")) return;
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const nextIndex = (sceneOrder.indexOf(activeScene) + direction + sceneOrder.length) % sceneOrder.length;
    setScene(sceneOrder[nextIndex], { focus: true });
});

fieldMain?.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "mouse" || event.target.closest("button, a, input, [data-map-stage], .instrument, .archive-viewer")) return;
    swipeStart = { id: event.pointerId, x: event.clientX, y: event.clientY };
});

fieldMain?.addEventListener("pointerup", (event) => {
    if (!swipeStart || event.pointerId !== swipeStart.id) return;
    const deltaX = event.clientX - swipeStart.x;
    const deltaY = event.clientY - swipeStart.y;
    swipeStart = null;
    if (Math.abs(deltaX) < 70 || Math.abs(deltaX) < Math.abs(deltaY) * 1.25) return;
    const direction = deltaX < 0 ? 1 : -1;
    const nextIndex = (sceneOrder.indexOf(activeScene) + direction + sceneOrder.length) % sceneOrder.length;
    setScene(sceneOrder[nextIndex]);
});

function drawerFocusable() {
    return [...infoDrawer.querySelectorAll("button, a[href], [tabindex]:not([tabindex='-1'])")]
        .filter((element) => !element.hidden);
}

function openInfo() {
    if (!infoDrawer?.hidden) return;
    previousFocus = document.activeElement;
    infoDrawer.hidden = false;
    infoBackdrop.hidden = false;
    infoToggle?.setAttribute("aria-expanded", "true");
    body.classList.add("drawer-open");
    if (fieldHeader) fieldHeader.inert = true;
    if (fieldMain) fieldMain.inert = true;
    if (routeDock) routeDock.inert = true;
    syncInfoLabel();

    const complete = () => infoClose?.focus({ preventScroll: true });
    if (window.gsap && !reducedMotion.matches) {
        window.gsap
            .timeline({ defaults: { ease: "power3.out" }, onComplete: complete })
            .fromTo(infoBackdrop, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 })
            .fromTo(infoDrawer, { xPercent: 108 }, { xPercent: 0, duration: 0.62 }, 0.06);
    } else {
        complete();
    }
}

function closeInfo() {
    if (!infoDrawer || infoDrawer.hidden) return;
    const complete = () => {
        infoDrawer.hidden = true;
        infoBackdrop.hidden = true;
        infoToggle?.setAttribute("aria-expanded", "false");
        body.classList.remove("drawer-open");
        if (fieldHeader) fieldHeader.inert = false;
        if (fieldMain) fieldMain.inert = false;
        if (routeDock) routeDock.inert = false;
        syncInfoLabel();
        if (previousFocus instanceof HTMLElement) previousFocus.focus({ preventScroll: true });
    };

    if (window.gsap && !reducedMotion.matches) {
        window.gsap
            .timeline({ defaults: { ease: "power3.inOut" }, onComplete: complete })
            .to(infoDrawer, { xPercent: 108, duration: 0.48 })
            .to(infoBackdrop, { autoAlpha: 0, duration: 0.25 }, 0.16)
            .set([infoDrawer, infoBackdrop], { clearProps: "all" });
    } else {
        complete();
    }
}

infoToggle?.addEventListener("click", () => {
    if (infoDrawer.hidden) openInfo();
    else closeInfo();
});
infoClose?.addEventListener("click", closeInfo);
infoBackdrop?.addEventListener("click", closeInfo);
infoDrawer?.addEventListener("keydown", (event) => {
    if (event.key !== "Tab") return;
    const focusable = drawerFocusable();
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
    }
});

function tabIndexFromKey(event, index, length) {
    if (event.key === "Home") return 0;
    if (event.key === "End") return length - 1;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") return (index + 1) % length;
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") return (index - 1 + length) % length;
    return null;
}

function animatePanel(panel) {
    if (!window.gsap || reducedMotion.matches) return;
    const targets = [...panel.children];
    window.gsap.killTweensOf(targets);
    window.gsap.fromTo(
        targets,
        { autoAlpha: 0, x: 28 },
        {
            autoAlpha: 1,
            x: 0,
            duration: 0.52,
            stagger: 0.05,
            ease: "power3.out",
            clearProps: "opacity,visibility,transform",
        },
    );
}

function setSystem(index, moveFocus = false) {
    const next = Math.max(0, Math.min(systemButtons.length - 1, Number(index) || 0));
    activeSystem = next;
    systemButtons.forEach((button, buttonIndex) => {
        const active = buttonIndex === next;
        button.setAttribute("aria-selected", String(active));
        button.tabIndex = active ? 0 : -1;
        if (active && moveFocus) button.focus();
    });
    systemPanels.forEach((panel, panelIndex) => {
        const active = panelIndex === next;
        panel.hidden = !active;
        panel.classList.toggle("is-active", active);
        if (active) animatePanel(panel);
    });
}

systemButtons.forEach((button, index) => {
    button.addEventListener("click", () => setSystem(index));
    button.addEventListener("keydown", (event) => {
        const next = tabIndexFromKey(event, index, systemButtons.length);
        if (next === null) return;
        event.preventDefault();
        setSystem(next, true);
    });
});
setSystem(0);

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
    igemInstrument.style.setProperty("--left-offset", `${(-5 * separation).toFixed(2)}rem`);
    igemInstrument.style.setProperty("--middle-offset", `${(1.7 * separation).toFixed(2)}rem`);
    igemInstrument.style.setProperty("--right-offset", `${(5 * separation).toFixed(2)}rem`);
    igemInstrument.classList.toggle("is-aligned", value >= 86);
    igemOutput.textContent = `${value}% ALIGNED`;
}

igemRange?.addEventListener("input", updateIgemAlignment);
updateIgemAlignment();

const voiceLabels = ["AUDIENCE", "ORDER", "TONE"];
function setVoiceStep(index, moveFocus = false) {
    const next = Math.max(0, Math.min(voiceButtons.length - 1, Number(index) || 0));
    activeVoiceStep = next;
    if (voiceConsole) voiceConsole.dataset.voiceStep = String(next);
    if (voiceOutput) voiceOutput.textContent = voiceLabels[next];
    voiceButtons.forEach((button, buttonIndex) => {
        const active = buttonIndex === next;
        button.setAttribute("aria-pressed", String(active));
        if (active && moveFocus) button.focus();
    });
    voiceCopies.forEach((copy, copyIndex) => {
        copy.hidden = copyIndex !== next;
        if (copyIndex === next) animatePanel(copy);
    });
}

voiceButtons.forEach((button, index) => {
    button.addEventListener("click", () => setVoiceStep(index));
    button.addEventListener("keydown", (event) => {
        const next = tabIndexFromKey(event, index, voiceButtons.length);
        if (next === null) return;
        event.preventDefault();
        setVoiceStep(next, true);
    });
});
setVoiceStep(0);

function setArtifact(index, moveFocus = false) {
    const next = Math.max(0, Math.min(artifactButtons.length - 1, Number(index) || 0));
    activeArtifact = next;
    artifactButtons.forEach((button, buttonIndex) => {
        const active = buttonIndex === next;
        button.setAttribute("aria-selected", String(active));
        button.tabIndex = active ? 0 : -1;
        if (active && moveFocus) button.focus();
    });
    artifactPanels.forEach((panel, panelIndex) => {
        const active = panelIndex === next;
        panel.hidden = !active;
        panel.classList.toggle("is-active", active);
        if (active) animatePanel(panel);
    });
}

artifactButtons.forEach((button, index) => {
    button.addEventListener("click", () => setArtifact(index));
    button.addEventListener("keydown", (event) => {
        const next = tabIndexFromKey(event, index, artifactButtons.length);
        if (next === null) return;
        event.preventDefault();
        setArtifact(next, true);
    });
});
setArtifact(0);

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
    poemField?.classList.toggle("is-ringing", expanded);
});

function initialiseEntrance() {
    if (!window.gsap || reducedMotion.matches) return;
    const { gsap } = window;
    const initialPanel = scenePanels.find((panel) => panel.dataset.scenePanel === activeScene);
    const routeButtons = document.querySelectorAll(".route-dock button");

    if (activeScene === "overview") {
        gsap.timeline({ defaults: { ease: "power3.out" } })
            .fromTo(".identity-block .micro-label", { autoAlpha: 0, x: -24 }, { autoAlpha: 1, x: 0, duration: 0.55 })
            .fromTo(".identity-block h1 span", { autoAlpha: 0, x: -80 }, { autoAlpha: 1, x: 0, duration: 0.85, stagger: 0.08 }, 0.08)
            .fromTo(".overview-statement", { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: 0.7 }, 0.35)
            .fromTo(".current-signal", { autoAlpha: 0, x: 35, rotation: 5 }, { autoAlpha: 1, x: 0, rotation: 1.5, duration: 0.7 }, 0.38)
            .fromTo(".field-node", { autoAlpha: 0, scale: 0.7 }, { autoAlpha: 1, scale: 1, duration: 0.58, stagger: 0.1 }, 0.5)
            .fromTo(routeButtons, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.045 }, 0.55);
    } else if (initialPanel) {
        gsap.fromTo(sceneTargets(initialPanel), { autoAlpha: 0, x: 80 }, { autoAlpha: 1, x: 0, duration: 0.75, ease: "power3.out" });
    }
}

window.addEventListener("map:ready", () => {
    window.dispatchEvent(new CustomEvent("field:scene", {
        detail: { scene: activeScene, index: sceneOrder.indexOf(activeScene) },
    }));
});

initialiseEntrance();
const year = document.querySelector("[data-year]");
if (year) year.textContent = String(new Date().getFullYear());

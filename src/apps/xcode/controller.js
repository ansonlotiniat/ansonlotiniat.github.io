import { setPanelVisibility, animatePanel } from "../../shared/motion.js";

export default function mount({ root }) {
    const xcodeButtons = [...root.querySelectorAll("[data-xcode-file]")];
    const xcodePanels = [...root.querySelectorAll("[data-xcode-panel]")];
    const xcodeInspectors = [...root.querySelectorAll("[data-xcode-inspector]")];
    const sportsPreview = root.querySelector("[data-sports-preview]");
    const sportsPhaseButtons = [...root.querySelectorAll("[data-sports-phase]")];
    const sportsCopies = [...root.querySelectorAll("[data-sports-copy]")];
    const debatePreview = root.querySelector("[data-debate-preview]");
    const debateRoleButtons = [...root.querySelectorAll("[data-debate-role]")];
    const debateCopies = [...root.querySelectorAll("[data-debate-copy]")];
    function setXcodeProject(project) {
        xcodeButtons.forEach((button) => {
            button.setAttribute("aria-selected", String(button.dataset.xcodeFile === project));
            button.tabIndex = button.dataset.xcodeFile === project ? 0 : -1;
        });
        xcodePanels.forEach((panel) => setPanelVisibility(panel, panel.dataset.xcodePanel === project));
        xcodeInspectors.forEach((panel) =>
            setPanelVisibility(panel, panel.dataset.xcodeInspector === project),
        );
        animatePanel(xcodePanels.find((panel) => panel.dataset.xcodePanel === project));
        animatePanel(
            xcodeInspectors.find((panel) => panel.dataset.xcodeInspector === project),
            { y: 4 },
        );
    }

    xcodeButtons.forEach((button) => {
        button.addEventListener("click", () => setXcodeProject(button.dataset.xcodeFile));
        button.addEventListener("keydown", (event) => {
            if (!["ArrowDown", "ArrowUp", "ArrowRight", "ArrowLeft"].includes(event.key)) return;
            event.preventDefault();
            const index = xcodeButtons.indexOf(button);
            const delta = event.key === "ArrowDown" || event.key === "ArrowRight" ? 1 : -1;
            xcodeButtons[(index + delta + xcodeButtons.length) % xcodeButtons.length].click();
            xcodeButtons[(index + delta + xcodeButtons.length) % xcodeButtons.length].focus();
        });
    });

    function setSportsPhase(phase) {
        if (sportsPreview) sportsPreview.dataset.sportsPreview = phase;
        sportsPhaseButtons.forEach((button) => {
            button.setAttribute("aria-pressed", String(button.dataset.sportsPhase === phase));
        });
        sportsCopies.forEach((copy) => setPanelVisibility(copy, copy.dataset.sportsCopy === phase));
        animatePanel(
            sportsCopies.find((copy) => copy.dataset.sportsCopy === phase),
            { y: 7 },
        );
    }

    sportsPhaseButtons.forEach((button) => {
        button.addEventListener("click", () => setSportsPhase(button.dataset.sportsPhase));
    });

    function setDebateRole(role) {
        if (debatePreview) debatePreview.dataset.debatePreview = role;
        debateRoleButtons.forEach((button) => {
            button.setAttribute("aria-pressed", String(button.dataset.debateRole === role));
        });
        debateCopies.forEach((copy) => setPanelVisibility(copy, copy.dataset.debateCopy === role));
        animatePanel(
            debateCopies.find((copy) => copy.dataset.debateCopy === role),
            { y: 5 },
        );
    }

    debateRoleButtons.forEach((button) => {
        button.addEventListener("click", () => setDebateRole(button.dataset.debateRole));
    });

    setXcodeProject("sports");
    setSportsPhase("before");
    setDebateRole("team");
}

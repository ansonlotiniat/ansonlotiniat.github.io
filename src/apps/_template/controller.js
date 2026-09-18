import { language } from "../../shared/i18n.js";

// Called once per page, after the shell has set the initial language.
export default function mount({ root }) {
    const action = root.querySelector("[data-__APP_ID__-action]");
    const status = root.querySelector("[data-__APP_ID__-status]");
    let clicks = 0;
    function render() {
        status.textContent = language() === "zh" ? `已點擊 ${clicks} 次` : `Clicked ${clicks} times`;
    }
    action.addEventListener("click", () => {
        clicks += 1;
        render();
    });
    render();
    // Optional hooks: open(), close(), minimize(), languageChanged().
    // Keep state on close; reopen does not mount again or duplicate listeners.
    return { languageChanged: render };
}

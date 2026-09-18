import { localizedSpan } from "../shared/i18n.js";

export default function renderLaunchers({ shellIcons, appManifest }) {
    function appIcon(definition, className) {
        const icon = document.createElement("span");
        icon.className = `${className} launcher-icon ${definition.className}`;
        icon.setAttribute("aria-hidden", "true");

        const plate = document.createElement("span");
        plate.className = "launcher-plate";
        plate.style.setProperty("--icon-background", definition.background);
        if (definition.symbol) {
            plate.classList.add("launcher-plate-symbol");
        } else {
            const { canvas, x, y, size } = definition.crop;
            plate.style.setProperty("--icon-image-scale", canvas / size);
            plate.style.setProperty("--icon-image-x", `${(-x / size) * 100}%`);
            plate.style.setProperty("--icon-image-y", `${(-y / size) * 100}%`);
        }
        const image = document.createElement("img");
        image.src = definition.src;
        image.alt = "";
        image.width = 64;
        image.height = 64;
        plate.append(image);
        icon.append(plate);
        return icon;
    }

    function dockVisual(icon, indicator = null) {
        const visual = document.createElement("span");
        visual.className = "dock-visual";
        visual.setAttribute("aria-hidden", "true");
        visual.append(icon);
        if (indicator) visual.append(indicator);
        return visual;
    }

    function setDockItemLabel(item, copy) {
        const zh = copy?.zh || copy?.en || "";
        const en = copy?.en || copy?.zh || "";
        item.dataset.dockLabelZh = zh;
        item.dataset.dockLabelEn = en;
        item.setAttribute("aria-label", en);
    }

    function appsLauncher() {
        const launcher = document.createElement("button");
        launcher.type = "button";
        launcher.className = "dock-item dock-apps-item";
        launcher.dataset.openLaunchpad = "";
        launcher.dataset.dockExplore = "";
        launcher.setAttribute("aria-haspopup", "dialog");
        launcher.setAttribute("aria-controls", "launchpad");
        setDockItemLabel(launcher, { zh: "Apps", en: "Apps" });

        const icon = appIcon(shellIcons.apps, "dock-icon");

        launcher.append(dockVisual(icon));
        return launcher;
    }

    function renderLaunchers() {
        const exploreContainer = document.querySelector("[data-explore-results]");
        const launchpadContainer = document.querySelector("[data-launchpad-results]");
        const dockContainer = document.querySelector("[data-dock]");

        appManifest.forEach((app, index) => {
            if (exploreContainer) {
                const result = document.createElement("button");
                result.type = "button";
                result.setAttribute("role", "option");
                result.setAttribute("aria-selected", String(index === 0));
                result.classList.toggle("is-selected", index === 0);
                result.dataset.exploreResult = "";
                result.dataset.openApp = app.id;
                result.dataset.keywords = app.keywords;
                result.append(appIcon(app.icon, "app-icon"));

                const copy = document.createElement("span");
                copy.className = "result-copy";
                const title = document.createElement("b");
                title.append(localizedSpan(app.title));
                const subtitle = document.createElement("small");
                subtitle.append(localizedSpan(app.subtitle));
                copy.append(title, subtitle);

                const label = document.createElement("span");
                label.className = "result-app";
                label.textContent = app.appLabel;

                const shortcut = document.createElement("kbd");
                shortcut.textContent = app.shortcut === null ? "" : `⌥${app.shortcut}`;
                shortcut.hidden = app.shortcut === null;
                result.append(copy, label, shortcut);
                exploreContainer.append(result);
            }

            if (launchpadContainer) {
                const launcher = document.createElement("button");
                launcher.type = "button";
                launcher.className = "launchpad-app";
                launcher.dataset.openApp = app.id;
                launcher.dataset.launchpadKeywords = `${app.keywords} ${app.appLabel}`;
                launcher.append(appIcon(app.icon, "launchpad-icon"));

                const title = document.createElement("strong");
                title.textContent = app.appLabel;
                launcher.append(title);
                launchpadContainer.append(launcher);
            }

            if (dockContainer) {
                const launcher = document.createElement("button");
                launcher.type = "button";
                launcher.className = "dock-item";
                launcher.dataset.openApp = app.id;
                launcher.dataset.dockApp = app.id;
                setDockItemLabel(launcher, app.dockLabel);

                const indicator = document.createElement("span");
                indicator.className = "dock-indicator";
                indicator.setAttribute("aria-hidden", "true");
                launcher.append(dockVisual(appIcon(app.icon, "dock-icon"), indicator));
                dockContainer.append(launcher);

                if (app.id === "about") {
                    dockContainer.append(appsLauncher());
                }
            }
        });

        if (dockContainer) {
            const mail = document.createElement("a");
            mail.className = "dock-item dock-link";
            mail.href = "mailto:ansonlotiniat@gmail.com";
            setDockItemLabel(mail, { zh: "Mail", en: "Mail" });
            const icon = appIcon(shellIcons.mail, "dock-icon");
            mail.append(dockVisual(icon));
            dockContainer.append(mail);
            dockContainer
                .closest(".dock")
                .style.setProperty("--dock-item-count", String(dockContainer.children.length));
        }
    }

    renderLaunchers();
}

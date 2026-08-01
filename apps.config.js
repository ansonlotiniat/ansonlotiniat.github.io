(function registerAnsonApps() {
    "use strict";

    /*
     * This is the single launcher registry. Dock items, Explore results,
     * labels, search terms, and Option-number shortcuts are generated here.
     * See APP_MAINTENANCE.md before adding or renaming an app.
     */
    const apps = [
        {
            id: "about",
            appLabel: "Finder",
            group: "system",
            shortcut: "0",
            icon: {
                src: "assets/app-icons/finder.png",
                className: "finder-icon",
            },
            title: {
                zh: "建設中建設中建設中建設中",
                en: "建設中建設中建設中建設中",
            },
            subtitle: {
                zh: "建設中建設中建設中建設中",
                en: "建設中建設中建設中建設中",
            },
            dockLabel: {
                zh: "Finder — 建設中建設中建設中建設中",
                en: "Finder — 建設中建設中建設中建設中",
            },
            keywords: "建設中建設中建設中建設中 about profile",
        },
        {
            id: "xcode",
            appLabel: "Xcode",
            group: "work",
            shortcut: "1",
            icon: {
                src: "assets/app-icons/xcode.png",
                className: "xcode-icon",
            },
            title: {
                zh: "建設中建設中建設中建設中",
                en: "建設中建設中建設中建設中",
            },
            subtitle: {
                zh: "建設中建設中建設中建設中",
                en: "建設中建設中建設中建設中",
            },
            dockLabel: {
                zh: "Xcode — 建設中建設中建設中建設中",
                en: "Xcode — 建設中建設中建設中建設中",
            },
            keywords: "建設中建設中建設中建設中 engineering",
        },
        {
            id: "vscode",
            appLabel: "Visual Studio Code",
            group: "work",
            shortcut: "2",
            icon: {
                src: "assets/app-icons/visual-studio-code.png",
                className: "vscode-icon",
            },
            title: {
                zh: "建設中建設中建設中建設中",
                en: "建設中建設中建設中建設中",
            },
            subtitle: {
                zh: "建設中建設中建設中建設中",
                en: "建設中建設中建設中建設中",
            },
            dockLabel: {
                zh: "Visual Studio Code — 建設中建設中建設中建設中",
                en: "Visual Studio Code — 建設中建設中建設中建設中",
            },
            keywords: "建設中建設中建設中建設中 igem",
        },
        {
            id: "overleaf",
            appLabel: "Overleaf",
            group: "work",
            shortcut: "3",
            icon: {
                src: "assets/app-icons/overleaf.svg",
                className: "overleaf-icon",
            },
            title: {
                zh: "建設中建設中建設中建設中",
                en: "建設中建設中建設中建設中",
            },
            subtitle: {
                zh: "建設中建設中建設中建設中",
                en: "建設中建設中建設中建設中",
            },
            dockLabel: {
                zh: "Overleaf — 建設中建設中建設中建設中",
                en: "Overleaf — 建設中建設中建設中建設中",
            },
            keywords: "建設中建設中建設中建設中 writing",
        },
    ];

    window.ANSON_APP_MANIFEST = Object.freeze(
        apps.map((app) => Object.freeze({
            ...app,
            icon: Object.freeze({ ...app.icon }),
            title: Object.freeze({ ...app.title }),
            subtitle: Object.freeze({ ...app.subtitle }),
            dockLabel: Object.freeze({ ...app.dockLabel }),
        })),
    );
})();

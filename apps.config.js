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
                zh: "關於 Anson",
                en: "About Anson",
            },
            subtitle: {
                zh: "身份、工作方式與聯絡",
                en: "Identity, method, and contact",
            },
            dockLabel: {
                zh: "Finder — 關於 Anson",
                en: "Finder — About Anson",
            },
            keywords: "anson about profile macao 羅天逸 關於 澳門 學生 developer editor speaker",
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
                zh: "工程系統",
                en: "Engineering Systems",
            },
            subtitle: {
                zh: "校運會與辯論工作流",
                en: "Sports day and debate workflows",
            },
            dockLabel: {
                zh: "Xcode — 工程",
                en: "Xcode — Engineering",
            },
            keywords: "xcode engineering sports day debate system 工程 校運會 辯論 系統 swift",
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
                zh: "iGEM 2026",
                en: "iGEM 2026",
            },
            subtitle: {
                zh: "軟件、建模與 Wiki 交付鏈",
                en: "Software, modelling, and wiki delivery",
            },
            dockLabel: {
                zh: "Visual Studio Code — iGEM",
                en: "Visual Studio Code — iGEM",
            },
            keywords: "visual studio code vscode igem 2026 software modelling wiki 軟件 建模",
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
                zh: "寫作與編輯",
                en: "Writing & Editing",
            },
            subtitle: {
                zh: "《澳門日記》與英文詩",
                en: "Macao Diary and English poetry",
            },
            dockLabel: {
                zh: "Overleaf — 寫作",
                en: "Overleaf — Writing",
            },
            keywords: "overleaf writing editing poetry book macao diary 文字 寫作 編輯 詩 澳門日記",
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

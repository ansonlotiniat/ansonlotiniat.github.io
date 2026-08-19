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
                zh: "Finder",
                en: "Finder",
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
                zh: "Xcode",
                en: "Xcode",
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
                zh: "Visual Studio Code",
                en: "Visual Studio Code",
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
                zh: "Overleaf",
                en: "Overleaf",
            },
            keywords: "建設中建設中建設中建設中 writing",
        },
        {
            id: "goodnotes",
            appLabel: "Goodnotes",
            group: "study",
            shortcut: "4",
            icon: {
                src: "assets/app-icons/goodnotes.png",
                className: "goodnotes-icon",
            },
            title: {
                zh: "數學、物理與化學筆記",
                en: "Maths, Physics & Chemistry Notes",
            },
            subtitle: {
                zh: "整理課堂重點、公式與練習",
                en: "Class notes, formulae, and practice",
            },
            dockLabel: {
                zh: "Goodnotes",
                en: "Goodnotes",
            },
            keywords: "goodnotes notes study mathematics maths physics chemistry 筆記 數學 物理 化學",
        },
        {
            id: "books",
            appLabel: "Books",
            group: "reading",
            shortcut: "5",
            icon: {
                src: "assets/app-icons/books.png",
                className: "books-icon",
            },
            title: {
                zh: "目前閱讀",
                en: "Currently Reading",
            },
            subtitle: {
                zh: "Apple Books 書庫與閱讀進度",
                en: "Apple Books library and reading progress",
            },
            dockLabel: {
                zh: "Books",
                en: "Books",
            },
            keywords: "books apple books reading library ebook 閱讀 書籍 書庫 currently reading",
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

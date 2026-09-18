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
                crop: { canvas: 256, x: 26, y: 26, size: 204 },
                background: "#1aafff",
            },
            title: {
                zh: "關於我",
                en: "About Me",
            },
            subtitle: {
                zh: "我是誰，最近在做甚麼",
                en: "Who I am and what I'm working on",
            },
            dockLabel: {
                zh: "Finder",
                en: "Finder",
            },
            keywords: "anson 羅天逸 about me profile 澳門 macao student 學生",
        },
        {
            id: "xcode",
            appLabel: "Xcode",
            group: "work",
            shortcut: "1",
            icon: {
                src: "assets/app-icons/xcode.png",
                className: "xcode-icon",
                crop: { canvas: 256, x: 26, y: 26, size: 204 },
                background: "#1a9cf4",
            },
            title: {
                zh: "學校項目",
                en: "School Projects",
            },
            subtitle: {
                zh: "校運會網站和辯論管理工具",
                en: "Sports day and debate tools",
            },
            dockLabel: {
                zh: "Xcode",
                en: "Xcode",
            },
            keywords: "xcode engineering sports day debate school 校運會 辯論 工程 項目",
        },
        {
            id: "vscode",
            appLabel: "Visual Studio Code",
            group: "work",
            shortcut: "2",
            icon: {
                src: "assets/app-icons/visual-studio-code.png",
                className: "vscode-icon",
                crop: { canvas: 512, x: 51, y: 51, size: 410 },
                background: "#ffffff",
            },
            title: {
                zh: "程式碼",
                en: "Code",
            },
            subtitle: {
                zh: "算法、開源項目和這個網站",
                en: "Algorithms, open source, and this site",
            },
            dockLabel: {
                zh: "Visual Studio Code",
                en: "Visual Studio Code",
            },
            keywords: "visual studio code vscode code source algorithm open source igem 程式碼 算法 開源",
        },
        {
            id: "overleaf",
            appLabel: "Overleaf",
            group: "work",
            shortcut: "3",
            icon: {
                src: "assets/app-icons/overleaf.svg",
                className: "overleaf-icon",
                symbol: true,
                background: "radial-gradient(circle at 28% 12%, #fff, transparent 43%), linear-gradient(150deg, #f5faf3, #b3d6ac)",
            },
            title: {
                zh: "寫過的東西",
                en: "Things I've Written",
            },
            subtitle: {
                zh: "《澳門日記》和一首英文詩",
                en: "Macao Diary and an English poem",
            },
            dockLabel: {
                zh: "Overleaf",
                en: "Overleaf",
            },
            keywords: "overleaf writing editing poetry macao diary 寫作 編輯 英文詩 澳門日記",
        },
        {
            id: "goodnotes",
            appLabel: "Goodnotes",
            group: "study",
            shortcut: "4",
            icon: {
                src: "assets/app-icons/goodnotes.png",
                className: "goodnotes-icon",
                crop: { canvas: 256, x: 25, y: 25, size: 206 },
                background: "#ffffff",
            },
            title: {
                zh: "課堂筆記",
                en: "Class Notes",
            },
            subtitle: {
                zh: "數學、物理和化學",
                en: "Maths, physics, and chemistry",
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
                crop: { canvas: 256, x: 26, y: 26, size: 204 },
                background: "#ff9415",
            },
            title: {
                zh: "最近在讀",
                en: "What I'm Reading",
            },
            subtitle: {
                zh: "我的 Apple Books 書架",
                en: "My Apple Books shelf",
            },
            dockLabel: {
                zh: "Books",
                en: "Books",
            },
            keywords: "books apple books reading library ebook 閱讀 書籍 書庫 currently reading",
        },
        {
            id: "netflix",
            appLabel: "Netflix",
            group: "watching",
            shortcut: "6",
            icon: {
                src: "assets/app-icons/netflix.png?v=20260823-appstore",
                className: "netflix-icon",
                crop: { canvas: 512, x: 0, y: 0, size: 512 },
                background: "#080808",
            },
            title: {
                zh: "我的片單",
                en: "My List",
            },
            subtitle: {
                zh: "想看和正在看的電影、影集",
                en: "Films and series I'm watching or saving",
            },
            dockLabel: {
                zh: "Netflix",
                en: "Netflix",
            },
            keywords: "netflix watching films movies series my list 片單 電影 影集 media",
        },
        {
            id: "music",
            appLabel: "Music",
            group: "listening",
            shortcut: "7",
            icon: {
                src: "assets/app-icons/apple-music.png",
                className: "apple-music-icon",
                crop: { canvas: 256, x: 25, y: 25, size: 206 },
                background: "#fc3159",
            },
            title: {
                zh: "常聽的音樂",
                en: "Music I Come Back To",
            },
            subtitle: {
                zh: "歌單裡的專輯和歌曲",
                en: "Albums and songs in my list",
            },
            dockLabel: {
                zh: "Music",
                en: "Music",
            },
            keywords: "apple music albums songs listening favourites 音樂 專輯 歌曲 media",
        },
    ];

    window.ANSON_SHELL_ICONS = Object.freeze({
        apps: Object.freeze({
            src: "assets/app-icons/apps.png",
            className: "apps-icon",
            crop: Object.freeze({ canvas: 256, x: 26, y: 26, size: 204 }),
            background: "#f5f5f5",
        }),
        mail: Object.freeze({
            src: "assets/app-icons/mail.png",
            className: "mail-icon",
            crop: Object.freeze({ canvas: 256, x: 25, y: 25, size: 206 }),
            background: "#16adf9",
        }),
    });

    window.ANSON_APP_MANIFEST = Object.freeze(
        apps.map((app) => Object.freeze({
            ...app,
            icon: Object.freeze({
                ...app.icon,
                ...(app.icon.crop ? { crop: Object.freeze({ ...app.icon.crop }) } : {}),
            }),
            title: Object.freeze({ ...app.title }),
            subtitle: Object.freeze({ ...app.subtitle }),
            dockLabel: Object.freeze({ ...app.dockLabel }),
        })),
    );
})();

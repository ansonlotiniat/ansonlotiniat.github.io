import { language, localizedSpan, announceOpened } from "../../shared/i18n.js";
import { reducedMotion, setPanelVisibility, animatePanel } from "../../shared/motion.js";
import * as content from "./content.js";
export default function mount({ root }) {
    const {
        goodnotesSubjectCopy,
        gnBi,
        gnSection,
        gnPage,
        goodnotesLibraryTitleCopy,
        goodnotesSketches,
        goodnotesKindCopy,
        goodnotesFeedbackCopy,
        createDocuments,
    } = content;
    const goodnotesWindow = root;
    const goodnotesViews = [...root.querySelectorAll("[data-gn-view]")];
    const goodnotesGrid = root.querySelector("[data-gn-document-grid]");
    const goodnotesItemsGrid = root.querySelector("[data-gn-items-grid]");
    const goodnotesSearchResults = root.querySelector("[data-gn-search-results]");
    const goodnotesSearchEmpty = root.querySelector("[data-gn-search-empty]");
    const goodnotesSearchScreen = root.querySelector("[data-gn-search-screen]");
    const goodnotesSearchRecents = root.querySelector("[data-gn-search-recents]");
    const goodnotesSearch = root.querySelector("[data-gn-search]");
    const goodnotesEmpty = root.querySelector("[data-gn-empty]");
    const goodnotesToast = root.querySelector("[data-gn-toast]");
    const goodnotesLibraryMain = root.querySelector("[data-gn-library-main]");
    const goodnotesCompactHeader = root.querySelector("[data-gn-compact-header]");
    const goodnotesLibraryTitles = [...root.querySelectorAll("[data-gn-library-title]")];
    const goodnotesLayoutIcon = root.querySelector("[data-gn-layout-icon]");
    const goodnotesFilterMenu = root.querySelector("[data-gn-filter-menu]");
    const goodnotesViewMenu = root.querySelector("[data-gn-view-menu]");
    const goodnotesNewMenu = root.querySelector("[data-gn-new-menu]");
    const goodnotesDocumentMenu = root.querySelector("[data-gn-document-menu]");
    const goodnotesPageStrip = root.querySelector("[data-gn-page-strip]");
    const goodnotesPageGrid = root.querySelector(".gn-page-grid");
    const goodnotesPageFilter = root.querySelector(".gn-page-filter");
    const goodnotesPageEmpty = root.querySelector("[data-gn-page-empty]");
    const goodnotesPageStatusZh = root.querySelector("[data-gn-page-status-zh]");
    const goodnotesPageStatusEn = root.querySelector("[data-gn-page-status-en]");
    const goodnotesEditTools = root.querySelector("[data-gn-edit-tools]");
    const goodnotesFilterButtons = [...root.querySelectorAll("[data-gn-filter]")];
    const goodnotesFolderButtons = [...root.querySelectorAll("[data-gn-folder]")];
    const goodnotesLibraryButtons = [
        ...root.querySelectorAll("[data-gn-library-button], [data-gn-close-tab]"),
    ];
    const goodnotesToolButtons = [...root.querySelectorAll("[data-gn-tool]")];
    const goodnotesEditorTitle = root.querySelector("[data-gn-editor-title]");
    const goodnotesPageSubject = root.querySelector("[data-gn-page-subject]");
    const goodnotesPageTitle = root.querySelector("[data-gn-page-title]");
    const goodnotesPageDate = root.querySelector("[data-gn-page-date]");
    const goodnotesPaper = root.querySelector("[data-gn-paper]");
    const goodnotesNoteContent = root.querySelector("[data-gn-note-content]");

    let goodnotesDocuments = createDocuments();

    let goodnotesFilter = "all";
    let goodnotesQuery = "";
    let goodnotesKind = "all";
    let goodnotesLayout = "grid";
    let goodnotesCurrentDocument = "calculus";
    let goodnotesSortAlphabetically = false;
    let goodnotesToastTimer = null;
    let goodnotesMenuDocument = null;
    let goodnotesDraftSequence = 0;
    let goodnotesCurrentPage = 1;
    let goodnotesPageCount = 5;

    function goodnotesText(copy) {
        return copy?.[language()] || copy?.en || copy?.zh || "";
    }

    function updateGoodnotesLibraryTitle() {
        const copy = goodnotesLibraryTitleCopy[goodnotesFilter] || goodnotesLibraryTitleCopy.all;
        goodnotesLibraryTitles.forEach((title) => title.replaceChildren(localizedSpan(copy)));
    }

    function updateGoodnotesPageStatus() {
        if (goodnotesPageStatusZh)
            goodnotesPageStatusZh.textContent = `第${goodnotesCurrentPage}頁，共${goodnotesPageCount}頁`;
        if (goodnotesPageStatusEn)
            goodnotesPageStatusEn.textContent = `Page ${goodnotesCurrentPage} of ${goodnotesPageCount}`;
        const footer = goodnotesPaper?.querySelector("footer");
        if (footer) footer.textContent = String(goodnotesCurrentPage);
    }

    function createGoodnotesPageButton(
        pageNumber,
        documentItem = goodnotesDocuments.find((item) => item.id === goodnotesCurrentDocument),
    ) {
        const button = document.createElement("button");
        button.type = "button";
        button.dataset.gnPageNumber = String(pageNumber);
        button.dataset.subject = documentItem?.subject || "math";
        const page = goodnotesPageData(documentItem, pageNumber);
        button.setAttribute(
            "aria-label",
            `${language() === "zh" ? "第" : "Page "}${pageNumber}${language() === "zh" ? "頁" : ""}: ${goodnotesText(page?.title)}`,
        );
        button.classList.toggle("is-active", pageNumber === goodnotesCurrentPage);

        const preview = document.createElement("span");
        const previewNames = ["one", "two", "three", "four", "five"];
        preview.className = `gn-mini-paper is-${previewNames[(pageNumber - 1) % previewNames.length]}`;
        const miniTitle = document.createElement("b");
        miniTitle.textContent = goodnotesText(page?.title);
        preview.append(
            miniTitle,
            document.createElement("i"),
            document.createElement("i"),
            document.createElement("i"),
        );

        const number = document.createElement("small");
        number.textContent = String(pageNumber);
        button.append(preview, number);
        bindGoodnotesPageButton(button);
        return button;
    }

    function syncGoodnotesPageGrid(documentItem) {
        if (!goodnotesPageGrid) return;
        const requestedCount = Array.isArray(documentItem?.pages)
            ? documentItem.pages.length
            : Number(documentItem?.pages ?? 5);
        goodnotesPageCount = Number.isFinite(requestedCount) ? Math.max(1, Math.floor(requestedCount)) : 5;
        goodnotesCurrentPage = Math.min(Math.max(1, goodnotesCurrentPage), goodnotesPageCount);
        goodnotesPageGrid.querySelectorAll("[data-gn-page-number]").forEach((button) => button.remove());
        const addButton = goodnotesPageGrid.querySelector("[data-gn-add-page]");
        const pages = Array.from({ length: goodnotesPageCount }, (_, index) =>
            createGoodnotesPageButton(index + 1, documentItem),
        );
        pages.forEach((button) => goodnotesPageGrid.insertBefore(button, addButton));
        updateGoodnotesPageStatus();
    }

    function showGoodnotesToast(copy) {
        if (!goodnotesToast) return;
        if (goodnotesToastTimer) window.clearTimeout(goodnotesToastTimer);
        goodnotesToast.textContent = goodnotesText(copy);
        goodnotesToast.hidden = false;
        goodnotesToastTimer = window.setTimeout(
            () => {
                goodnotesToast.hidden = true;
            },
            reducedMotion.matches ? 800 : 2200,
        );
    }

    function createGoodnotesCard(documentItem) {
        const card = document.createElement("article");
        card.className = "gn-document-card";
        card.dataset.gnDocumentCard = documentItem.id;
        card.dataset.subject = documentItem.subject;
        card.dataset.shared = String(documentItem.shared);
        card.dataset.searchTarget =
            `${documentItem.title.zh} ${documentItem.title.en} ${documentItem.preview} ${documentItem.subject}`.toLocaleLowerCase();

        const openButton = document.createElement("button");
        openButton.type = "button";
        openButton.className = "gn-document-open";
        openButton.dataset.gnDocument = documentItem.id;
        openButton.setAttribute("aria-label", goodnotesText(documentItem.title));

        const preview = document.createElement("span");
        preview.className = `gn-note-preview is-${documentItem.subject}`;
        preview.setAttribute("aria-hidden", "true");
        const previewTitle = document.createElement("b");
        previewTitle.textContent = documentItem.preview;
        const previewPage = goodnotesPageData(documentItem, 1);
        const previewLines = document.createElement("span");
        previewLines.className = "gn-preview-scribbles";
        previewLines.append(
            document.createElement("i"),
            document.createElement("i"),
            document.createElement("i"),
        );
        const previewFormula = document.createElement("em");
        previewFormula.textContent = previewPage?.sections?.[0]?.formula || "";
        preview.append(previewTitle, previewLines, previewFormula);

        const title = document.createElement("strong");
        title.append(localizedSpan(documentItem.title));
        const updated = document.createElement("small");
        updated.append(localizedSpan(documentItem.updated));
        openButton.append(preview, title, updated);

        const favorite = document.createElement("button");
        favorite.type = "button";
        favorite.className = "gn-favorite";
        favorite.classList.toggle("is-active", documentItem.favorite);
        favorite.dataset.gnFavorite = documentItem.id;
        favorite.setAttribute("aria-pressed", String(documentItem.favorite));
        favorite.setAttribute(
            "aria-label",
            documentItem.favorite ? "Remove from favorites" : "Add to favorites",
        );
        favorite.innerHTML = '<svg class="gn-icon" aria-hidden="true"><use href="#gn-star-icon"></use></svg>';
        card.append(openButton, favorite);
        return card;
    }

    function goodnotesMatchesFilter(documentItem) {
        if (goodnotesFilter === "favorites") return documentItem.favorite;
        if (goodnotesFilter === "shared") return documentItem.shared;
        if (["math", "physics", "chemistry"].includes(goodnotesFilter)) {
            return documentItem.subject === goodnotesFilter;
        }
        if (goodnotesFilter === "marketplace") return false;
        return true;
    }

    function applyGoodnotesFilter() {
        const cards = [...(goodnotesGrid?.querySelectorAll("[data-gn-document-card]") || [])];
        let visibleCount = 0;
        cards.forEach((card) => {
            const documentItem = goodnotesDocuments.find((item) => item.id === card.dataset.gnDocumentCard);
            const visible =
                goodnotesKind !== "folders" && Boolean(documentItem && goodnotesMatchesFilter(documentItem));
            card.hidden = !visible;
            if (visible) visibleCount += 1;
        });
        goodnotesFolderButtons.forEach((button) => {
            button.hidden = goodnotesKind === "documents" || goodnotesFilter !== "all";
        });
        const visibleFolders = goodnotesFolderButtons.filter((button) => !button.hidden).length;
        if (goodnotesEmpty) {
            const empty = visibleCount + visibleFolders === 0;
            const copy =
                goodnotesFilter === "marketplace"
                    ? {
                          zh: "市集內容未在這個示範中連線",
                          en: "Marketplace content is not connected in this demo",
                      }
                    : { zh: "沒有符合的筆記", en: "No matching notes" };
            goodnotesEmpty.replaceChildren(localizedSpan(copy));
            goodnotesEmpty.hidden = !empty;
        }
    }

    function sortedGoodnotesDocuments() {
        const sorted = [...goodnotesDocuments];
        if (goodnotesSortAlphabetically) {
            sorted.sort((a, b) =>
                goodnotesText(a.title).localeCompare(
                    goodnotesText(b.title),
                    language() === "zh" ? "zh-Hant" : "en",
                ),
            );
        }
        return sorted;
    }

    function goodnotesPageData(documentItem, pageNumber = goodnotesCurrentPage) {
        if (Array.isArray(documentItem?.pages) && documentItem.pages.length) {
            return documentItem.pages[Math.min(documentItem.pages.length, Math.max(1, pageNumber)) - 1];
        }
        return {
            title: documentItem?.title,
            layout: "flow",
            sections: documentItem?.blocks || [],
            sketch: { type: "checklist", labels: documentItem?.diagram || [] },
            callout: documentItem?.callout || gnBi("開始書寫。", "Start writing."),
        };
    }

    function createGoodnotesSketch(sketch = {}) {
        const figure = document.createElement("figure");
        const type = goodnotesSketches[sketch.type] ? sketch.type : "checklist";
        figure.className = "gn-hand-sketch";
        figure.dataset.sketch = type;
        figure.setAttribute("aria-label", (sketch.labels || []).join(" → "));

        const drawing = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        drawing.setAttribute("viewBox", "0 0 300 160");
        drawing.setAttribute("aria-hidden", "true");
        drawing.innerHTML = goodnotesSketches[type];

        const caption = document.createElement("figcaption");
        (sketch.labels || []).forEach((label, index) => {
            const text = document.createElement("span");
            text.textContent = label;
            caption.append(text);
            if (index < sketch.labels.length - 1) {
                const arrow = document.createElement("b");
                arrow.setAttribute("aria-hidden", "true");
                arrow.textContent = "→";
                caption.append(arrow);
            }
        });
        figure.append(drawing, caption);
        return figure;
    }

    function bindGoodnotesCards(root) {
        root?.querySelectorAll("[data-gn-document]").forEach((button) => {
            button.addEventListener("click", () => openGoodnotesDocument(button.dataset.gnDocument));
        });
        root?.querySelectorAll("[data-gn-favorite]").forEach((button) => {
            button.addEventListener("click", () => {
                const documentItem = goodnotesDocuments.find((item) => item.id === button.dataset.gnFavorite);
                if (!documentItem) return;
                documentItem.favorite = !documentItem.favorite;
                renderGoodnotesDocuments();
                showGoodnotesToast(
                    documentItem.favorite
                        ? { zh: "已加入最愛", en: "Added to Favorites" }
                        : { zh: "已從最愛移除", en: "Removed from Favorites" },
                );
            });
        });
        root?.querySelectorAll("[data-gn-document-card]").forEach((card) => {
            card.addEventListener("contextmenu", (event) => {
                event.preventDefault();
                openGoodnotesDocumentMenu(card, event.clientX, event.clientY);
            });
        });
    }

    function closeGoodnotesDocumentMenu() {
        goodnotesDocumentMenu?.setAttribute("hidden", "");
        root.querySelectorAll(".gn-document-card.is-menu-open").forEach((card) =>
            card.classList.remove("is-menu-open"),
        );
        goodnotesMenuDocument = null;
    }

    function openGoodnotesDocumentMenu(card, clientX, clientY) {
        if (!goodnotesDocumentMenu || !goodnotesLibraryMain) return;
        closeGoodnotesMenus();
        closeGoodnotesDocumentMenu();
        goodnotesMenuDocument = card.dataset.gnDocumentCard;
        card.classList.add("is-menu-open");
        goodnotesDocumentMenu.hidden = false;

        const mainRect = goodnotesLibraryMain.getBoundingClientRect();
        const menuRect = goodnotesDocumentMenu.getBoundingClientRect();
        const requestedLeft = clientX - mainRect.left + goodnotesLibraryMain.scrollLeft;
        const requestedTop = clientY - mainRect.top + goodnotesLibraryMain.scrollTop;
        const maximumLeft = goodnotesLibraryMain.clientWidth - menuRect.width - 8;
        const maximumTop =
            goodnotesLibraryMain.scrollTop + goodnotesLibraryMain.clientHeight - menuRect.height - 8;
        goodnotesDocumentMenu.style.left = `${Math.max(8, Math.min(requestedLeft, maximumLeft))}px`;
        goodnotesDocumentMenu.style.top = `${Math.max(goodnotesLibraryMain.scrollTop + 8, Math.min(requestedTop, maximumTop))}px`;
    }

    function renderGoodnotesSearchResults() {
        if (!goodnotesSearchResults) return;
        const matches = sortedGoodnotesDocuments().filter((item) => {
            if (!goodnotesQuery) return true;
            const target =
                `${item.title.zh} ${item.title.en} ${item.preview} ${item.subject}`.toLocaleLowerCase();
            return target.includes(goodnotesQuery);
        });
        goodnotesSearchResults.replaceChildren(...matches.map(createGoodnotesCard));
        goodnotesSearchResults.classList.toggle("is-list", goodnotesLayout === "list");
        goodnotesSearchScreen?.classList.toggle("has-query", Boolean(goodnotesQuery));
        if (goodnotesSearchEmpty) goodnotesSearchEmpty.hidden = !goodnotesQuery || matches.length > 0;
        bindGoodnotesCards(goodnotesSearchResults);
    }

    function renderGoodnotesDocuments() {
        if (!goodnotesGrid) return;
        goodnotesGrid.replaceChildren(...sortedGoodnotesDocuments().map(createGoodnotesCard));
        goodnotesItemsGrid?.classList.toggle("is-list", goodnotesLayout === "list");
        bindGoodnotesCards(goodnotesGrid);
        applyGoodnotesFilter();
        renderGoodnotesSearchResults();
    }

    function renderGoodnotesPage(documentItem) {
        if (!documentItem || !goodnotesNoteContent) return;
        goodnotesCurrentDocument = documentItem.id;
        const page = goodnotesPageData(documentItem);
        if (goodnotesEditorTitle) goodnotesEditorTitle.textContent = goodnotesText(documentItem.title);
        if (goodnotesPageSubject)
            goodnotesPageSubject.textContent = goodnotesText(goodnotesSubjectCopy[documentItem.subject]);
        if (goodnotesPageTitle)
            goodnotesPageTitle.textContent = goodnotesText(page.title || documentItem.title);
        if (goodnotesPageDate)
            goodnotesPageDate.textContent = `${goodnotesText(documentItem.date)} · ${goodnotesCurrentPage}/${goodnotesPageCount}`;
        if (goodnotesPaper) {
            goodnotesPaper.dataset.subject = documentItem.subject;
            goodnotesPaper.dataset.pageLayout = page.layout || "flow";
        }

        const content = document.createDocumentFragment();
        (page.sections || []).forEach((blockCopy, index) => {
            const block = document.createElement("section");
            block.className = "gn-note-block gn-hand-section";
            block.dataset.mark = blockCopy.mark || ["yellow", "blue", "pink", "mint"][index % 4];
            const title = document.createElement("h4");
            title.textContent = goodnotesText(blockCopy.title);
            block.append(title);
            const list = document.createElement("ul");
            const lines = goodnotesText(blockCopy.lines);
            (Array.isArray(lines) ? lines : [lines]).filter(Boolean).forEach((line) => {
                const item = document.createElement("li");
                item.textContent = line;
                list.append(item);
            });
            block.append(list);
            if (blockCopy.formula) {
                const formula = document.createElement("strong");
                formula.className = "gn-formula";
                formula.textContent = blockCopy.formula;
                block.append(formula);
            }
            content.append(block);
        });

        const diagram = createGoodnotesSketch(page.sketch);
        const callout = document.createElement("aside");
        callout.className = "gn-note-callout gn-margin-note";
        const calloutLabel = document.createElement("b");
        calloutLabel.textContent = language() === "zh" ? "記住！" : "remember!";
        const calloutCopy = document.createElement("span");
        calloutCopy.textContent = goodnotesText(page.callout);
        callout.append(calloutLabel, calloutCopy);
        content.append(diagram, callout);
        goodnotesNoteContent.replaceChildren(content);
        updateGoodnotesPageStatus();
    }

    function closeGoodnotesMenus(exception = null) {
        closeGoodnotesDocumentMenu();
        [goodnotesFilterMenu, goodnotesViewMenu, goodnotesNewMenu].forEach((menu) => {
            if (!menu || menu === exception) return;
            menu.hidden = true;
        });
        root.querySelectorAll(
            "[data-gn-filter-menu-button], [data-gn-view-menu-button], [data-gn-new-menu-button]",
        ).forEach((button) => {
            const controlsException =
                (button.hasAttribute("data-gn-filter-menu-button") && exception === goodnotesFilterMenu) ||
                (button.hasAttribute("data-gn-view-menu-button") && exception === goodnotesViewMenu) ||
                (button.hasAttribute("data-gn-new-menu-button") && exception === goodnotesNewMenu);
            button.setAttribute("aria-expanded", String(controlsException && !exception.hidden));
        });
    }

    function toggleGoodnotesMenu(menu) {
        if (!menu) return;
        const willOpen = menu.hidden;
        closeGoodnotesMenus(menu);
        menu.hidden = !willOpen;
        closeGoodnotesMenus(willOpen ? menu : null);
    }

    function setGoodnotesSearch(open) {
        if (!goodnotesSearchScreen) return;
        goodnotesSearchScreen.hidden = !open;
        goodnotesLibraryMain
            ?.querySelectorAll(".gn-library-header, .gn-library-toolbar, .gn-items-grid, .gn-empty")
            .forEach((element) => {
                element.inert = open;
                element.setAttribute("aria-hidden", String(open));
            });
        closeGoodnotesMenus();
        if (!open) {
            goodnotesQuery = "";
            if (goodnotesSearch) goodnotesSearch.value = "";
            goodnotesSearchScreen.classList.remove("has-query");
            renderGoodnotesSearchResults();
            return;
        }
        renderGoodnotesSearchResults();
        window.requestAnimationFrame(() => goodnotesSearch?.focus());
    }

    function setGoodnotesView(view) {
        goodnotesViews.forEach((panel) => setPanelVisibility(panel, panel.dataset.gnView === view));
        goodnotesWindow?.classList.toggle("is-note-open", view === "editor");
        if (view === "library") {
            goodnotesWindow?.classList.remove("is-pages-open", "is-editing");
            if (goodnotesPageStrip) goodnotesPageStrip.hidden = true;
            if (goodnotesEditTools) goodnotesEditTools.hidden = true;
            const modeButton = root.querySelector("[data-gn-mode]");
            modeButton?.setAttribute("aria-pressed", "false");
            modeButton?.querySelector('[data-copy-lang="zh"]')?.replaceChildren("唯讀");
            modeButton?.querySelector('[data-copy-lang="en"]')?.replaceChildren("Read only");
            root.querySelector("[data-gn-page-toggle]")?.setAttribute("aria-pressed", "false");
        }
        closeGoodnotesMenus();
        animatePanel(
            goodnotesViews.find((panel) => panel.dataset.gnView === view),
            { y: view === "editor" ? 6 : 3 },
        );
    }

    function openGoodnotesDocument(documentId) {
        const documentItem = goodnotesDocuments.find((item) => item.id === documentId);
        if (!documentItem) return;
        goodnotesCurrentPage = 1;
        syncGoodnotesPageGrid(documentItem);
        renderGoodnotesPage(documentItem);
        setGoodnotesView("editor");
        announceOpened(goodnotesText(documentItem.title));
    }

    function setGoodnotesFilter(filter) {
        goodnotesFilter = filter;
        goodnotesFilterButtons.forEach((button) => {
            const active = button.dataset.gnFilter === filter;
            button.classList.toggle("is-active", active);
            button.setAttribute("aria-pressed", String(active));
        });
        updateGoodnotesLibraryTitle();
        if (goodnotesLibraryMain) goodnotesLibraryMain.scrollTop = 0;
        applyGoodnotesFilter();
        closeGoodnotesMenus();
    }

    goodnotesFilterButtons.forEach((button) => {
        button.addEventListener("click", () => setGoodnotesFilter(button.dataset.gnFilter));
    });

    goodnotesFolderButtons.forEach((button) => {
        button.addEventListener("click", () => setGoodnotesFilter(button.dataset.gnFolder));
    });

    goodnotesSearch?.addEventListener("input", () => {
        goodnotesQuery = goodnotesSearch.value.trim().toLocaleLowerCase();
        renderGoodnotesSearchResults();
    });

    goodnotesLibraryButtons.forEach((button) => {
        button.addEventListener("click", () => {
            setGoodnotesSearch(false);
            setGoodnotesView("library");
        });
    });

    root.querySelectorAll("[data-gn-search-toggle]").forEach((button) => {
        button.addEventListener("click", () => setGoodnotesSearch(true));
    });
    root.querySelector("[data-gn-search-back]")?.addEventListener("click", () => setGoodnotesSearch(false));
    root.querySelector("[data-gn-search-clear]")?.addEventListener("click", () => {
        if (goodnotesSearch) goodnotesSearch.value = "";
        goodnotesQuery = "";
        renderGoodnotesSearchResults();
        goodnotesSearch?.focus();
    });

    root.querySelectorAll("[data-gn-search-chip]").forEach((button) => {
        button.addEventListener("click", () => {
            goodnotesQuery = button.dataset.gnSearchChip.toLocaleLowerCase();
            if (goodnotesSearch) goodnotesSearch.value = button.dataset.gnSearchChip;
            renderGoodnotesSearchResults();
        });
    });

    root.querySelector("[data-gn-clear-recents]")?.addEventListener("click", () => {
        if (goodnotesSearchRecents) goodnotesSearchRecents.hidden = true;
    });

    root.querySelector("[data-gn-filter-menu-button]")?.addEventListener("click", () =>
        toggleGoodnotesMenu(goodnotesFilterMenu),
    );
    root.querySelector("[data-gn-view-menu-button]")?.addEventListener("click", () =>
        toggleGoodnotesMenu(goodnotesViewMenu),
    );
    root.querySelector("[data-gn-new-menu-button]")?.addEventListener("click", () =>
        toggleGoodnotesMenu(goodnotesNewMenu),
    );

    function updateGoodnotesKindLabel() {
        const label = root.querySelector("[data-gn-kind-label]");
        if (label) label.textContent = goodnotesText(goodnotesKindCopy[goodnotesKind]);
    }

    root.querySelectorAll("[data-gn-kind]").forEach((button) => {
        button.addEventListener("click", () => {
            goodnotesKind = button.dataset.gnKind;
            root.querySelectorAll("[data-gn-kind]").forEach((item) => {
                const active = item === button;
                item.classList.toggle("is-selected", active);
                item.setAttribute("aria-checked", String(active));
            });
            updateGoodnotesKindLabel();
            applyGoodnotesFilter();
            closeGoodnotesMenus();
        });
    });

    root.querySelectorAll("[data-gn-layout]").forEach((button) => {
        button.addEventListener("click", () => {
            goodnotesLayout = button.dataset.gnLayout;
            root.querySelectorAll("[data-gn-layout]").forEach((item) => {
                const active = item === button;
                item.classList.toggle("is-selected", active);
                item.setAttribute("aria-checked", String(active));
            });
            goodnotesLayoutIcon?.setAttribute(
                "href",
                goodnotesLayout === "list" ? "#gn-list-icon" : "#gn-grid-icon",
            );
            renderGoodnotesDocuments();
            closeGoodnotesMenus();
        });
    });

    goodnotesLibraryMain?.addEventListener(
        "scroll",
        () => {
            const scrolled = goodnotesLibraryMain.scrollTop > 28;
            goodnotesLibraryMain.classList.toggle("is-scrolled", scrolled);
            if (goodnotesCompactHeader) {
                goodnotesCompactHeader.inert = !scrolled;
                goodnotesCompactHeader.setAttribute("aria-hidden", String(!scrolled));
            }
        },
        { passive: true },
    );

    goodnotesToolButtons.forEach((button) => {
        button.addEventListener("click", () => {
            goodnotesToolButtons.forEach((tool) => {
                const active = tool === button;
                tool.classList.toggle("is-active", active);
                tool.setAttribute("aria-pressed", String(active));
            });
        });
    });

    root.querySelector("[data-gn-page-toggle]")?.addEventListener("click", (event) => {
        const willOpen = goodnotesPageStrip?.hidden ?? false;
        if (goodnotesPageStrip) goodnotesPageStrip.hidden = !willOpen;
        goodnotesWindow?.classList.toggle("is-pages-open", willOpen);
        event.currentTarget.setAttribute("aria-pressed", String(willOpen));
        if (willOpen) setGoodnotesPageSidebarView("pages");
    });

    root.querySelector("[data-gn-page-close]")?.addEventListener("click", () => {
        if (goodnotesPageStrip) goodnotesPageStrip.hidden = true;
        goodnotesWindow?.classList.remove("is-pages-open");
        root.querySelector("[data-gn-page-toggle]")?.setAttribute("aria-pressed", "false");
    });

    function setGoodnotesPageSidebarView(view) {
        const copy = {
            pages: { zh: "頁面", en: "Pages" },
            outline: { zh: "大綱", en: "Outline" },
            transcripts: { zh: "轉錄", en: "Transcripts" },
        }[view] || { zh: "頁面", en: "Pages" };
        root.querySelectorAll("[data-gn-page-view]").forEach((tab) => {
            const active = tab.dataset.gnPageView === view;
            tab.classList.toggle("is-active", active);
            tab.setAttribute("aria-selected", String(active));
        });
        const title = goodnotesPageStrip?.querySelector("header strong");
        if (title) title.replaceChildren(localizedSpan(copy));
        const pagesVisible = view === "pages";
        if (goodnotesPageGrid) goodnotesPageGrid.hidden = !pagesVisible;
        if (goodnotesPageFilter) goodnotesPageFilter.hidden = !pagesVisible;
        if (goodnotesPageEmpty) {
            goodnotesPageEmpty.hidden = pagesVisible;
            goodnotesPageEmpty.replaceChildren(
                localizedSpan(
                    view === "outline"
                        ? { zh: "這份筆記尚未建立大綱", en: "This note has no outline yet" }
                        : { zh: "這份筆記尚未建立音訊轉錄", en: "This note has no audio transcript yet" },
                ),
            );
        }
    }

    root.querySelectorAll("[data-gn-page-view]").forEach((button) => {
        button.addEventListener("click", () => setGoodnotesPageSidebarView(button.dataset.gnPageView));
    });

    function selectGoodnotesPage(button) {
        const pageNumber = Number(button.dataset.gnPageNumber || 1);
        if (!Number.isFinite(pageNumber)) return;
        goodnotesCurrentPage = pageNumber;
        root.querySelectorAll("[data-gn-page-number]").forEach((page) =>
            page.classList.toggle("is-active", page === button),
        );
        const documentItem = goodnotesDocuments.find((item) => item.id === goodnotesCurrentDocument);
        if (documentItem) renderGoodnotesPage(documentItem);
        else updateGoodnotesPageStatus();
    }

    function bindGoodnotesPageButton(button) {
        button.addEventListener("click", () => selectGoodnotesPage(button));
    }

    root.querySelectorAll("[data-gn-page-number]").forEach(bindGoodnotesPageButton);

    root.querySelector("[data-gn-mode]")?.addEventListener("click", (event) => {
        const editing = event.currentTarget.getAttribute("aria-pressed") !== "true";
        event.currentTarget.setAttribute("aria-pressed", String(editing));
        goodnotesWindow?.classList.toggle("is-editing", editing);
        if (goodnotesEditTools) goodnotesEditTools.hidden = !editing;
        const zhLabel = event.currentTarget.querySelector('[data-copy-lang="zh"]');
        const enLabel = event.currentTarget.querySelector('[data-copy-lang="en"]');
        if (zhLabel) zhLabel.textContent = editing ? "完成" : "唯讀";
        if (enLabel) enLabel.textContent = editing ? "Done" : "Read only";
    });

    root.querySelector("[data-gn-sort]")?.addEventListener("click", (event) => {
        goodnotesSortAlphabetically = !goodnotesSortAlphabetically;
        event.currentTarget.classList.toggle("is-active", goodnotesSortAlphabetically);
        event.currentTarget.setAttribute("aria-pressed", String(goodnotesSortAlphabetically));
        renderGoodnotesDocuments();
        closeGoodnotesMenus();
    });

    function createGoodnotesDraft(action) {
        const type = {
            notebook: { preview: "NEW NOTE", title: { zh: "未命名筆記本", en: "Untitled Notebook" } },
            whiteboard: { preview: "WHITEBOARD", title: { zh: "未命名白板", en: "Untitled Whiteboard" } },
            text: { preview: "TEXT DOCUMENT", title: { zh: "未命名文本文檔", en: "Untitled Text Document" } },
            quicknote: { preview: "QUICKNOTE", title: { zh: "快速筆記", en: "QuickNote" } },
        }[action];
        if (!type) return null;
        goodnotesDraftSequence += 1;
        return {
            id: `new-draft-${goodnotesDraftSequence}`,
            subject: "math",
            favorite: false,
            shared: false,
            preview: type.preview,
            title: type.title,
            updated: { zh: "剛剛", en: "Just now" },
            date: { zh: "2026年8月4日", en: "4 AUG 2026" },
            pages: [
                gnPage(
                    ["開始書寫", "Start writing"],
                    "flow",
                    [
                        gnSection(
                            ["今天要記低…", "Today I want to note…"],
                            ["先寫問題，再留下完整 working。", "用螢光筆只標真正要回看的關鍵。"],
                            [
                                "write the question before the full working",
                                "highlight only what should be reviewed later",
                            ],
                            "idea → working → answer",
                            "yellow",
                        ),
                    ],
                    { type: "checklist", labels: ["idea", "working", "answer"] },
                    ["用上方工具列選擇書寫工具。", "Choose a writing tool from the toolbar."],
                ),
            ],
        };
    }

    root.querySelectorAll("[data-gn-new-action]").forEach((button) => {
        button.addEventListener("click", () => {
            const action = button.dataset.gnNewAction;
            const draft = createGoodnotesDraft(action);
            if (!draft) {
                const feedback = {
                    import: {
                        zh: "匯入功能在示範模式中不會讀取你的檔案",
                        en: "Demo mode does not read your files",
                    },
                    recording: {
                        zh: "示範模式不會啟動麥克風",
                        en: "Demo mode does not start the microphone",
                    },
                    studyset: { zh: "學習卡組入口已保留", en: "The Study Set entry is preserved" },
                    image: {
                        zh: "示範模式不會開啟相片資料庫",
                        en: "Demo mode does not open your photo library",
                    },
                    camera: { zh: "示範模式不會啟動相機", en: "Demo mode does not start the camera" },
                    folder: { zh: "資料夾建立入口已保留", en: "The folder creation entry is preserved" },
                    cloud: { zh: "雲端匯入目前已鎖定", en: "Cloud import is currently locked" },
                }[action] || { zh: "這個入口已保留", en: "This entry is preserved" };
                closeGoodnotesMenus();
                showGoodnotesToast(feedback);
                return;
            }
            goodnotesDocuments = [draft, ...goodnotesDocuments];
            goodnotesFilter = "all";
            goodnotesQuery = "";
            if (goodnotesSearch) goodnotesSearch.value = "";
            renderGoodnotesDocuments();
            setGoodnotesFilter("all");
            closeGoodnotesMenus();
            openGoodnotesDocument(draft.id);
            showGoodnotesToast({ zh: "已建立新筆記", en: "New note created" });
        });
    });

    /* Keep the legacy marker functional for older cached markup. */
    root.querySelector("[data-gn-new]:not([data-gn-new-action])")?.addEventListener("click", () => {
        const draft = createGoodnotesDraft("notebook");
        if (!draft) return;
        goodnotesDocuments = [draft, ...goodnotesDocuments];
        goodnotesFilter = "all";
        goodnotesQuery = "";
        if (goodnotesSearch) goodnotesSearch.value = "";
        renderGoodnotesDocuments();
        setGoodnotesFilter("all");
        closeGoodnotesMenus();
        openGoodnotesDocument(draft.id);
        showGoodnotesToast({ zh: "已建立新筆記", en: "New note created" });
    });

    root.querySelector("[data-gn-add-page]")?.addEventListener("click", () => {
        if (!goodnotesPageGrid) return;
        goodnotesPageCount += 1;
        const current = goodnotesDocuments.find((item) => item.id === goodnotesCurrentDocument);
        if (current) {
            if (Array.isArray(current.pages)) {
                current.pages.push(
                    gnPage(
                        ["新一頁", "New page"],
                        "flow",
                        [gnSection(["繼續整理", "Continue writing"], [""], [""], "", "yellow")],
                        { type: "checklist", labels: ["note", "working", "check"] },
                        ["留一點空位給之後的補充。", "Leave some space for later additions."],
                    ),
                );
            } else {
                current.pages = goodnotesPageCount;
            }
        }
        const button = createGoodnotesPageButton(goodnotesPageCount, current);
        goodnotesPageGrid.insertBefore(button, root.querySelector("[data-gn-add-page]"));
        selectGoodnotesPage(button);
        showGoodnotesToast({ zh: `已新增第${goodnotesPageCount}頁`, en: `Page ${goodnotesPageCount} added` });
    });

    goodnotesDocumentMenu?.querySelectorAll("[data-gn-menu-action]").forEach((button) => {
        button.addEventListener("click", () => {
            const documentItem = goodnotesDocuments.find((item) => item.id === goodnotesMenuDocument);
            const action = button.dataset.gnMenuAction;
            if (action === "duplicate" && documentItem) {
                const duplicate =
                    typeof structuredClone === "function"
                        ? structuredClone(documentItem)
                        : JSON.parse(JSON.stringify(documentItem));
                goodnotesDraftSequence += 1;
                duplicate.id = `${documentItem.id}-copy-${goodnotesDraftSequence}`;
                duplicate.title = {
                    zh: `${documentItem.title.zh} 副本`,
                    en: `${documentItem.title.en} Copy`,
                };
                duplicate.updated = { zh: "剛剛", en: "Just now" };
                goodnotesDocuments = [duplicate, ...goodnotesDocuments];
                setGoodnotesFilter("all");
                renderGoodnotesDocuments();
                showGoodnotesToast({ zh: "已建立副本", en: "Copy created" });
            } else if (action === "window" && documentItem) {
                openGoodnotesDocument(documentItem.id);
                showGoodnotesToast({ zh: "已開啟筆記", en: "Note opened" });
            } else if (action === "move") {
                showGoodnotesToast({
                    zh: "移動入口已保留；示範模式不會改動資料夾",
                    en: "Demo mode does not move your folders",
                });
            } else if (action === "export") {
                showGoodnotesToast({
                    zh: "輸出入口已保留；示範模式不會建立檔案",
                    en: "Demo mode does not create export files",
                });
            } else if (action === "trash") {
                showGoodnotesToast({
                    zh: "示範介面不會刪除筆記",
                    en: "Demo mode keeps the note safely in place",
                });
            }
            closeGoodnotesDocumentMenu();
        });
    });

    root.querySelectorAll("[data-gn-feedback]").forEach((button) => {
        button.addEventListener("click", () => {
            showGoodnotesToast(goodnotesFeedbackCopy[button.dataset.gnFeedback]);
        });
    });

    goodnotesWindow?.addEventListener("click", (event) => {
        if (
            event.target.closest(
                ".gn-menu, .gn-new-menu, .gn-document-menu, [data-gn-filter-menu-button], [data-gn-view-menu-button], [data-gn-new-menu-button]",
            )
        )
            return;
        closeGoodnotesMenus();
    });

    goodnotesWindow?.addEventListener("keydown", (event) => {
        if (event.key !== "Escape") return;
        if (goodnotesSearchScreen && !goodnotesSearchScreen.hidden) {
            setGoodnotesSearch(false);
            return;
        }
        closeGoodnotesMenus();
    });

    const refreshGoodnotesCopy = () => {
        if (goodnotesSearch) {
            goodnotesSearch.placeholder = language() === "zh" ? "搜尋" : "Search";
            goodnotesSearch.setAttribute("aria-label", language() === "zh" ? "搜尋筆記" : "Search notes");
        }
        const modeButton = root.querySelector("[data-gn-mode]");
        const editing = modeButton?.getAttribute("aria-pressed") === "true";
        if (modeButton) {
            const zhLabel = modeButton.querySelector('[data-copy-lang="zh"]');
            const enLabel = modeButton.querySelector('[data-copy-lang="en"]');
            if (zhLabel) zhLabel.textContent = editing ? "完成" : "唯讀";
            if (enLabel) enLabel.textContent = editing ? "Done" : "Read only";
        }
        updateGoodnotesKindLabel();
        updateGoodnotesLibraryTitle();
        updateGoodnotesPageStatus();
        renderGoodnotesDocuments();
        const current = goodnotesDocuments.find((item) => item.id === goodnotesCurrentDocument);
        if (current) {
            syncGoodnotesPageGrid(current);
            renderGoodnotesPage(current);
        }
        const activePageView = root.querySelector("[data-gn-page-view].is-active")?.dataset.gnPageView;
        if (activePageView) setGoodnotesPageSidebarView(activePageView);
    };

    renderGoodnotesDocuments();
    syncGoodnotesPageGrid(goodnotesDocuments[0]);
    renderGoodnotesPage(goodnotesDocuments[0]);
    updateGoodnotesLibraryTitle();
    updateGoodnotesPageStatus();
    setGoodnotesView("library");

    return { languageChanged: refreshGoodnotesCopy };
}

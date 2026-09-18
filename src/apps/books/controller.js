import { setPanelVisibility, animatePanel } from "../../shared/motion.js";
import { language, announceOpened } from "../../shared/i18n.js";
import booksCatalog from "./content.js";
export default function mount({ root }) {
    const booksWindow = root;
    const booksViews = [...root.querySelectorAll("[data-books-view]")];
    const booksNavButtons = [...root.querySelectorAll("[data-books-nav]")];
    const booksOpenButtons = [...root.querySelectorAll("[data-books-open]")];
    const booksSearch = root.querySelector("[data-books-search]");
    const booksSearchClear = root.querySelector("[data-books-search-clear]");
    const booksSearchResults = root.querySelector("[data-books-search-results]");
    const booksSearchEmpty = root.querySelector("[data-books-search-empty]");
    const booksTrending = root.querySelector(".books-trending");
    const booksTrendingTitle = root.querySelector(".books-search-content > h3");
    const booksMoreButton = root.querySelector("[data-books-more]");
    const booksMoreMenu = root.querySelector("[data-books-more-menu]");
    const booksReaderTitle = root.querySelector("[data-books-reader-title]");
    const booksReaderAuthor = root.querySelector("[data-books-reader-author]");
    const booksReaderHeading = root.querySelector("[data-books-reader-heading]");
    const booksReaderCopy = root.querySelector("[data-books-reader-copy]");
    const booksReaderProgress = root.querySelector("[data-books-reader-progress]");
    const booksReaderRange = root.querySelector(".books-reader-stage input[type='range']");
    const booksHomeScroll = root.querySelector(".books-home-scroll");
    const booksLibraryScroll = root.querySelector(".books-library-scroll");
    let booksCurrentView = "home";
    let booksLastLibraryView = "home";

    function closeBooksMoreMenu() {
        if (booksMoreMenu) booksMoreMenu.hidden = true;
        booksMoreButton?.setAttribute("aria-expanded", "false");
    }

    function setBooksView(view, options = {}) {
        const { remember = true, focusSearch = true } = options;
        if (remember && view !== "reader") booksLastLibraryView = view;
        booksCurrentView = view;
        booksViews.forEach((panel) => setPanelVisibility(panel, panel.dataset.booksView === view));
        booksWindow?.classList.toggle("is-reader-open", view === "reader");
        booksNavButtons.forEach((button) => {
            const selected = button.dataset.booksNav === view;
            button.classList.toggle("is-active", selected);
            button.setAttribute("aria-pressed", String(selected));
        });
        closeBooksMoreMenu();
        const panel = booksViews.find((item) => item.dataset.booksView === view);
        animatePanel(panel, { y: view === "reader" ? 2 : 3 });
        if (view === "search" && focusSearch) {
            window.requestAnimationFrame(() => booksSearch?.focus());
        }
    }

    function openBooksReader(bookId) {
        const book = booksCatalog[bookId];
        if (!book) return;
        if (booksCurrentView !== "reader") booksLastLibraryView = booksCurrentView;
        if (booksReaderTitle) booksReaderTitle.textContent = book.title;
        if (booksReaderAuthor) booksReaderAuthor.textContent = book.author;
        if (booksReaderHeading) booksReaderHeading.textContent = book.heading;
        if (booksReaderCopy) booksReaderCopy.textContent = book.copy[language()];
        if (booksReaderProgress) booksReaderProgress.textContent = `${book.progress}%`;
        if (booksReaderRange) booksReaderRange.value = String(book.progress);
        booksWindow.dataset.booksCurrent = bookId;
        setBooksView("reader", { remember: false });
        announceOpened(book.title);
    }

    function renderBooksSearch() {
        const query = booksSearch?.value.trim().toLocaleLowerCase() || "";
        booksSearch?.closest(".books-search-field")?.classList.toggle("has-value", Boolean(query));
        const cards = [...(booksSearchResults?.querySelectorAll("[data-books-search-target]") || [])];
        if (!query) {
            if (booksSearchResults) booksSearchResults.hidden = true;
            if (booksSearchEmpty) booksSearchEmpty.hidden = true;
            if (booksTrending) booksTrending.hidden = false;
            if (booksTrendingTitle) booksTrendingTitle.hidden = false;
            return;
        }
        let visible = 0;
        cards.forEach((card) => {
            const match = card.dataset.booksSearchTarget.toLocaleLowerCase().includes(query);
            card.hidden = !match;
            if (match) visible += 1;
        });
        if (booksSearchResults) booksSearchResults.hidden = visible === 0;
        if (booksSearchEmpty) booksSearchEmpty.hidden = visible !== 0;
        if (booksTrending) booksTrending.hidden = true;
        if (booksTrendingTitle) booksTrendingTitle.hidden = true;
    }

    function updateBooksScrollThumb(panel, scroller, thumbHeight) {
        if (!panel || !scroller) return;
        const maxScroll = Math.max(1, scroller.scrollHeight - scroller.clientHeight);
        const progress = Math.min(1, scroller.scrollTop / maxScroll);
        const travel = Math.max(0, scroller.clientHeight - 65 - thumbHeight);
        panel.style.setProperty("--books-scroll-y", `${progress * travel}px`);
    }

    booksNavButtons.forEach((button) => {
        button.addEventListener("click", () => setBooksView(button.dataset.booksNav));
    });

    booksOpenButtons.forEach((button) => {
        button.addEventListener("click", () => openBooksReader(button.dataset.booksOpen));
    });

    root.querySelector("[data-books-reader-back]")?.addEventListener("click", () => {
        setBooksView(booksLastLibraryView || "home", { remember: false });
    });

    booksSearch?.addEventListener("input", renderBooksSearch);
    booksSearchClear?.addEventListener("click", () => {
        if (booksSearch) booksSearch.value = "";
        renderBooksSearch();
        booksSearch?.focus();
    });

    root.querySelectorAll(".books-trending button").forEach((button) => {
        button.addEventListener("click", () => {
            if (booksSearch) booksSearch.value = button.textContent.trim();
            renderBooksSearch();
        });
    });

    booksMoreButton?.addEventListener("click", (event) => {
        event.stopPropagation();
        const open = booksMoreMenu?.hidden ?? true;
        if (booksMoreMenu) booksMoreMenu.hidden = !open;
        booksMoreButton.setAttribute("aria-expanded", String(open));
    });

    booksHomeScroll?.addEventListener(
        "scroll",
        () => {
            updateBooksScrollThumb(root.querySelector(".books-home"), booksHomeScroll, 214);
        },
        { passive: true },
    );

    booksLibraryScroll?.addEventListener(
        "scroll",
        () => {
            updateBooksScrollThumb(root.querySelector(".books-library"), booksLibraryScroll, 104);
        },
        { passive: true },
    );

    booksWindow?.addEventListener("click", (event) => {
        if (event.target.closest("[data-books-more], [data-books-more-menu]")) return;
        closeBooksMoreMenu();
    });

    booksWindow?.addEventListener("keydown", (event) => {
        if (event.key !== "Escape") return;
        if (booksCurrentView === "reader") {
            setBooksView(booksLastLibraryView || "home", { remember: false });
            return;
        }
        closeBooksMoreMenu();
    });

    const refreshBooksCopy = () => {
        if (booksSearch)
            booksSearch.setAttribute(
                "aria-label",
                language() === "zh" ? "搜尋 Apple Books" : "Search Apple Books",
            );
        const book = booksCatalog[booksWindow?.dataset.booksCurrent];
        if (book && booksReaderCopy) booksReaderCopy.textContent = book.copy[language()];
    };

    renderBooksSearch();
    setBooksView("home", { focusSearch: false });
    updateBooksScrollThumb(root.querySelector(".books-home"), booksHomeScroll, 214);
    updateBooksScrollThumb(root.querySelector(".books-library"), booksLibraryScroll, 104);

    return { languageChanged: refreshBooksCopy };
}

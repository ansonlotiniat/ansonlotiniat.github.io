import { language } from "../../shared/i18n.js";
import { mediaImage } from "../../shared/media.js";
import { reducedMotion, animatePanel } from "../../shared/motion.js";
import content from "./content.json";
export default function mount({ root }) {
    const netflixWindow = root;
    const netflixMain = root.querySelector(".netflix-main");
    const netflixHero = root.querySelector("[data-netflix-hero]");
    const netflixHeroLogo = root.querySelector("[data-netflix-hero-logo]");
    const netflixHeroTitle = root.querySelector("[data-netflix-hero-title]");
    const netflixHeroDescriptionZh = root.querySelector("[data-netflix-hero-description-zh]");
    const netflixHeroDescriptionEn = root.querySelector("[data-netflix-hero-description-en]");
    const netflixHeroOpen = root.querySelector("[data-netflix-hero-open]");
    const netflixList = root.querySelector("[data-netflix-list]");
    const netflixEmpty = root.querySelector("[data-netflix-empty]");
    const netflixSearch = root.querySelector("[data-netflix-search]");
    const netflixViewButtons = [...root.querySelectorAll("[data-netflix-view]")];
    const netflixJumpList = root.querySelector("[data-netflix-jump-list]");
    const netflixRowTitleZh = root.querySelector("[data-netflix-row-title-zh]");
    const netflixRowTitleEn = root.querySelector("[data-netflix-row-title-en]");
    const netflixEmptyZh = root.querySelector("[data-netflix-empty-zh]");
    const netflixEmptyEn = root.querySelector("[data-netflix-empty-en]");
    const netflixProfileButton = root.querySelector("[data-netflix-profile]");
    const netflixProfileMenu = root.querySelector("[data-netflix-profile-menu]");
    const netflixProfileChoice = root.querySelector("[data-netflix-profile-choice]");
    const netflixProfileName = root.querySelector("[data-netflix-profile-name]");
    const netflixNotificationsButton = root.querySelector("[data-netflix-notifications]");
    const netflixNotificationsMenu = root.querySelector("[data-netflix-notifications-menu]");
    let netflixCurrentView = "home";

    const netflixViewCopy = {
        home: { zh: "我的片單", en: "My List" },
        list: { zh: "我的片單", en: "My List" },
        series: { zh: "片單中的影集", en: "Series in My List" },
        films: { zh: "片單中的電影", en: "Films in My List" },
        games: { zh: "片單中的遊戲", en: "Games in My List" },
        new: { zh: "片單中的新作", en: "New in My List" },
        languages: { zh: "依語言瀏覽", en: "Browse by Language" },
    };

    function netflixLocalizedField(item, field, locale = language()) {
        const suffix = locale === "zh" ? "Zh" : "En";
        return item?.[`${field}${suffix}`] || item?.[field] || "";
    }

    function netflixHeroItem() {
        const items = content?.items || [];
        const heroId = content?.heroId;
        return items.find((item) => item.id === heroId) || items[0] || null;
    }

    function refreshNetflixHero() {
        if (!netflixHero) return;
        const item = netflixHeroItem();
        netflixHero.classList.toggle("has-title", Boolean(item));
        netflixHero.style.setProperty(
            "--netflix-hero-artwork",
            item?.artwork ? `url("${item.artwork}")` : "none",
        );

        if (netflixHeroLogo) {
            netflixHeroLogo.hidden = !item?.logo;
            if (item?.logo) {
                netflixHeroLogo.src = item.logo;
                netflixHeroLogo.alt = "";
            } else {
                netflixHeroLogo.removeAttribute("src");
                netflixHeroLogo.alt = "";
            }
        }
        if (netflixHeroTitle) {
            netflixHeroTitle.textContent =
                item?.title || (language() === "zh" ? "我的 Netflix 片單" : "My Netflix list");
            netflixHeroTitle.hidden = false;
            netflixHeroTitle.classList.toggle("sr-only", Boolean(item?.logo));
        }
        if (netflixHeroDescriptionZh) {
            netflixHeroDescriptionZh.textContent =
                item?.descriptionZh || "這裡會放我想看、正在看和會再看的電影與影集。";
        }
        if (netflixHeroDescriptionEn) {
            netflixHeroDescriptionEn.textContent =
                item?.descriptionEn || "Films and series I want to watch, am watching, or would watch again.";
        }
        if (netflixHeroOpen) {
            netflixHeroOpen.hidden = !item?.url;
            if (item?.url) netflixHeroOpen.href = item.url;
            netflixHeroOpen.setAttribute(
                "aria-label",
                item?.title
                    ? `${language() === "zh" ? "在 Netflix 查看" : "View on Netflix"}: ${item.title}`
                    : "Netflix",
            );
        }
    }

    function netflixItemsForView() {
        const query = netflixSearch?.value.trim().toLocaleLowerCase() || "";
        return [...(content?.items || [])].filter((item) => {
            const type = String(item.type || "").toLocaleLowerCase();
            const status = String(item.status || "").toLocaleLowerCase();
            const matchesView =
                Boolean(query) ||
                netflixCurrentView === "home" ||
                netflixCurrentView === "list" ||
                (netflixCurrentView === "series" && ["series", "show", "tv"].includes(type)) ||
                (netflixCurrentView === "films" && ["film", "movie"].includes(type)) ||
                (netflixCurrentView === "games" && ["game", "games"].includes(type)) ||
                (netflixCurrentView === "languages" && Boolean(item.language)) ||
                (netflixCurrentView === "new" && (item.isNew === true || ["new", "recent"].includes(status)));
            const text = [
                item.title,
                item.genre,
                item.genreZh,
                item.genreEn,
                item.year,
                item.cast,
                item.description,
                item.descriptionZh,
                item.descriptionEn,
                item.tags,
                item.language,
            ]
                .flat()
                .filter(Boolean)
                .join(" ")
                .toLocaleLowerCase();
            return matchesView && (!query || text.includes(query));
        });
    }

    function refreshNetflixListCopy(itemCount) {
        const viewCopy = netflixViewCopy[netflixCurrentView] || netflixViewCopy.home;
        const query = netflixSearch?.value.trim() || "";
        if (netflixRowTitleZh) netflixRowTitleZh.textContent = query ? `「${query}」的搜尋結果` : viewCopy.zh;
        if (netflixRowTitleEn)
            netflixRowTitleEn.textContent = query ? `Search results for “${query}”` : viewCopy.en;

        const hasPublishedItems = (content?.items || []).length > 0;
        let emptyCopy;
        if (query) {
            emptyCopy = { zh: `找不到「${query}」。`, en: `No results for “${query}”.` };
        } else if (!hasPublishedItems) {
            emptyCopy = { zh: "我還未把私人片單放上來。", en: "I haven't published my personal list yet." };
        } else {
            emptyCopy = { zh: "這個分類還沒有片。", en: "There are no titles in this section yet." };
        }
        if (netflixEmptyZh) netflixEmptyZh.textContent = emptyCopy.zh;
        if (netflixEmptyEn) netflixEmptyEn.textContent = emptyCopy.en;
        if (netflixEmpty) netflixEmpty.hidden = itemCount > 0;
    }

    function renderNetflixList() {
        if (!netflixList) return;
        netflixList.replaceChildren();
        const items = netflixItemsForView();

        items.forEach((item) => {
            const card = document.createElement(item.url ? "a" : "article");
            card.className = "netflix-card";
            if (item.url) {
                card.href = item.url;
                card.target = "_blank";
                card.rel = "noreferrer";
                card.setAttribute(
                    "aria-label",
                    `${language() === "zh" ? "在 Netflix 查看" : "View on Netflix"}: ${item.title}`,
                );
            } else {
                card.tabIndex = 0;
            }

            const image = mediaImage(item.artwork, item.title ? `${item.title} artwork` : "");
            const artwork = document.createElement("span");
            artwork.className = "netflix-card-art";
            artwork.append(image);
            if (item.logo) {
                const logo = mediaImage(item.logo, "");
                logo.className = "netflix-card-title-logo";
                artwork.append(logo);
            }

            const copy = document.createElement("div");
            const title = document.createElement("strong");
            title.textContent = item.title || "";
            const details = document.createElement("small");
            [
                { value: item.year, className: "netflix-card-year" },
                { value: item.rating, className: "netflix-card-rating" },
                { value: netflixLocalizedField(item, "genre"), className: "netflix-card-genre" },
            ]
                .filter((entry) => entry.value)
                .forEach((entry) => {
                    const value = document.createElement("span");
                    value.className = entry.className;
                    value.textContent = entry.value;
                    details.append(value);
                });
            copy.append(title, details);
            const localizedDescription = netflixLocalizedField(item, "description");
            if (localizedDescription) {
                const description = document.createElement("p");
                description.textContent = localizedDescription;
                copy.append(description);
            }
            card.append(artwork, copy);
            netflixList.append(card);
        });

        netflixList.hidden = items.length === 0;
        refreshNetflixListCopy(items.length);
    }

    function setNetflixView(view) {
        netflixCurrentView = view || "home";
        netflixViewButtons.forEach((button) => {
            const active = button.dataset.netflixView === netflixCurrentView;
            button.classList.toggle("is-active", active);
            button.setAttribute("aria-pressed", String(active));
        });
        renderNetflixList();
        if (netflixCurrentView === "list") {
            const row = netflixList?.closest(".netflix-row");
            netflixMain?.scrollTo({
                top: Math.max(0, (row?.offsetTop || 0) - 54),
                behavior: reducedMotion.matches ? "auto" : "smooth",
            });
        } else if (!netflixSearch?.value) {
            netflixMain?.scrollTo({ top: 0, behavior: reducedMotion.matches ? "auto" : "smooth" });
        }
    }

    netflixViewButtons.forEach((button) => {
        button.addEventListener("click", () => setNetflixView(button.dataset.netflixView));
    });
    netflixJumpList?.addEventListener("click", () => setNetflixView("list"));
    netflixSearch?.addEventListener("input", renderNetflixList);

    function setNetflixProfileMenu(open, { restoreFocus = false } = {}) {
        if (!netflixProfileMenu || !netflixProfileButton) return;
        netflixProfileMenu.hidden = !open;
        netflixProfileButton.setAttribute("aria-expanded", String(open));
        if (open) animatePanel(netflixProfileMenu, { y: -3 });
        if (!open && restoreFocus) netflixProfileButton.focus();
    }

    function setNetflixNotificationsMenu(open, { restoreFocus = false } = {}) {
        if (!netflixNotificationsMenu || !netflixNotificationsButton) return;
        netflixNotificationsMenu.hidden = !open;
        netflixNotificationsButton.setAttribute("aria-expanded", String(open));
        if (open) animatePanel(netflixNotificationsMenu, { y: -3 });
        if (!open && restoreFocus) netflixNotificationsButton.focus();
    }

    if (netflixProfileName) netflixProfileName.textContent = content?.profileName || "Anson";
    netflixProfileButton?.addEventListener("click", (event) => {
        event.stopPropagation();
        setNetflixNotificationsMenu(false);
        setNetflixProfileMenu(Boolean(netflixProfileMenu?.hidden));
    });
    netflixProfileChoice?.addEventListener("click", () =>
        setNetflixProfileMenu(false, { restoreFocus: true }),
    );
    netflixNotificationsButton?.addEventListener("click", (event) => {
        event.stopPropagation();
        setNetflixProfileMenu(false);
        setNetflixNotificationsMenu(Boolean(netflixNotificationsMenu?.hidden));
    });
    document.addEventListener("click", (event) => {
        if (!netflixProfileMenu?.hidden && !event.target.closest(".netflix-profile-wrap"))
            setNetflixProfileMenu(false);
        if (!netflixNotificationsMenu?.hidden && !event.target.closest(".netflix-notifications-wrap"))
            setNetflixNotificationsMenu(false);
    });
    netflixWindow?.addEventListener("keydown", (event) => {
        if (event.key !== "Escape" || (netflixProfileMenu?.hidden && netflixNotificationsMenu?.hidden))
            return;
        event.preventDefault();
        if (!netflixProfileMenu?.hidden) setNetflixProfileMenu(false, { restoreFocus: true });
        if (!netflixNotificationsMenu?.hidden) setNetflixNotificationsMenu(false, { restoreFocus: true });
    });

    function refreshCopy() {
        if (netflixSearch)
            netflixSearch.placeholder =
                language() === "zh" ? "片名、演員或類型" : "Titles, people, or genres";
        if (netflixSearch)
            netflixSearch.setAttribute(
                "aria-label",
                language() === "zh" ? "搜尋 Netflix 片單" : "Search Netflix list",
            );
        if (netflixNotificationsButton)
            netflixNotificationsButton.setAttribute(
                "aria-label",
                language() === "zh" ? "通知" : "Notifications",
            );
        if (netflixProfileButton)
            netflixProfileButton.setAttribute(
                "aria-label",
                language() === "zh" ? "Anson 個人檔案" : "Anson profile",
            );

        refreshNetflixHero();
        renderNetflixList();
    }
    refreshNetflixHero();
    setNetflixView("home");

    return { languageChanged: refreshCopy };
}

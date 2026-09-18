import { language, localizedSpan } from "../../shared/i18n.js";
import { mediaImage } from "../../shared/media.js";
import content from "./content.json";
export default function mount({ root }) {
    const musicWindow = root;
    const musicApp = root.querySelector("[data-music-app]");
    const musicViewButtons = [...root.querySelectorAll("[data-music-view]")];
    const musicRecentSections = root.querySelector("[data-music-recent-sections]");
    const musicPinnedList = root.querySelector("[data-music-pins]");
    const musicPlaylistList = root.querySelector("[data-music-playlists]");
    const musicPinsToggle = root.querySelector("[data-music-pins-toggle]");
    const musicFocusSearch = root.querySelector("[data-music-focus-search]");
    const musicSidebarToggle = root.querySelector("[data-music-sidebar-toggle]");
    const musicLyricsToggle = root.querySelector("[data-music-lyrics-toggle]");
    const musicToolbarTitle = root.querySelector("[data-music-toolbar-title]");
    const musicProfileName = root.querySelector("[data-music-profile-name]");
    const musicSearch = root.querySelector("[data-music-search]");
    const musicSearchEmpty = root.querySelector("[data-music-search-empty]");
    const musicPlayerArt = root.querySelector("[data-music-player-art]");
    const musicPlayerTitle = root.querySelector("[data-music-player-title]");
    const musicPlayerArtist = root.querySelector("[data-music-player-artist]");
    const musicProgress = root.querySelector("[data-music-progress]");
    const musicPlayButton = root.querySelector("[data-music-play]");
    const musicPreviousButton = root.querySelector("[data-music-previous]");
    const musicNextButton = root.querySelector("[data-music-next]");
    const musicShuffleButton = root.querySelector("[data-music-shuffle]");
    const musicRepeatButton = root.querySelector("[data-music-repeat]");
    const musicVolume = root.querySelector("[data-music-volume]");
    let musicCurrentView = "recent";
    let musicCurrentSong = null;
    let musicCurrentSongIndex = -1;
    let musicAudio = null;

    function musicSongsData() {
        return [...(content?.songs || [])];
    }

    function musicRecentSectionsData() {
        return [...(content?.recentSections || [])];
    }

    function musicAlbumsData() {
        return musicRecentSectionsData().flatMap((section) => section.albums || []);
    }

    function createMusicIcon(symbolId, className = "") {
        const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        icon.setAttribute("aria-hidden", "true");
        icon.setAttribute("class", `music-icon${className ? ` ${className}` : ""}`);
        const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
        use.setAttribute("href", `#${symbolId}`);
        icon.append(use);
        return icon;
    }

    function updateMusicTransport() {
        const hasSongs = musicPlayableData().length > 0;
        if (musicPreviousButton) musicPreviousButton.disabled = !hasSongs;
        if (musicNextButton) musicNextButton.disabled = !hasSongs;
    }

    function musicTrackForAlbum(album) {
        if (!album) return null;
        if (album.songId) {
            const pinnedSong = musicSongsData().find((song) => song.id === album.songId);
            if (pinnedSong) return pinnedSong;
        }
        return album.track || null;
    }

    function musicPlayableData() {
        const tracks = [
            content?.nowPlaying,
            ...musicSongsData(),
            ...musicAlbumsData().map(musicTrackForAlbum),
        ].filter(Boolean);
        const unique = new Map();
        tracks.forEach((track) => {
            const key = track.id || track.previewUrl || `${track.title || ""}\u0000${track.artist || ""}`;
            if (!unique.has(key)) unique.set(key, track);
        });
        return [...unique.values()];
    }

    function refreshMusicSelectedState() {
        root.querySelectorAll("[data-music-song-id]").forEach((button) => {
            button.classList.toggle(
                "is-playing-selection",
                button.dataset.musicSongId === musicCurrentSong?.id,
            );
        });
    }

    function updateMusicProgress(percent = 0) {
        if (musicProgress) musicProgress.style.width = `${Math.max(0, Math.min(100, percent))}%`;
    }

    function selectMusicSong(song) {
        if (!song) return;
        musicCurrentSong = song;
        const playable = musicPlayableData();
        musicCurrentSongIndex = playable.findIndex(
            (entry) => entry === song || (entry.id && entry.id === song.id),
        );
        if (musicPlayerTitle) musicPlayerTitle.textContent = song.title || "";
        if (musicPlayerArtist)
            musicPlayerArtist.textContent = [song.artist, song.album].filter(Boolean).join(" — ");
        if (musicPlayerArt) {
            musicPlayerArt.style.backgroundImage = song.artwork ? `url("${song.artwork}")` : "none";
            musicPlayerArt.classList.toggle("has-art", Boolean(song.artwork));
        }
        if (musicPlayButton) {
            musicPlayButton.disabled = !song.previewUrl;
            musicPlayButton.classList.remove("is-playing");
            const playLabel = language() === "zh" ? "播放" : "Play";
            const unavailableLabel = language() === "zh" ? "沒有可用的試聽" : "Preview unavailable";
            musicPlayButton.setAttribute(
                "aria-label",
                song.previewUrl ? `${playLabel} ${song.title}` : unavailableLabel,
            );
        }
        if (musicAudio) {
            musicAudio.pause();
            musicAudio = null;
        }
        updateMusicProgress(0);
        refreshMusicSelectedState();
    }

    function createMusicAlbum(album) {
        const track = musicTrackForAlbum(album);
        const card = document.createElement(track ? "button" : "article");
        if (track) card.type = "button";
        card.className = "music-album";
        if (album.showPlay) card.classList.add("is-play-visible");
        card.dataset.musicAlbumId = album.id || "";
        const artwork = document.createElement("span");
        artwork.className = "music-album-art";
        const image = mediaImage(album.artwork, "");
        image.loading = "eager";
        artwork.append(image);
        if (track) {
            const play = document.createElement("span");
            play.className = "music-album-play";
            play.append(createMusicIcon("music-play-icon"));
            artwork.append(play);
            card.setAttribute("aria-label", `${language() === "zh" ? "播放" : "Play"} ${album.title || ""}`);
        }

        const titleRow = document.createElement("span");
        titleRow.className = "music-album-title-row";
        const title = document.createElement("strong");
        title.textContent = album.title || "";
        titleRow.append(title);
        if (album.favorite) {
            const favorite = document.createElement("span");
            favorite.className = "music-album-favorite";
            favorite.textContent = "☆";
            favorite.setAttribute("aria-label", language() === "zh" ? "心水專輯" : "Favourite album");
            titleRow.append(favorite);
        }
        if (album.explicit) {
            const explicit = document.createElement("span");
            explicit.className = "music-explicit-badge";
            explicit.textContent = "E";
            explicit.setAttribute("aria-label", language() === "zh" ? "不雅內容" : "Explicit");
            titleRow.append(explicit);
        }
        const artist = document.createElement("small");
        artist.textContent = album.artist || "";
        card.append(artwork, titleRow, artist);
        if (track) {
            card.addEventListener("click", () => {
                selectMusicSong(track);
                void playMusicTrack();
            });
        }
        return card;
    }

    function createMusicPinnedSong(song) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "music-pinned-item";
        button.dataset.musicSongId = song.id || "";
        button.append(mediaImage(song.artwork, ""));
        const label = document.createElement("span");
        label.textContent = song.title || "";
        button.append(label);
        button.setAttribute("aria-label", `${language() === "zh" ? "選取" : "Select"} ${song.title || ""}`);
        button.addEventListener("click", () => selectMusicSong(song));
        return button;
    }

    function createMusicPlaylist(playlist, index) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "music-playlist-item";
        if (playlist.kind === "excel") {
            const artwork = document.createElement("span");
            artwork.className = "music-playlist-art is-excel";
            artwork.textContent = "X";
            artwork.setAttribute("aria-hidden", "true");
            button.append(artwork);
        } else {
            button.append(mediaImage(playlist.artwork, ""));
        }
        const label = document.createElement("span");
        label.textContent = playlist.title || "";
        button.append(label);
        button.addEventListener("click", () => {
            musicPlaylistList
                ?.querySelectorAll(".music-playlist-item")
                .forEach((entry) => entry.classList.remove("is-active"));
            button.classList.add("is-active");
            setMusicView("playlists");
            if (musicSongsData()[index % Math.max(1, musicSongsData().length)]) {
                selectMusicSong(musicSongsData()[index % musicSongsData().length]);
            }
        });
        return button;
    }

    function renderMusicSidebar() {
        if (musicPinnedList) musicPinnedList.replaceChildren(...musicSongsData().map(createMusicPinnedSong));
        if (musicPlaylistList) {
            musicPlaylistList.replaceChildren(...(content?.playlists || []).map(createMusicPlaylist));
        }
        if (musicProfileName) musicProfileName.textContent = content?.profileName || "Anson Lo";
        refreshMusicSelectedState();
    }

    const musicViewLabels = {
        recent: { zh: "今個星期", en: "This Week" },
        home: { zh: "首頁", en: "Home" },
        explore: { zh: "探索", en: "Explore" },
        radio: { zh: "廣播", en: "Radio" },
        artists: { zh: "藝人", en: "Artists" },
        albums: { zh: "專輯", en: "Albums" },
        songs: { zh: "歌曲", en: "Songs" },
        videos: { zh: "MV", en: "Music Videos" },
        recommendations: { zh: "專屬推薦", en: "Made for You" },
        playlists: { zh: "播放清單", en: "Playlists" },
        favorites: { zh: "心水歌曲", en: "Favourite Songs" },
    };

    function musicSectionsForView() {
        if (musicCurrentView === "recent") return musicRecentSectionsData();
        if (musicCurrentView === "videos") return [];

        if (["songs", "favorites", "playlists"].includes(musicCurrentView)) {
            return [
                {
                    id: musicCurrentView,
                    titleZh: musicViewLabels[musicCurrentView].zh,
                    titleEn: musicViewLabels[musicCurrentView].en,
                    albums: musicSongsData().map((song) => ({
                        id: `song-${song.id}`,
                        title: song.title,
                        artist: song.artist,
                        artwork: song.artwork,
                        songId: song.id,
                    })),
                },
            ];
        }

        return [
            {
                id: musicCurrentView,
                titleZh: musicViewLabels[musicCurrentView]?.zh || "最近加入",
                titleEn: musicViewLabels[musicCurrentView]?.en || "Recently Added",
                albums: musicAlbumsData(),
            },
        ];
    }

    function renderMusicRecent() {
        if (!musicRecentSections) return;
        const query = musicSearch?.value.trim().toLocaleLowerCase() || "";
        let total = 0;
        const sections = musicSectionsForView()
            .map((section) => ({
                ...section,
                albums: (section.albums || []).filter((album) => {
                    const searchText = `${album.title || ""} ${album.artist || ""}`.toLocaleLowerCase();
                    return !query || searchText.includes(query);
                }),
            }))
            .filter((section) => section.albums.length > 0);

        const sectionNodes = sections.map((section) => {
            total += section.albums.length;
            const wrapper = document.createElement("section");
            wrapper.className = "music-recent-section";
            wrapper.dataset.musicRecentSection = section.id || "";
            const heading = document.createElement("h3");
            heading.append(localizedSpan({ zh: section.titleZh, en: section.titleEn }));
            const grid = document.createElement("div");
            grid.className = "music-album-grid";
            grid.replaceChildren(...section.albums.map(createMusicAlbum));
            wrapper.append(heading, grid);
            return wrapper;
        });

        musicRecentSections.classList.toggle("is-searching", Boolean(query));
        musicRecentSections.replaceChildren(...sectionNodes);
        if (musicSearchEmpty) {
            musicSearchEmpty.hidden = total > 0;
            if (!total) {
                musicSearchEmpty.textContent = query
                    ? language() === "zh"
                        ? `找不到「${musicSearch.value.trim()}」。`
                        : `No results for “${musicSearch.value.trim()}”.`
                    : language() === "zh"
                      ? "這個分類目前沒有內容。"
                      : "There is nothing in this section yet.";
            }
        }
        updateMusicTransport();
    }

    function setMusicView(view) {
        musicCurrentView = view || "recent";
        musicViewButtons.forEach((button) => {
            const active = button.dataset.musicView === musicCurrentView;
            button.classList.toggle("is-active", active);
            button.setAttribute("aria-pressed", String(active));
        });
        const heading = musicViewLabels[musicCurrentView] || musicViewLabels.recent;
        if (musicToolbarTitle) musicToolbarTitle.replaceChildren(localizedSpan(heading));
        if (musicSearch) musicSearch.value = "";
        renderMusicRecent();
    }

    musicViewButtons.forEach((button) => {
        button.addEventListener("click", () => setMusicView(button.dataset.musicView));
    });
    musicSearch?.addEventListener("input", renderMusicRecent);
    musicFocusSearch?.addEventListener("click", () => {
        musicSearch?.focus();
        musicSearch?.select();
    });

    musicPinsToggle?.addEventListener("click", () => {
        const expanded = musicPinsToggle.getAttribute("aria-expanded") !== "false";
        musicPinsToggle.setAttribute("aria-expanded", String(!expanded));
        if (musicPinnedList) musicPinnedList.hidden = expanded;
    });

    musicSidebarToggle?.addEventListener("click", () => {
        const hidden = musicApp?.classList.toggle("is-sidebar-hidden") || false;
        musicWindow?.classList.toggle("is-music-sidebar-hidden", hidden);
        musicSidebarToggle.setAttribute("aria-pressed", String(hidden));
        musicSidebarToggle.setAttribute(
            "aria-label",
            language() === "zh"
                ? hidden
                    ? "顯示側邊欄"
                    : "隱藏側邊欄"
                : hidden
                  ? "Show sidebar"
                  : "Hide sidebar",
        );
    });

    musicLyricsToggle?.addEventListener("click", () => {
        const hidden = musicApp?.classList.toggle("is-lyrics-hidden") || false;
        musicLyricsToggle.classList.toggle("is-active", !hidden);
        musicLyricsToggle.setAttribute("aria-pressed", String(!hidden));
        musicLyricsToggle.setAttribute(
            "aria-label",
            language() === "zh" ? (hidden ? "顯示歌詞" : "隱藏歌詞") : hidden ? "Show lyrics" : "Hide lyrics",
        );
    });

    [musicShuffleButton, musicRepeatButton].forEach((button) => {
        button?.addEventListener("click", () => {
            const active = button.getAttribute("aria-pressed") !== "true";
            button.setAttribute("aria-pressed", String(active));
            button.classList.toggle("is-active", active);
            button.classList.toggle("is-muted", !active);
        });
    });

    function stepMusicSong(direction) {
        const songs = musicPlayableData();
        if (!songs.length) return;
        const continuePlaying = musicPlayButton?.classList.contains("is-playing");
        const start = musicCurrentSongIndex >= 0 ? musicCurrentSongIndex : direction > 0 ? -1 : 0;
        selectMusicSong(songs[(start + direction + songs.length) % songs.length]);
        if (continuePlaying) void playMusicTrack();
    }

    musicPreviousButton?.addEventListener("click", () => stepMusicSong(-1));
    musicNextButton?.addEventListener("click", () => stepMusicSong(1));
    musicVolume?.addEventListener("input", () => {
        if (musicAudio) musicAudio.volume = Number(musicVolume.value) / 100;
    });

    function setMusicPlaying(playing) {
        musicPlayButton?.classList.toggle("is-playing", playing);
        if (musicPlayButton && musicCurrentSong?.previewUrl) {
            const action = playing
                ? language() === "zh"
                    ? "暫停"
                    : "Pause"
                : language() === "zh"
                  ? "播放"
                  : "Play";
            musicPlayButton.setAttribute("aria-label", `${action} ${musicCurrentSong.title || ""}`);
        }
    }

    function prepareMusicAudio() {
        if (!musicCurrentSong?.previewUrl) return null;
        if (!musicAudio) {
            musicAudio = new Audio(musicCurrentSong.previewUrl);
            musicAudio.volume = Number(musicVolume?.value || 72) / 100;
            musicAudio.addEventListener("timeupdate", () => {
                const percent = musicAudio?.duration
                    ? (musicAudio.currentTime / musicAudio.duration) * 100
                    : 0;
                updateMusicProgress(percent);
            });
            musicAudio.addEventListener("ended", () => {
                if (musicRepeatButton?.getAttribute("aria-pressed") === "true" && musicAudio) {
                    musicAudio.currentTime = 0;
                    musicAudio.play().catch(() => setMusicPlaying(false));
                    return;
                }
                setMusicPlaying(false);
                musicAudio = null;
                updateMusicProgress(0);
            });
        }
        return musicAudio;
    }

    function playMusicTrack() {
        const audio = prepareMusicAudio();
        if (!audio) return Promise.resolve(false);
        if (!audio.paused) {
            setMusicPlaying(true);
            return Promise.resolve(true);
        }
        return audio
            .play()
            .then(() => {
                setMusicPlaying(true);
                return true;
            })
            .catch(() => {
                setMusicPlaying(false);
                return false;
            });
    }

    function toggleMusicPlayback() {
        if (musicAudio && !musicAudio.paused) {
            musicAudio.pause();
            setMusicPlaying(false);
            return;
        }
        void playMusicTrack();
    }

    musicPlayButton?.addEventListener("click", toggleMusicPlayback);

    function refreshCopy() {
        if (musicSearch)
            musicSearch.placeholder = language() === "zh" ? "在最近加入中尋找" : "Find in Recently Added";
        if (musicSearch)
            musicSearch.setAttribute(
                "aria-label",
                language() === "zh" ? "在最近加入中尋找" : "Find in Recently Added",
            );
        if (musicPreviousButton)
            musicPreviousButton.setAttribute("aria-label", language() === "zh" ? "上一首" : "Previous song");
        if (musicNextButton)
            musicNextButton.setAttribute("aria-label", language() === "zh" ? "下一首" : "Next song");
        if (musicSidebarToggle) {
            const hidden = musicApp?.classList.contains("is-sidebar-hidden");
            musicSidebarToggle.setAttribute(
                "aria-label",
                language() === "zh"
                    ? hidden
                        ? "顯示側邊欄"
                        : "隱藏側邊欄"
                    : hidden
                      ? "Show sidebar"
                      : "Hide sidebar",
            );
        }
        if (musicLyricsToggle) {
            const hidden = musicApp?.classList.contains("is-lyrics-hidden");
            musicLyricsToggle.setAttribute(
                "aria-label",
                language() === "zh"
                    ? hidden
                        ? "顯示歌詞"
                        : "隱藏歌詞"
                    : hidden
                      ? "Show lyrics"
                      : "Hide lyrics",
            );
        }
        renderMusicRecent();
        if (musicCurrentSong && musicPlayButton) {
            if (musicCurrentSong.previewUrl) {
                setMusicPlaying(musicPlayButton.classList.contains("is-playing"));
            } else {
                musicPlayButton.setAttribute(
                    "aria-label",
                    language() === "zh" ? "沒有可用的試聽" : "Preview unavailable",
                );
            }
        }
    }
    renderMusicSidebar();
    selectMusicSong(content.nowPlaying || musicSongsData()[0]);
    setMusicView("recent");

    return { languageChanged: refreshCopy };
}

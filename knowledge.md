# Knowledge Base — Anson Lo Personal Site

Last updated: 2026-07-31 01:26 CST

## Reframed goal

Build a bilingual personal homepage that behaves like Anson Lo’s working Mac rather than a document or portfolio feed. The current metaphor is “AnsonOS”: a deliberately faithful macOS desktop shell where a visitor searches for Anson, opens the tools he works through, and learns how he thinks from the interface of each tool.

The site must not assume that a portfolio is something to scroll from top to bottom. Its primary navigation is application- and state-based: Explore reveals workspaces, the Dock launches them, and several movable windows can remain open together. Xcode represents engineering systems, Visual Studio Code represents iGEM software/modelling/wiki delivery, Overleaf represents writing and editing, and Finder represents identity, method, and contact.

## Content boundaries

- No award wall, certificate list, competition ranking, repository grid, or generic skill badges.
- No research claims, speculative projects, pending positions, or unpublished results.
- Use only work that Anson directly supplied and publications verified against local source files.
- Traditional Chinese must be plain, specific, and conversational. Avoid manifesto language, inflated claims, and pseudo-poetic headings.
- The code displayed inside Xcode, Visual Studio Code, and Overleaf is explicitly presented as a product-logic/source metaphor. It explains verified work; it does not claim that the real projects used those exact filenames or source code.
- Product names and marks identify the tools being represented and do not imply endorsement.

## Current design decisions

- The homepage is a fixed “AnsonOS” desktop rather than a vertically scrolling page. Its shell now follows real macOS geometry: a 28 px translucent menu bar, native status cluster, right-aligned desktop icons, bottom-centred translucent Dock, restrained window chrome, and Spotlight-like Explore panel.
- The former aurora illustration, giant `ANSON LO.OS` hero, live workspace widget, and wallpaper parallax were removed. The desktop now uses an ordinary Lake Louise landscape photograph so the interface reads as a computer immediately; Anson’s identity belongs inside Finder rather than being printed over the wallpaper.
- Finder, Home, Mail, Xcode, and Visual Studio Code use locally converted macOS application resources. Overleaf remains a documented Simple Icons mark inside a macOS-style application tile.
- Fine-pointer devices use an intentionally oversized, hard-edged pixel cursor with fluorescent-yellow fill, white outline, hover glow, and pressed state. Touch/coarse-pointer devices keep their native pointer behaviour.
- Explore is a Spotlight-like command interface:
  - open it from the menu bar, desktop shortcut, `/`, `⌘K`, or `⌘Space` when the browser receives that event;
  - filter by English or Traditional Chinese keywords;
  - use arrow keys and Enter to select;
  - use `⌥0`–`⌥3` as direct application shortcuts.
- Real macOS normally reserves `⌘Space` for system Spotlight before a webpage can see the keystroke. The site still listens for it, but the visible Explore controls, `/`, and `⌘K` are necessary in-page fallbacks.
- Windows are real interface state, not decorative screenshots. Finder, Xcode, Visual Studio Code, and Overleaf can be opened together, focused by z-order, dragged by their title bars, minimized into and restored from the Dock, maximized, closed, and addressed through `#about`, `#xcode`, `#vscode`, and `#overleaf`.
- Finder/About presents identity, a three-part working method, current iGEM and Speech Society work, direct email/GitHub contact, and the interface/trademark note.
- Xcode/Engineering has two switchable project files:
  - `SportsDaySystem.swift` explains two years of lead interface design/development through one entry point whose information priority changes before, during, and on site;
  - `DebateOperations.swift` shows the team mini program and internal tournament system as different role views over shared information.
- Visual Studio Code/iGEM treats software, modelling, and wiki as one delivery system. The Explorer tree, editor, terminal, delivery rail, and team-wiki link all change together when a workstream is selected.
- Overleaf/Writing changes the source and compiled preview together:
  - `macao-diary.tex` uses the real `《澳門日記—回歸故事集》` editorial-credit image and a pointer magnifier;
  - `between-bells.tex` typesets Anson’s supplied poem excerpt;
  - Recompile provides a small live compilation interaction.
- The desktop and window transitions use locally vendored GSAP 3.13 core timelines with transform/opacity animation. The licence reference remains in the minified file header. Every operation also works synchronously without GSAP and under `prefers-reduced-motion`.
- Desktop windows use internal scrolling only where their content exceeds the viewport. At 700 px and below, they become full-workspace surfaces and each IDE rearranges its panes vertically; the top-level page still does not become a scrolling narrative.
- App launch metadata is centralized in `apps.config.js`. Dock entries, Explore results, bilingual labels, keywords, product labels, icons, group separators, and `⌥number` shortcuts are generated from it. `APP_MAINTENANCE.md` defines the extension contract and `scripts/validate-apps.mjs` enforces one manifest entry per window, unique IDs/shortcuts, bilingual copy, valid icons, and script order.
- `macos.css` owns the desktop shell and native geometry while `style.css` owns application interiors. This boundary lets future Apps be added without rewriting the shell.
- The Open Graph image is still `og-v2.png`, the previous systems/voice/words identity card. It contains accurate identity copy but does not yet depict the AnsonOS interface.

## Public content hierarchy

1. Desktop: immediately recognizable macOS shell, landscape wallpaper, Finder/Home shortcut, Explore shortcut, and Dock.
2. Explore/Dock: direct application search and launch.
3. Finder: profile, method, current work, and contact.
4. Xcode: sports-day and debate engineering systems.
5. Visual Studio Code: iGEM 2026 software/modelling/wiki delivery.
6. Overleaf: `《澳門日記—回歸故事集》` and `Between Bells and Heartbeats`.

## Key claims and sources

- Identity: Anson Lo, student developer/editor/speaker from Macao.
- School role: President, Speech Society at Pui Ching Middle School.
- Sports-day work: two consecutive years leading interface design and development across registration, updates, and on-site reference.
- Debate work: a team management mini program and an integrated internal-tournament management system.
- iGEM 2026 responsibility: core engineering across software, modelling, and wiki.
- The identity, school roles, software projects, and iGEM responsibilities were supplied directly by Anson on 2026-07-30; high confidence as first-party claims.
- PuiChing Macau iGEM 2026 link: [2026.igem.wiki/puiching-macau](https://2026.igem.wiki/puiching-macau/).
- `《澳門日記—回歸故事集》`: the local credit image lists `羅天逸` among the editors, and the local release document confirms the title and a January 2025 launch; high confidence.
- `Between Bells and Heartbeats`: the local poem and presentation script give the title, author name `Anson Lo`, class number, text, and school-poetry context; high confidence.
- JetBrains Mono source and licence: [JetBrains Mono](https://github.com/JetBrains/JetBrainsMono), SIL Open Font License 1.1.
- Finder, Home, Mail, Xcode, and Visual Studio Code icons were converted from the installed macOS `.icns` resources; exact paths and hashes are recorded in `assets/app-icons/SOURCES.md`. Product marks remain the property of their owners.
- Overleaf icon source: [Simple Icons](https://simpleicons.org/), CC0 1.0 with product trademarks retained by their owners.
- Wallpaper: [Lake Louise photograph by Sofia](https://unsplash.com/photos/a-view-of-a-mountain-lake-surrounded-by-pine-trees-WPSbXAoiOc0), used under the Unsplash License; exact CDN parameters and hash are recorded in `assets/wallpapers/SOURCES.md`.

## Build status

- `index.html`, `style.css`, `macos.css`, `apps.config.js`, and `main.js` implement AnsonOS. The previous Three.js map runtime is still not referenced or downloaded by the page.
- The photographic wallpaper and six application/desktop marks are stored locally under `assets/`; source, usage, dimensions, and SHA-256 records are current.
- Native-proportion menu/status chrome, live localized clock, right-aligned desktop shortcuts, generated magnifying Dock, fluorescent pixel cursor, boot choreography, persistent language choice, Explore filtering and keyboard navigation, four URL-addressable application windows, z-order, drag, minimize/restore, maximize, close, Dock state, and desktop/app focus are implemented.
- Xcode project switching, sports-day phase switching, debate role switching, Visual Studio Code workstream alignment, Overleaf source/preview switching, compilation status, and editorial-credit magnification are implemented.
- Accessibility includes a skip link, named controls, modal focus containment, tab/tabpanel relationships, live status messages, hidden/inert application states, keyboard alternatives, and reduced-motion operation.
- W3C HTML validation has zero errors (the checker emits only informational notes for the Apple private-use glyph and mixed bilingual text). Both stylesheets parse, 2,301 actionable declarations pass CSS grammar checking, both JavaScript files pass syntax checks, and the App consistency validator passes four manifest entries, four windows, four unique shortcuts, and all icon paths.
- No-GSAP DOM smoke tests pass manifest rendering, generated Dock/Explore, manifest shortcuts, language switching, window minimization, and Dock restoration. A real locally vendored GSAP 3.13 smoke test passes boot, animated opening, and animated closing without DOM errors.
- Local HTTP delivery returns 200 for the HTML, CSS, JavaScript, locally vendored GSAP, three app marks, and editorial-credit image. The iGEM team wiki, GitHub profile, and existing live homepage links return 200.
- The faithful macOS-shell redesign was published from commit `5204d66` by [GitHub Pages run 30565833869](https://github.com/ansonlotiniat/ansonlotiniat.github.io/actions/runs/30565833869) on 2026-07-31. The live HTML, both stylesheets, App manifest, application JavaScript, landscape wallpaper, and all six local icons were verified byte-for-byte against the commit.

## Open questions

- The school poetry collection’s formal publication title is not present in the supplied files, so the homepage accurately describes it as the school English poetry collection without inventing a book title.
- Replace `og-v2.png` with an AnsonOS-specific social image in a later visual-asset pass.
- The retired Macao-atlas JavaScript, data, SVG, and vendored Three.js files remain in Git history and the repository but are not referenced by the current page; they can be removed in a separate cleanup if desired.

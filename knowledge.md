# Knowledge Base — Anson Lo Personal Site

Last updated: 2026-07-31 01:00 CST

## Reframed goal

Build a bilingual personal homepage that behaves like Anson Lo’s working computer rather than a document or portfolio feed. The current metaphor is “AnsonOS”: an original macOS-inspired desktop where a visitor searches for Anson, opens the tools he works through, and learns how he thinks from the interface of each tool.

The site must not assume that a portfolio is something to scroll from top to bottom. Its primary navigation is application- and state-based: Explore reveals workspaces, the Dock launches them, and several movable windows can remain open together. Xcode represents engineering systems, Visual Studio Code represents iGEM software/modelling/wiki delivery, Overleaf represents writing and editing, and Finder represents identity, method, and contact.

## Content boundaries

- No award wall, certificate list, competition ranking, repository grid, or generic skill badges.
- No research claims, speculative projects, pending positions, or unpublished results.
- Use only work that Anson directly supplied and publications verified against local source files.
- Traditional Chinese must be plain, specific, and conversational. Avoid manifesto language, inflated claims, and pseudo-poetic headings.
- The code displayed inside Xcode, Visual Studio Code, and Overleaf is explicitly presented as a product-logic/source metaphor. It explains verified work; it does not claim that the real projects used those exact filenames or source code.
- Product names and marks identify the tools being represented and do not imply endorsement.

## Current design decisions

- The homepage is a fixed “AnsonOS” desktop rather than a vertically scrolling page. An original aurora-like wallpaper, pointer-responsive layered geometry, menu bar, desktop shortcuts, live workspace widget, and magnifying Dock establish the first viewport.
- The desktop identity is deliberately integrated into the wallpaper instead of placed in a résumé card: `ANSON LO.OS`, Macao coordinates, and “student developer · editor · speaker” are visible before any application opens.
- Explore is a Spotlight-like command interface:
  - open it from the menu bar, desktop shortcut, Dock, `/`, `⌘K`, or `⌘Space` when the browser receives that event;
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
- The Xcode and Overleaf marks come from the CC0 Simple Icons project. The Visual Studio Code mark comes from Microsoft’s official brand asset. The marks are shown unmodified inside interfaces that explicitly represent those products.
- The Open Graph image is still `og-v2.png`, the previous systems/voice/words identity card. It contains accurate identity copy but does not yet depict the AnsonOS interface.

## Public content hierarchy

1. Desktop: identity, Macao, current PuiChing Macau iGEM 2026 workspace, and Explore.
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
- Xcode and Overleaf icon source: [Simple Icons](https://simpleicons.org/), CC0 1.0 with product trademarks retained by their owners.
- Visual Studio Code icon and usage reference: [Visual Studio Code brand guidelines](https://code.visualstudio.com/brand).

## Build status

- `index.html`, `style.css`, and `main.js` have been rebuilt around AnsonOS. The previous Three.js map runtime is no longer referenced or downloaded by the page.
- Real Xcode, Visual Studio Code, and Overleaf marks are stored locally under `assets/app-icons/`; exact source URLs, usage references, and SHA-256 hashes are recorded in `assets/app-icons/SOURCES.md`.
- Desktop pointer depth, boot choreography, live clock, persistent language choice, Explore filtering and keyboard navigation, four URL-addressable application windows, z-order, drag, minimize/restore, maximize, close, Dock state, and desktop/app focus are implemented.
- Xcode project switching, sports-day phase switching, debate role switching, Visual Studio Code workstream alignment, Overleaf source/preview switching, compilation status, and editorial-credit magnification are implemented.
- Accessibility includes a skip link, named controls, modal focus containment, tab/tabpanel relationships, live status messages, hidden/inert application states, keyboard alternatives, and reduced-motion operation.
- W3C HTML validation passes with zero errors and warnings. CSS parses successfully, 2,073 declarations pass the actionable grammar check, JavaScript syntax passes, all IDs/ARIA references/local assets resolve, and no legacy map runtime is referenced.
- No-GSAP, real-GSAP 3.13, and reduced-motion DOM tests pass for Explore, shortcuts, window management, all three application workspaces, language switching, compilation, and panel transitions.
- Local HTTP delivery returns 200 for the HTML, CSS, JavaScript, locally vendored GSAP, three app marks, and editorial-credit image. The iGEM team wiki, GitHub profile, and existing live homepage links return 200.
- The AnsonOS rebuild was published from commit `33abb55` by [GitHub Pages run 30563948010](https://github.com/ansonlotiniat/ansonlotiniat.github.io/actions/runs/30563948010) on 2026-07-31. The live HTML, stylesheet, application JavaScript, local GSAP runtime, all three application marks, and editorial-credit image were verified byte-for-byte against the committed local files.

## Open questions

- The school poetry collection’s formal publication title is not present in the supplied files, so the homepage accurately describes it as the school English poetry collection without inventing a book title.
- Replace `og-v2.png` with an AnsonOS-specific social image in a later visual-asset pass.
- The retired Macao-atlas JavaScript, data, SVG, and vendored Three.js files remain in Git history and the repository but are not referenced by the current page; they can be removed in a separate cleanup if desired.

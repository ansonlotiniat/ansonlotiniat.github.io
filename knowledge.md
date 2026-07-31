# Knowledge Base — Anson Lo Personal Site

Last updated: 2026-07-31 17:00 CST

## Reframed goal

Build a bilingual personal homepage that behaves like Anson Lo’s working Mac rather than a document or portfolio feed. The current metaphor is “AnsonOS”: a deliberately faithful macOS Tahoe 26 desktop shell where a visitor searches for Anson, opens the tools he works through, and learns how he thinks from the interface of each tool.

The site must not assume that a portfolio is something to scroll from top to bottom. Its primary navigation is application- and state-based: Explore reveals workspaces, the Dock launches them, and several movable windows can remain open together. Xcode represents engineering systems, Visual Studio Code represents iGEM software/modelling/wiki delivery, Overleaf represents writing and editing, and Finder represents identity, method, and contact.

## Content boundaries

- No award wall, certificate list, competition ranking, repository grid, or generic skill badges.
- No research claims, speculative projects, pending positions, or unpublished results.
- Use only work that Anson directly supplied and publications verified against local source files.
- Traditional Chinese must be plain, specific, and conversational. Avoid manifesto language, inflated claims, and pseudo-poetic headings.
- The code displayed inside Xcode, Visual Studio Code, and Overleaf is explicitly presented as a product-logic/source metaphor. It explains verified work; it does not claim that the real projects used those exact filenames or source code.
- Product names and marks identify the tools being represented and do not imply endorsement.

## Current design decisions

- The homepage is a fixed “AnsonOS” desktop rather than a vertically scrolling page. Its shell uses the measured geometry and interaction hierarchy of [macOS Web](https://macosweb.netlify.app/) as the canonical browser reference while retaining macOS Tahoe 26 application resources and Anson’s own MIT/workspace content. This is a clean-room visual reimplementation, not a wholesale copy of the reference source.
- The menu bar is a fully transparent 31 px interaction layer, following the user’s Tahoe direction rather than adding the reference site’s dark overlay. The wallpaper remains visible edge-to-edge and a compact two-layer text shadow keeps controls readable. Apple, File, Edit, View, Go, Window, and Help are working menus with keyboard navigation; Control Center, battery, and clock open native-style panels. Clicking the desktop activates Finder, and right-clicking it opens a bounded macOS context menu with working Clean Up and View Options controls.
- The Dock is a compact content-width bar positioned 4 px above the bottom edge. It matches the reference’s 66 px height, 14 px corner radius, neutral low-opacity glass, 20 px backdrop blur, and heavy grounded shadow. Default entries are 58 px and fine-pointer magnification is a continuous cursor-distance curve rather than discrete CSS hover steps: icons reach 128 px at the pointer, nearby icons fall away with a Gaussian curve, their transformed centres repack without overlap, and the glass stretches with the same animated total width. The implementation animates compositor transforms instead of width/height layout. Keyboard focus never leaves a clicked icon enlarged. The icon order is Finder, the real macOS 26 Apps launcher, Xcode, Visual Studio Code, Overleaf, and Mail. All are pinned-App entries, so there are no invented separators between Finder, work, and Mail; open-state dots remain.
- The former aurora illustration, giant `ANSON LO.OS` hero, live workspace widget, wallpaper parallax, and Lake Louise desktop were removed from the active shell. The current wallpaper is a real 2560×1600 view of MIT’s Great Dome and Killian Court; Anson’s identity belongs inside Finder rather than being printed over the photograph.
- Finder, Apps, Folder, Mail, and Xcode use icons converted directly from this build Mac running macOS Tahoe 26.3. The Apps image comes from `/System/Applications/Apps.app`, making the Explore launcher the same search-and-colour-grid tile shown by Tahoe rather than a custom magnifying-glass invention. Visual Studio Code uses its installed current macOS resource. Overleaf remains a documented Simple Icons mark inside a custom multi-layer glass tile; its Dock and Launchpad plates are deliberately inset inside the standard hit box so its visual mass matches the native icons instead of appearing oversized.
- Fine-pointer devices use an intentionally oversized, hard-edged pixel cursor with fluorescent-yellow fill, white outline, hover glow, and pressed state. Touch/coarse-pointer devices keep their native pointer behaviour.
- Launchpad and Spotlight are now separate macOS interactions:
  - the authentic Apps entry immediately after Finder opens a full-screen, 25 px-blurred Launchpad with a searchable four-column grid and the Dock still available;
  - the menu-bar search control, `/`, `⌘K`, or `⌘Space` opens the compact Spotlight-like Explore interface when the browser receives that event;
  - filter by English or Traditional Chinese keywords;
  - use Tahoe-style All Apps, Engineering, iGEM, and Writing browse chips;
  - use arrow keys and Enter to select;
  - use `⌥0`–`⌥3` as direct application shortcuts.
- Real macOS normally reserves `⌘Space` for system Spotlight before a webpage can see the keystroke. The site still listens for it, but the visible Explore controls, `/`, and `⌘K` are necessary in-page fallbacks.
- Windows are real interface state, not decorative screenshots. Their default presentation is now compact and centred like the reference rather than nearly full-screen: Finder is capped at 840×570, Visual Studio Code at 900×600, and the larger Xcode/Overleaf workspaces at 980×650, with 39 px title bars, 16 px corners, and a grounded `0 20px 30px` shadow. They can be opened together, focused by z-order, dragged by their title bars, minimized into and restored from the Dock, maximized, closed, and addressed through `#about`, `#xcode`, `#vscode`, and `#overleaf`.
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
- App launch metadata is centralized in `apps.config.js`. Portfolio Dock entries, Launchpad entries, Spotlight results, bilingual labels, keywords, product labels, icons, and `⌥number` shortcuts are generated from it. The shell inserts the fixed macOS Apps launcher after Finder and Mail after the portfolio entries; this keeps future portfolio Apps manifest-driven without pretending that Apps itself owns a portfolio window. `APP_MAINTENANCE.md` defines the extension contract and `scripts/validate-apps.mjs` enforces one manifest entry per window, unique IDs/shortcuts, bilingual copy, valid icons, all three launcher mounts, and script order.
- `macos.css` owns the desktop shell and native geometry while `style.css` owns application interiors. This boundary lets future Apps be added without rewriting the shell.
- The Open Graph image is still `og-v2.png`, the previous systems/voice/words identity card. It contains accurate identity copy but does not yet depict the AnsonOS interface.

## Public content hierarchy

1. Desktop: immediately recognizable macOS shell, MIT landscape wallpaper, Finder/Home shortcut, and Dock.
2. Apps/Launchpad and Spotlight: the second Dock icon browses all Apps; `⌘Space` searches and launches directly.
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
- Finder, Apps, Folder, Mail, Xcode, and Visual Studio Code icons were converted from installed macOS Tahoe 26.3 `.icns` resources; exact paths and hashes are recorded in `assets/app-icons/SOURCES.md`. Product marks remain the property of their owners.
- Overleaf icon source: [Simple Icons](https://simpleicons.org/), CC0 1.0 with product trademarks retained by their owners.
- Active wallpaper: [MIT Great Dome and Killian Court by Muzammil Soorma](https://unsplash.com/photos/gray-concrete-dome-building-at-daytime-9MByoiBNN1c), used under the Unsplash License; exact processing and hash are recorded in `assets/wallpapers/SOURCES.md`.
- Tahoe 26 reference: Apple documents Liquid Glass as a translucent material that reflects and refracts its surroundings, a completely transparent macOS menu bar, refined Dock/sidebar/toolbar materials, and light/dark/tinted/clear icon appearances in its June 2025 macOS Tahoe release material.
- Browser interaction reference: [macOS Web](https://macosweb.netlify.app/) was measured at a 1533×931 viewport on 2026-07-31. Its visible shell used a 30.6875 px menu bar, 66 px Dock, approximately 58 px resting icons, 128 px hovered icon, 80 px adjacent icon, full-screen blurred Launchpad, and a centred 768.5×432 Visual Studio Code window. Confidence is high because values were read from the rendered page rather than inferred from screenshots.

## Build status

- `index.html`, `style.css`, `macos.css`, `apps.config.js`, and `main.js` implement AnsonOS. The previous Three.js map runtime is still not referenced or downloaded by the page.
- The MIT photographic wallpaper and seven application/desktop marks are stored locally under `assets/`; source, usage, dimensions, and SHA-256 records are current. The older Lake Louise file remains as an unused, documented asset.
- Reference-proportion menu/status chrome, working application menus and status panels, live localized clock/calendar, desktop context menu and View Options, one right-aligned Home folder, a bottom-aligned reference-geometry Dock with native macOS 26 Apps icon, Launchpad, Spotlight, fluorescent pixel cursor, boot choreography, persistent language choice, four URL-addressable application windows, z-order, drag, minimize/restore, maximize, close, Dock state, and desktop/app focus are implemented.
- Xcode project switching, sports-day phase switching, debate role switching, Visual Studio Code workstream alignment, Overleaf source/preview switching, compilation status, and editorial-credit magnification are implemented.
- Accessibility includes a skip link, named controls, modal focus containment, tab/tabpanel relationships, live status messages, hidden/inert application states, keyboard alternatives, and reduced-motion operation.
- Both stylesheets parse with 3,044 non-font-face declarations; 2,890 directly checkable declarations pass CSS grammar matching. All JavaScript files pass syntax checks, and the App consistency validator passes four manifest entries, four windows, four unique shortcuts, four Explore filters, Dock + Launchpad + Spotlight mounts, three fixed shell icons, and all icon paths.
- No-GSAP DOM smoke tests pass the exact `Finder → Apps → Xcode → Visual Studio Code → Overleaf → Mail` Dock order, Launchpad search, Escape close, `⌘Space` Spotlight launch, Visual Studio Code launch, File menu, and Finder launch. A real locally vendored GSAP 3.13 smoke test passes `Launchpad → Xcode → minimize → Dock restore → close`.
- Real-browser QA passes 1533×931 desktop and 768×800 small-screen states, a fully transparent menu bar, exact 58→128 px continuous Dock magnification, packed icon boundaries without overlap, glass-width tracking, balanced Overleaf visual weight, click/focus reset, full-screen Launchpad, compact Visual Studio Code, working application menu, desktop context menu, View Options, Control Center, and `⌘Space`; the page console remains empty.
- W3C HTML validation has zero errors and two informational warnings (the Apple private-use glyph and bilingual language inference). Eleven unique local HTML/CSS references resolve, and local HTTP delivery returns 200 with correct content types for the shell and MIT wallpaper.
- The reference-fidelity macOS shell was published from interface commit `7421671` by [GitHub Pages run 30615737996](https://github.com/ansonlotiniat/ansonlotiniat.github.io/actions/runs/30615737996) on 2026-07-31. The live HTML, shell stylesheet, interaction JavaScript, and App manifest were verified byte-for-byte against the validated commit.

## Open questions

- The school poetry collection’s formal publication title is not present in the supplied files, so the homepage accurately describes it as the school English poetry collection without inventing a book title.
- Replace `og-v2.png` with an AnsonOS-specific social image in a later visual-asset pass.
- The retired Macao-atlas JavaScript, data, SVG, and vendored Three.js files remain in Git history and the repository but are not referenced by the current page; they can be removed in a separate cleanup if desired.

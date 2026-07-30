# Knowledge Base — Anson Lo Personal Site

Last updated: 2026-07-30 23:45 CST

## Reframed goal

Build a bilingual personal homepage that demonstrates Anson Lo’s product and UI/UX judgement through the page itself. It must feel authored and place-specific rather than like a polished portfolio template. The central metaphor is a “Macao Field Atlas”: a real Macao outline becomes a three-dimensional object whose layers represent systems, public voice, and words.

The site introduces a person working across software systems, public communication, editing, and writing. It is not an award wall, repository index, or collection of interchangeable project cards.

## Content boundaries

- No award wall, certificate list, competition ranking, repository grid, or generic skill badges.
- No research claims, speculative projects, pending positions, or unpublished results.
- Use only work that Anson directly supplied and publications verified against local source files.
- Traditional Chinese must be plain, specific, and conversational. Avoid manifesto language, inflated claims, and pseudo-poetic headings.
- Projects are explained through context, role, and design focus rather than trophy outcomes.

## Current design decisions

- Visual language: warm field-note paper, black, cobalt, signal orange, acid green, and sea green; oversized editorial type; hard rules, exposed controls, and deliberately square instruments. Avoid glass cards, gradient glows, pills, and generic “AI portfolio” surfaces.
- JetBrains Mono remains self-hosted for the Latin identity and interface copy. Traditional Chinese uses the native system sans-serif stack for comfortable reading.
- Interactivity is concentrated where it adds information:
  - the hero uses the real Macao boundary as a draggable, keyboard-operable Three.js relief; three controls separate, rotate, and recolour the same geography into systems, voice, and words;
  - the sports-day case is an information clock: moving through before/live/on-site states changes which information layer becomes primary;
  - debate operations switch between team and tournament role views while keeping shared information visibly central;
  - the iGEM instrument lets the visitor physically align software, modelling, and wiki workstreams into one delivery;
  - the book credit image has a pointer magnifier, and the poem is revealed by ringing a typographic bell;
  - persistent bilingual mode, a hide-and-return header, active-section feedback, full keyboard controls, touch-safe gestures, and reduced-motion support remain available.
- Three.js 0.185.1 is vendored locally under its MIT licence so the signature interaction is not dependent on a third-party runtime CDN. GSAP 3.13 and ScrollTrigger remain progressive enhancement only; core controls work if they fail.
- WebGL failure shows an intentional static “three working layers” poster. The page remains readable without JavaScript.
- The map boundary is a Natural Earth admin-0 map-subunit retrieved through Geoscience Australia. The page footer links the source and CC BY 4.0 attribution; Natural Earth states that its own data is public domain.
- The publication section uses the real `《澳門日記—回歸故事集》` editorial credit image. The poetry artifact is typeset from Anson’s verified title and supplied excerpt rather than represented by a fabricated cover.
- The Open Graph image is `og-v2.png`, a 1200 × 630 title card matching the rebuilt hero palette, layered workflow motif, and exact English identity copy.

## Public content hierarchy

1. Identity: Anson Lo, student developer, editor, and speaker from Macao.
2. Current role: core engineer across software, modelling, and the Wiki for PuiChing Macau iGEM 2026.
3. Working method: observe the real setting, structure the workflow, and make the next step clear.
4. Interactive case explorer: sports-day operations, debate operations, and iGEM engineering.
5. Publications and writing: `《澳門日記—回歸故事集》` and `Between Bells and Heartbeats`.
6. Current work: school leadership, iGEM, and ongoing interests.
7. Direct email and GitHub contact.

## Key claims and sources

- School roles, software projects, interests, and iGEM responsibilities were supplied directly by Anson on 2026-07-30; high confidence as first-party claims.
- PuiChing Macau iGEM 2026 link: [2026.igem.wiki/puiching-macau](https://2026.igem.wiki/puiching-macau/).
- `《澳門日記—回歸故事集》`: the local credit image lists `羅天逸` among the editors, and the local release document confirms the title and a January 2025 launch; high confidence.
- `Between Bells and Heartbeats`: the local poem and presentation script give the title, author name `Anson Lo`, class number, text, and school-poetry context; high confidence.
- JetBrains Mono source and licence: [JetBrains Mono](https://github.com/JetBrains/JetBrainsMono), SIL Open Font License 1.1.

## Build status

- `index.html`, `style.css`, and `main.js` have been rebuilt as the Macao Field Atlas while preserving the verified bilingual content.
- `map.js` builds the Macao MultiPolygon into three bevelled extruded meshes with drag, arrow-key, reset, mode-transition, viewport-pausing, resize, cleanup, and reduced-motion behaviour.
- `macao-boundary.geojson`, `vendor/three.module.min.js`, `vendor/three.core.min.js`, and `vendor/three-LICENSE.txt` are now local project assets.
- The three project instruments, publication magnifier, poem reveal, persistent language state, responsive menu, active navigation, and animation/static fallbacks are implemented.
- `og-v2.png` was generated as one cohesive social card, checked for exact text, and resized to 1200 × 630.
- JavaScript syntax, HTML5 parsing, Macao geometry generation, ID and ARIA relationships, GeoJSON shape/type, asset presence, local HTTP delivery, CSS block structure, and whitespace checks pass. Final link and live-deployment verification are pending.
- The previous interaction-led build is live at [ansonlotiniat.github.io](https://ansonlotiniat.github.io/). The Macao Field Atlas rebuild is implemented locally and awaiting its final publication commit.

## Open questions

- The school poetry collection’s formal publication title is not present in the supplied files, so the homepage accurately describes it as the school English poetry collection without inventing a book title.
- Add a portrait only if Anson later chooses an image that strengthens the composition without turning the page into a résumé template.

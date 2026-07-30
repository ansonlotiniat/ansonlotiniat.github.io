# Knowledge Base — Anson Lo Personal Site

Last updated: 2026-07-31 00:27 CST

## Reframed goal

Build a bilingual personal homepage that demonstrates Anson Lo’s product and UI/UX judgement through the page itself. It must feel authored and place-specific rather than like a polished portfolio template. The central metaphor is a “Macao Working Atlas”: a real Macao outline becomes a persistent three-dimensional space whose coordinates represent systems, public voice, and words.

The site must not assume that a portfolio is a document to scroll from top to bottom. Its primary navigation is spatial and state-based: visitors travel directly between working coordinates inside one fixed viewport. It is not an award wall, repository index, or collection of interchangeable project cards.

## Content boundaries

- No award wall, certificate list, competition ranking, repository grid, or generic skill badges.
- No research claims, speculative projects, pending positions, or unpublished results.
- Use only work that Anson directly supplied and publications verified against local source files.
- Traditional Chinese must be plain, specific, and conversational. Avoid manifesto language, inflated claims, and pseudo-poetic headings.
- Projects are explained through context, role, and design focus rather than trophy outcomes.

## Current design decisions

- Visual language: warm field-note paper, black, cobalt, signal orange, acid green, and sea green; oversized editorial type; hard rules, exposed controls, and deliberately square instruments. Avoid glass cards, gradient glows, pills, and generic “AI portfolio” surfaces.
- JetBrains Mono remains self-hosted for the Latin identity and interface copy. Traditional Chinese uses the native system sans-serif stack for comfortable reading.
- The desktop document itself does not scroll. The fixed atlas has four addressable states—Overview, Systems, Voice, and Words—with URL hashes and browser-history support. On small screens, long detail surfaces may scroll internally so content is not clipped, but vertical scrolling is no longer the site’s narrative or navigation model.
- Visitors can travel through map-coordinate buttons, the bottom route console, number keys 0–3, left/right keyboard navigation, or horizontal touch gestures. Escape returns to the full map. The map itself uses drag, wheel zoom, arrow-key rotation, plus/minus zoom, and R reset.
- Interactivity is concentrated where it adds information:
  - the real Macao boundary remains on screen throughout; changing coordinates moves, scales, rotates, separates, and recolours its three Three.js layers instead of replacing the page;
  - the sports-day case is an information clock: moving through before/live/on-site states changes which information layer becomes primary;
  - debate operations switch between team and tournament role views while keeping shared information visibly central;
  - the iGEM instrument lets the visitor physically align software, modelling, and wiki workstreams into one delivery;
  - the Voice coordinate is a three-position audience/order/tone signal instrument rather than another project card;
  - the Words coordinate switches between the real editorial credit and the poem; the book has a pointer magnifier and the poem is revealed by ringing a typographic bell;
  - method, current roles, direct contact, and data credits live in an information drawer rather than a conventional footer.
- Three.js 0.185.1 is vendored locally under its MIT licence so the signature interaction is not dependent on a third-party runtime CDN. GSAP 3.13 core choreographs state travel and instrument transitions; ScrollTrigger has been removed because document scrolling is no longer the interaction model. All state changes work without GSAP.
- WebGL failure shows an intentional static “three working layers” poster. The page remains readable without JavaScript.
- The map boundary is a Natural Earth admin-0 map-subunit retrieved through Geoscience Australia. The page footer links the source and CC BY 4.0 attribution; Natural Earth states that its own data is public domain.
- The publication section uses the real `《澳門日記—回歸故事集》` editorial credit image. The poetry artifact is typeset from Anson’s verified title and supplied excerpt rather than represented by a fabricated cover.
- The Open Graph image is `og-v2.png`, a 1200 × 630 title card matching the rebuilt hero palette, layered workflow motif, and exact English identity copy.

## Public content hierarchy

1. Overview coordinate: identity, Macao, current iGEM signal, and three spatial entry points.
2. Systems coordinate: sports-day operations, debate operations, and iGEM engineering in a switchable work console.
3. Voice coordinate: audience, order, tone, and current Speech Society role.
4. Words coordinate: `《澳門日記—回歸故事集》` and `Between Bells and Heartbeats`.
5. Information drawer: working method, current roles and interests, direct email/GitHub contact, and map credits.

## Key claims and sources

- School roles, software projects, interests, and iGEM responsibilities were supplied directly by Anson on 2026-07-30; high confidence as first-party claims.
- PuiChing Macau iGEM 2026 link: [2026.igem.wiki/puiching-macau](https://2026.igem.wiki/puiching-macau/).
- `《澳門日記—回歸故事集》`: the local credit image lists `羅天逸` among the editors, and the local release document confirms the title and a January 2025 launch; high confidence.
- `Between Bells and Heartbeats`: the local poem and presentation script give the title, author name `Anson Lo`, class number, text, and school-poetry context; high confidence.
- JetBrains Mono source and licence: [JetBrains Mono](https://github.com/JetBrains/JetBrainsMono), SIL Open Font License 1.1.

## Build status

- `index.html`, `style.css`, and `main.js` have been rebuilt around a fixed spatial viewport while preserving the verified bilingual content.
- `map.js` now treats Overview, Systems, Voice, and Words as distinct camera destinations. It builds the Macao MultiPolygon into three bevelled meshes with drag, wheel/keyboard zoom, arrow-key rotation, reset, viewport pausing, resize, cleanup, and reduced-motion behaviour.
- `macao-boundary.geojson`, the `macao-outline.svg` no-WebGL fallback, `vendor/three.module.min.js`, `vendor/three.core.min.js`, and `vendor/three-LICENSE.txt` are now local project assets.
- Direct coordinate travel, URL/history state, 0–3 and arrow-key navigation, horizontal touch travel, the information drawer and focus loop, three project instruments, Voice signal selector, publication magnifier, poem reveal, persistent language state, and animation/static fallbacks are implemented.
- `og-v2.png` was generated as one cohesive social card, checked for exact text, and resized to 1200 × 630.
- JavaScript syntax, HTML5 parsing, bilingual-pair counts, selector coverage, ID and ARIA relationships, control labelling, GeoJSON/SVG parsing, Three.js geometry generation, CSS parsing/property checks, direct-coordinate links, reduced-motion/modal isolation, no-GSAP DOM interactions, real GSAP 3.13 transitions, rapid-travel queuing, local HTTP delivery, and external links pass for the fixed-atlas rebuild. Final deployment verification remains.
- The previous Macao Field Atlas build remains published at [ansonlotiniat.github.io](https://ansonlotiniat.github.io/) while this non-scrolling spatial rebuild is validated locally.

## Open questions

- The school poetry collection’s formal publication title is not present in the supplied files, so the homepage accurately describes it as the school English poetry collection without inventing a book title.
- Add a portrait only if Anson later chooses an image that strengthens the composition without turning the page into a résumé template.

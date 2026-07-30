# Knowledge Base — Anson Lo Personal Site

Last updated: 2026-07-30 22:51 CST

## Reframed goal

Build a bilingual personal homepage that demonstrates Anson Lo’s product and UI/UX judgement through the page itself. The intended character is restrained, inward-looking, and highly interactive. Japanese design philosophy should appear through useful negative space, proportion, rhythm, and attention to behaviour—not through decorative grids, vertical type, stamps, coordinates, or ornamental lines.

The site introduces a person working across software systems, public communication, editing, and writing. It is not an award wall or repository index.

## Content boundaries

- No award wall, certificate list, competition ranking, repository grid, or generic skill badges.
- No research claims, speculative projects, pending positions, or unpublished results.
- Use only work that Anson directly supplied and publications verified against local source files.
- Traditional Chinese must be plain, specific, and conversational. Avoid manifesto language, inflated claims, and pseudo-poetic headings.
- Projects are explained through context, role, and design focus rather than trophy outcomes.

## Current design decisions

- Remove all decorative grid lines, vertical labels, coordinates, stamp motifs, registration marks, and heavy section rules.
- Visual language: warm off-white paper, charcoal text, deep indigo, muted moss, generous spacing, and a small number of soft surfaces.
- JetBrains Mono remains self-hosted for the Latin identity and interface copy. Traditional Chinese uses the native system sans-serif stack for comfortable reading.
- Interactivity is concentrated where it adds information:
  - the hero treats the current iGEM role as a layered system: pointer movement adds restrained depth without changing the reading order;
  - the working-method section becomes a pinned three-stage story on larger screens, with direct step controls; smaller screens and reduced-motion mode show the same material as a readable stack;
  - the three cases form a vertically driven horizontal reel on larger screens, with numbered keyboard controls and current-state feedback; touch layouts use native horizontal scroll-snap;
  - publication notes remain native modal dialogs with escape, backdrop, close-button, and focus behaviour;
  - persistent bilingual mode, a hide-and-return header, active-section feedback, a useful “next section” control, deliberate hover/focus states, and reduced-motion support.
- GSAP 3.13 and ScrollTrigger provide the progressive motion layer. The full page remains readable and navigable if the CDN scripts fail; animation work uses transforms/opacity, responsive match-media contexts, and explicit cleanup.
- There is no scroll-progress line. Content hierarchy comes from scale and space rather than borders.
- The publication section uses the real `《澳門日記—回歸故事集》` editorial credit image. The poetry artifact is typeset from Anson’s verified title and opening lines rather than represented by a fabricated cover.
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

- `index.html`, `style.css`, and `main.js` have been rebuilt around an interaction-led editorial direction while preserving the verified bilingual content.
- Hero depth, the pinned three-stage method story, the horizontal case reel, native mobile scroll-snap, magnetic/tilt pointer details, publication dialogs, persistent language state, and reduced-motion/static fallbacks are implemented.
- `og-v2.png` was generated as one cohesive social card, checked for exact text, and resized to 1200 × 630.
- JavaScript syntax, HTML5 parsing, bilingual-pair counts, ID and ARIA relationships, local assets, external links, social-image dimensions, prohibited-copy checks, CSS brace structure, and whitespace checks pass.
- The interaction-led rebuild was published from commit `7a9e2b3` to [ansonlotiniat.github.io](https://ansonlotiniat.github.io/) on 2026-07-30. The live HTML, stylesheet, JavaScript, social card, and publication image were verified byte-for-byte against the committed local files.

## Open questions

- The school poetry collection’s formal publication title is not present in the supplied files, so the homepage accurately describes it as the school English poetry collection without inventing a book title.
- Add a portrait only if Anson later chooses an image that strengthens the composition without turning the page into a résumé template.

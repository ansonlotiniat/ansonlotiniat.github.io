# Knowledge Base — Anson Lo Personal Site

Last updated: 2026-07-30

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
  - a fully keyboard-operable three-case explorer using accessible tab semantics;
  - publication notes presented in native modal dialogs with escape, backdrop, close-button, and focus behaviour;
  - persistent bilingual mode, mobile navigation, active-section feedback, deliberate hover/focus states, and reduced-motion support.
- There is no scroll-progress line. Content hierarchy comes from scale and space rather than borders.
- The publication section uses the real `《澳門日記—回歸故事集》` editorial credit image. The poetry artifact is typeset from Anson’s verified title and opening lines rather than represented by a fabricated cover.
- The Open Graph image is `og-calm.png`, a 1200 × 630 line-free title card matching the quiet site direction.

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

- `index.html`, `style.css`, and `main.js` rebuilt around the restrained, interaction-led direction.
- The three-case explorer and two publication dialogs are implemented with keyboard and reduced-motion behaviour.
- `og-calm.png` generated and resized to the social-card standard.
- HTML, CSS, JavaScript, bilingual-pair, ID relationship, local-asset, prohibited-content, and whitespace checks pass.
- Deployment pending for this revision.

## Open questions

- The school poetry collection’s formal publication title is not present in the supplied files, so the homepage accurately describes it as the school English poetry collection without inventing a book title.
- Add a portrait only if Anson later chooses an image that strengthens the composition without turning the page into a résumé template.

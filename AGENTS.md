# Working on AnsonOS

Read `knowledge.md` and `knowledge/map.md` before editing. Update concise knowledge and `Last updated` after important decisions, parameter changes, findings, or release status changes.

- Editable App source lives in `src/apps/<id>/`. Read its README and `APP_MAINTENANCE.md`.
- Root HTML/JS/CSS and `knowledge/apps.md` are generated. Run `npm run build`; never fix them directly.
- App imports stay within their own folder or `src/shared/`. Query only the injected App root. Keep launcher geometry in the shell.
- Use `npm run build && npm run check` before publishing; VS Code bridge changes also require `npm run test:vscode`.
- Preserve direct `file://`, stable hash IDs, `.nojekyll`, iframe vendor paths, content provenance, and the uniform icon contract.
- Do not control foreground GUI/apps, mouse, keyboard, or AppleScript without explicit authorization for the current task. Use headless tools for browser QA.
- Keep generated outputs with source changes when committing. Pages currently publishes main/root; CI is documented separately from deployment gating.

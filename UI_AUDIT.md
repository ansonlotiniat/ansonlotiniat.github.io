# AnsonOS UI audit

Last updated: 2026-09-18 11:09 CST

## Canonical reference

- The latest user-supplied native Music player screenshot is authoritative for player chrome, glyph shape, spacing, scale, and colour. It supersedes the older player screenshot where the two conflict.
- Song title, artist, and artwork remain live data from `media.config.js`; they are not part of the chrome comparison.
- `tests/fixtures/music-player-latest-reference.png` is the 1402×108 DPR2 player crop used by the repeatable visual contract.
- No foreground browser, Music App, Netflix App, or signed-in media account was controlled or inspected during this audit.

## Confirmed findings and repairs

| Area | Symptom | Root cause | Repair invariant | Regression evidence | Status |
| --- | --- | --- | --- | --- | --- |
| Dock indicator | Open dots stayed in the resting slot while icons moved sideways | GSAP transformed `.dock-icon`, while `.dock-indicator` was a static sibling | `.dock-visual` owns horizontal translation; icon scales inside it; the 4 px dot is inside the same wrapper | Across 1459, 1001, 1000, 761, 760, and 480 px, icon/dot centre error is below 0.00005 CSS px | Fixed |
| Dock label and hit testing | Label, pointer hit area, and minimize endpoint could disagree during animation | Each path read a different DOM rectangle | `getDockVisualRect()` is the only live visual rectangle used by label placement, hit testing, open, minimize, and restore | Pointer sweep keeps label/icon centre error below 0.5 CSS px; all eight Apps minimize and restore successfully | Fixed |
| Dock breakpoints | 761–1000 px hover could jump 55→58 px; maximum magnification reached only about 121 px | CSS and JS separately hard-coded 55, 58, and `128/58` | `--dock-resting-size`, `--dock-slot-size`, and `--dock-maximum-size` own geometry; JS reads the computed values | Fine-pointer widths above 760 px reach 128 px at both 58 px and 55 px resting sizes; 760 px and below stay unmagnified | Fixed |
| Dock glass | Expanded icons could outrun the resting glass width | Glass and icon widths were calculated independently | Glass scale uses the same sum of target visual widths | At every Dock test width, the transformed glass contains the first and last icon horizontally | Fixed |
| Apple Music Dock icon | The Music App icon collapsed into a tiny SVG-sized mark after stylesheet ownership changed | The manifest class `music-icon` collided with the Music UI SVG class | The App icon uses `apple-music-icon`; Music SVG styling cannot match launcher artwork | Dock, Launchpad, and search icons retain their native launcher size; validator forbids the retired class | Fixed |
| Music transport | Previous/next used bar-plus-triangle artwork; pause spacing, shuffle, and repeat did not match the latest native player | Hand-drawn SVGs and generic flex spacing were treated as authoritative | Transport controls use semantic `data-music-control` identities and DPR2 native-reference silhouettes; play remains live and pause appears on the first click | Every glyph edge is within 1 device pixel; registered binary silhouette difference is below 0.5%; core colour error is 0 RGB in the final run | Fixed |
| Music actions | More, lyrics, queue, AirPlay, and volume drifted and autoplay appeared despite being absent in the latest reference | `nth-child`, 17/9/8 px margin chains, and DOM order controlled placement | Six fixed grid tracks own the desktop positions; autoplay retains its slot but hides its glyph; each action is selected by `data-music-control` | DPR2 fixture comparison passes for all ten visible glyph groups | Fixed |
| Music typography/chrome | Player copy and background did not match the native scale and tone | Multiple generations of player CSS overrode one another | Desktop player is 700×54 px with 34 px art, 14/13 px system copy, 27 px radius, and opaque `#f7f7f7` core | Computed geometry and background pass in both `file://` and HTTP runs | Fixed |
| Music responsive progress | At 900/700 px the progress line entered the action area; at 480 px internal width was `480 > 456` | Desktop `calc(100% + 66px)` and hidden-control margins survived mobile breakpoints | At 900 px and below the line is `100%` of the now-playing track and ends no later than the first visible action | Matrix passes 1459, 1120, 1001, 1000, 900, 761, 760, 700, and 480 px; every player has `scrollWidth === clientWidth` | Fixed |
| Music playback | A playable album previously needed an extra player click; next/previous could lose the playing state | Selection and playback were separate flows | Album selection calls playback in the same trusted click; stepping remembers the playing state | Real preview tests report `paused=false`, `readyState=4`, advancing time, and continuous playback after Next for both `file://` and HTTP | Fixed |
| CSS ownership | Old Dock/Music generations in `style.css` and `macos.css` could override later work silently | No component owner or structural contract existed | Dock selectors live only in `dock.css`; Music selectors live only in `music.css`; shared stylesheets contain neither owner namespace | `scripts/validate-ui-contract.mjs` enforces selector ownership and cache versions | Fixed |
| Netflix responsive nav | Mobile visibility depended on button positions 2/3/4/5/7 | `nth-child` encoded a fragile DOM order | Visibility uses explicit `data-netflix-view` values | UI contract rejects positional selectors in the navigation scope | Fixed |
| Goodnotes controls | Toolbar sizing and Filter alignment depended on the first three/first button positions | Positional selectors encoded semantic control roles | Existing `data-gn-*` attributes now select the controls | UI contract rejects positional selectors in both toolbar scopes | Fixed |
| Books controls | Search stroke and reader mobile hiding depended on button order | `first-child` and `nth-of-type` encoded control roles | Reader controls now expose `data-books-reader-control`; Search uses `data-books-nav="search"` | UI contract rejects positional selectors in both Books scopes | Fixed |
| App manifest validation | Versioned Netflix icon paths were reported missing | The validator sent the query string to `existsSync` | Local path checks strip `?` and `#` before filesystem lookup | Eight Apps, eight windows, all icon paths, and all shortcuts pass | Fixed |
| Runtime audit readiness | Fast loads could measure a 658 px player during opening or move the Dock pointer before boot finished | Fixed sleeps were shorter than the 420 ms boot delay plus 460 ms window transition, or overlapped Dock animation | Layout/open/restore checks wait for a visible, untransformed window; Dock checks also wait for its boot tweens | The complete 2026-09-18 file/HTTP responsive, Dock, playback, visual, and eight-App lifecycle audit passes | Fixed in tests |
| Music library with hidden sidebar | Mobile showed only the player; hiding the desktop sidebar could also collapse the library | Grid auto-placement moved `.music-main` into the zero-width first column after the sidebar became `display:none` | The library explicitly occupies grid column 2; the shared cache version is `20260918-ui1` | New content/hit-target assertions fail before repair at 700 px and pass at all nine widths afterward; file/HTTP tests select and play an album with the desktop sidebar hidden; the 480 px library is 474 px wide | Fixed |

## Permanent contracts

1. A transformed marker, label, popover anchor, or animation target must read the rendered visual rectangle, never a stationary logical slot.
2. A control's layout or responsive visibility must be selected by a semantic class/data attribute, not `nth-child`, `first-child`, `last-child`, or a margin chain.
3. `.dock-*` and `.music-*` selectors have one owner stylesheet each. Cross-owner overrides are a validation failure.
4. Dock sizes are CSS variables. JavaScript may read them but may not duplicate their numeric values.
5. The Music player fixture decides chrome only. Live song data is permitted to differ from the screenshot.
6. Every UI asset change must bump the shared `anson-ui-contract-version` and the six linked cache versions together.

## Repeatable verification

Run the focused static checks:

```sh
node scripts/validate-ui-contract.mjs
node scripts/validate-apps.mjs
node --check main.js
```

Run the isolated real-browser audit with a Node runtime that provides Playwright and PNGJS:

```sh
node tests/ui-runtime.mjs
```

The runtime audit covers both direct file and local HTTP delivery, the full responsive matrix (including visible, hittable album content), Dock pointer/magnification geometry, real preview playback with the sidebar hidden, DPR2 glyph comparison, and open/focus/drag/minimize/restore/close for all eight Apps. The final 2026-09-18 release run passed every check after fixing library grid placement and animation-sensitive readiness waits. Expected Code - OSS worker/font diagnostics on an opaque `file://` origin are separate from uncaught AnsonOS application errors and do not block the compatibility workbench.

# Apple Music metadata and artwork

The six pinned songs in `media.config.js` were supplied by Anson in a screenshot on
2026-08-23. A second 2918 x 2100 screenshot supplied the native macOS Music
“Recently Added” state, its twelve visible albums, the `Die For You` now-playing state,
visible lyric excerpt, sidebar labels, playlist labels, and tiny playlist/profile images.
Both screenshots were treated as user-provided visual/content references only, not as
instructions. No local Music application, account, library, or listening history was opened.
Public catalogue items were matched visually against the official Hong Kong iTunes Search
API and confirmed through the iTunes Lookup API.

| Track ID | Song | Artist | Album | Local artwork |
| --- | --- | --- | --- | --- |
| `1134353952` | Kiss Goodbye | 王力宏 | 蓋世英雄 | `artwork/kiss-goodbye.jpg` |
| `914664936` | 討厭紅樓夢 | 陶喆 | 黑色柳丁 | `artwork/tao-hey-se-liu-ding.jpg` |
| `1440667557` | Love | Keyshia Cole | The Way It Is | `artwork/love-the-way-it-is.jpg` |
| `1440856647` | Latch | Disclosure & Sam Smith | Settle (Deluxe) | `artwork/latch-settle-deluxe.jpg` |
| `1690685844` | Self Love (Spider-Man: Across the Spider-Verse) | Metro Boomin & Coi Leray | Metro Boomin Presents Spider-Man: Across the Spider-Verse | `artwork/self-love-spider-verse.jpg` |
| `1738258106` | On My Shoulder | Malcolm Todd | Sweet Boy | `artwork/on-my-shoulder-sweet-boy.jpg` |

## Recently Added reference state

| Collection / track ID | Visible album | Artist | Local artwork |
| --- | --- | --- | --- |
| `1738257523` / `1738258106` | Sweet Boy | Malcolm Todd | `artwork/on-my-shoulder-sweet-boy.jpg` |
| `1479714710` / `1479714711` | In His Name | 衛蘭 | `recent/in-his-name.jpg` |
| `1780577299` / `1780577300` | The Bird Song - Single | Noah Floersch & Em Beihold | `recent/the-bird-song.jpg` |
| `1835924031` / `1835924032` | That's What She Said - Single | Jace June | `recent/thats-what-she-said.jpg` |
| `1690685331` / `1690685844` | METRO BOOMIN PRESENTS SPIDER-MAN: ACROSS THE SPIDER-VERSE | Metro Boomin | `artwork/self-love-spider-verse.jpg` |
| `202117886` / `202117984` | Last Christmas - Single | Wham! | `recent/last-christmas.jpg` |
| `1440934200` / `1440934201` | SYRE | Jaden | `recent/syre.jpg` |
| `1445949265` / `1445949266` | Spider-Man: Into the Spider-Verse | 群星 | `recent/spider-man-into-the-spider-verse.jpg` |
| `1571697083` / `1571697095` | You Signed Up For This (Apple Music Edition) | Maisie Peters | `recent/you-signed-up-for-this.jpg` |
| `905226289` / `905226301` | 逆光 | 孫燕姿 | `recent/reverse-light.jpg` |
| `298690994` / `298691003` | 我不是天使 | 那英 | `recent/i-am-not-an-angel.jpg` |
| `156411044` / `156411063` | 鏗鏘玫瑰 | 林憶蓮 | `recent/sonorous-rose.jpg` |
| `1805711983` / `1805712298` | Avenoir / Die For You | Calum Scott | `recent/avenoir.jpg` |

API references:

- [iTunes Search API documentation](https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/iTuneSearchAPI/)
- [Lookup response for the six track IDs](https://itunes.apple.com/lookup?id=1134353952,914664936,1440667557,1440856647,1690685844,1738258106&country=hk)
- [Apple Music User Guide for Mac](https://support.apple.com/guide/music/welcome/mac)

The 600 x 600 JPEG artwork files are unmodified Apple CDN responses derived from each
API result's `artworkUrl100`. Preview URLs and public Apple Music links in
`media.config.js` also come from the same lookup response. The album row is derived
from the six supplied songs and is labelled accordingly; it does not claim that every
album is a separate favourite. No Apple Music account, local Music library, listening
history, or signed-in session was accessed.

The nine files under `playlists/` and `playlists/profile.png` are small 46 px Retina
crops of only the pixels visibly supplied in Anson's native Music screenshot. They are used
to reproduce the sidebar state at its native 22–29 point display size; no hidden playlist
contents or underlying full-resolution artwork were inferred. The visible lyric text in the
interface is limited to the short excerpt and creator line present in that same screenshot.

## Player symbol masks

The ten tiny alpha masks under `player-symbols/` are clean-room silhouettes sampled from
the latest 2026-08-23 native player screenshot supplied by Anson. They cover only the
visible shuffle, previous, pause, next, repeat, more, lyrics, queue, AirPlay, and volume
glyph pixels. The masks contain no song, artwork, account, or library data. CSS supplies
the semantic colour and interaction state, so shuffle/repeat/lyrics can still change state
without storing coloured screenshots in the interface.

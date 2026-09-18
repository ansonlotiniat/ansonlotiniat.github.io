# Application icon sources

Prepared from a Mac running macOS Tahoe 26.3 for the AnsonOS interface. The original set was recorded
on 2026-07-31; the installed Goodnotes 7.1.6 and system Books icons were added on 2026-08-02. Netflix
and Music were added on 2026-08-23.

| File | Source on the build Mac | Usage reference | SHA-256 |
| --- | --- | --- | --- |
| `finder.png` | `/System/Library/CoreServices/Finder.app/Contents/Resources/Finder.icns` | Apple Finder product identification; Apple retains all rights in its marks. | `4f6c4190d4a9644a879805b91c4cbfeb3486bb13174eb341658c8f7a0f51ad59` |
| `apps.png` | `/System/Applications/Apps.app/Contents/Resources/AppIcon.icns` | macOS Tahoe Apps launcher identification; Apple retains all rights. | `354dbeb41fc9b3c0fd582444a13a2685ecf826a2e755009e32fdcf075cdba81e` |
| `home-folder.png` | `/System/Library/CoreServices/CoreTypes.bundle/Contents/Resources/GenericFolderIcon.icns` | macOS Tahoe folder interface identification; Apple retains all rights. | `73354962134a0c65adec35d5353321d51cd93f1c854d0580b4241c22d62cf6ae` |
| `mail.png` | `/System/Applications/Mail.app/Contents/Resources/ApplicationIcon.icns` | Apple Mail product identification; Apple retains all rights in its marks. | `2a938667d944120e246c5c69898df38a38fc5dc718357965514bad8dc2a8b9ad` |
| `xcode.png` | `/Applications/Xcode.app/Contents/Resources/Xcode.icns` | Xcode product identification; Xcode and its icon are trademarks of Apple Inc. | `3ac377593c84dbeaea4d741f0f2917dd5f6d2ebecffefe6b39cd4675030cbc94` |
| `visual-studio-code.png` | `/Applications/Visual Studio Code.app/Contents/Resources/Code.icns` | [Visual Studio Code icon and name usage guidelines](https://code.visualstudio.com/brand); Microsoft retains all rights in its marks. | `364325eb93dce048408ee0a7d93e7e7a76b03efd89b0bcacf9ccfd38e9acc477` |
| `overleaf.svg` | `https://cdn.simpleicons.org/overleaf` | [Simple Icons CC0 1.0](https://github.com/simple-icons/simple-icons/blob/develop/LICENSE.md); Overleaf is a trademark of its owner. | `4da8fc6b8cbb89ff7eb9c67edbf89815221a5670af244956f5f37df4ee3b93b0` |
| `goodnotes.png` | `/Applications/Goodnotes.app/Contents/Resources/AppIcon.icns` (Goodnotes 7.1.6) | Goodnotes product identification; Goodnotes and its icon are trademarks of their owner. | `ef693c0fd23ab992cb4fcd4298b239bfb69edd0cb03e1eab37fb1c253606bac4` |
| `books.png` | `/System/Applications/Books.app`, exported from the installed application through macOS `NSWorkspace`, then resized to a Retina-safe 256×256 web asset | Apple Books product identification; Apple retains all rights in its marks. | `dcf2e2fdd3dee45e713635b577a78812f2db9b9a306c2625f2c7393bac726d86` |
| `netflix.png` | [Netflix on the Apple App Store](https://apps.apple.com/us/app/netflix/id363590051), official 512 px App icon returned by Apple's iTunes Lookup API for bundle `com.netflix.Netflix` | Netflix mobile App product identification; Netflix retains all rights in its name and mark. | Not generated for this update. |
| `apple-music.png` | `/System/Applications/Music.app/Contents/Resources/AppIcon.icns`, converted to a 256×256 PNG with macOS `sips` | Apple Music product identification; Apple retains all rights in its marks. | Not generated for this update. |

The `.icns` resources were converted to PNG with macOS `sips` and resized only; Books was exported
through `NSWorkspace` so the current Tahoe application artwork, rather than the small legacy bitmap,
is preserved.
They identify the represented applications inside a personal, non-affiliated interface;
they are not recoloured or combined into Anson’s identity.

The Netflix asset was replaced on 2026-08-23 because the earlier public-site favicon was a
transparent red `N`, while Anson requested the current mobile App icon consistently in the Dock,
Apps launcher, and search results. The downloaded Apple CDN response is stored without recolouring.
It is a square JPEG because App Store clients apply the final icon mask themselves; the interface
therefore clips it with the same 22.37% squircle treatment in all three launcher contexts.

On 2026-09-18 its rendered size was normalized to `204/256` (`79.6875%`) of the
launcher canvas. The fully opaque Netflix asset otherwise made its plate roughly
25% larger than neighbouring icons: Finder, Books, and Xcode each have a 204 px
strong-alpha plate inside their 256 px PNG. Dock, Apps, and Spotlight now centre
Netflix at this same ratio before applying its existing mask. The source artwork
and the shared Dock hit area/magnification curve are unchanged.

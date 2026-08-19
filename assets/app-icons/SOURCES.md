# Application icon sources

Prepared from a Mac running macOS Tahoe 26.3 for the AnsonOS interface. The original set was recorded
on 2026-07-31; the installed Goodnotes 7.1.6 and system Books icons were added on 2026-08-02.

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

The `.icns` resources were converted to PNG with macOS `sips` and resized only; Books was exported
through `NSWorkspace` so the current Tahoe application artwork, rather than the small legacy bitmap,
is preserved.
They identify the represented applications inside a personal, non-affiliated interface;
they are not recoloured or combined into Anson’s identity.

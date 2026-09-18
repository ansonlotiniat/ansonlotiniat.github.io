# AnsonOS App 維護指南

Dock、Launchpad、Spotlight／Explore 搜尋結果、App 名稱、圖示與 `⌥數字` 快捷鍵都由
[`apps.config.js`](apps.config.js) 這一份清單生成。新增 App 時，不要手動複製 Dock
按鈕、Launchpad 圖示或搜尋結果。

## 新增一個 App

1. 把圖示放入 `assets/app-icons/`，盡量使用 512×512 或以上、帶透明背景的 PNG。
   Dock 的互動盒固定為 58×58 px，放大曲線會統一縮放整個 `.dock-icon`。若原始圖示是
   滿版方形底板、看起來比 macOS 原生圖示重，不要改 Dock 盒或為單一 App 改放大倍率；
   應在該 App 的 `.dock-icon.<className>` 內用 inset 偽元素繪製較小底板，再縮小內部
   `img`。Overleaf 是現成範例：底板直接採用 Xcode 圖檔量得的 `204/256` 尺寸比例與
   `44/204` 圓角比例，而不是猜一個固定 px 值。這能保持所有 App 的命中區、連續曲線和
   玻璃寬度一致。
   若底板已含在滿版點陣圖內（例如 Netflix），直接把 `img` 以 `204/256`（79.6875%）
   的比例縮小並置中，並在 Dock、Launchpad 和 Spotlight 使用相同比例。
2. 在 `apps.config.js` 的 `apps` 陣列加入一筆：

```js
{
    id: "new-app",
    appLabel: "App Name",
    group: "work",
    shortcut: "8",
    icon: {
        src: "assets/app-icons/new-app.png",
        className: "new-app-icon",
    },
    title: {
        zh: "中文工作區名稱",
        en: "English workspace title",
    },
    subtitle: {
        zh: "一行具體說明",
        en: "One concrete line",
    },
    dockLabel: {
        zh: "App Name",
        en: "App Name",
    },
    keywords: "中英文 搜尋 關鍵字 keywords",
}
```

3. 在 `index.html` 的 `.window-layer` 內加入同 ID 的視窗：

```html
<section
    class="app-window new-app-window"
    data-window="new-app"
    data-app-label="App Name"
    aria-labelledby="new-app-window-title"
    hidden
>
    <div class="window-surface">
        <header class="window-titlebar" data-drag-handle>
            <div class="traffic-lights" role="group" aria-label="Window controls">
                <button class="traffic-close" type="button" data-window-action="close" aria-label="Close window"></button>
                <button class="traffic-minimize" type="button" data-window-action="minimize" aria-label="Minimize window"></button>
                <button class="traffic-maximize" type="button" data-window-action="maximize" aria-label="Maximize window"></button>
            </div>
            <h2 id="new-app-window-title">App Name</h2>
            <span class="titlebar-spacer" aria-hidden="true"></span>
        </header>
        <!-- App-specific content -->
    </div>
</section>
```

4. 在 `style.css` 寫一般 App 內部內容；只在需要改桌面殼層時才修改 `macos.css`。
   Dock 幾何只能寫入 `dock.css`，Music 介面只能寫入 `music.css`。不要從其他檔案覆蓋
   `.dock-*`／`.music-*`，也不要用 `nth-child` 或左右 margin 鏈定位控制項；控制項應有
   穩定的 class 或 `data-*` 身分。
5. 如果 App 有分頁或可操作內容，在 `main.js` 加一個以 App 名稱開頭的 controller，
   並確保鍵盤與 `prefers-reduced-motion` 仍可用。
6. 記錄第三方圖示來源與授權到 `assets/app-icons/SOURCES.md`。
7. 執行：

```sh
node scripts/validate-apps.mjs
node scripts/validate-ui-contract.mjs
node tests/ui-runtime.mjs
```

檢查器會阻止以下常見錯誤：重複 ID、重複快捷鍵、清單與視窗 ID 不一致、缺少中英
文字段、圖示路徑失效、固定 Apps／Folder／Mail 殼層圖示遺失、Dock／Launchpad／
Spotlight 掛載點遺失、Apps 入口遺失，以及 script 載入順序錯誤。
UI contract 會另外阻止 Dock／Music selector 越權、播放器 DOM 順序耦合、缺少
`.dock-visual`、CSS/JavaScript 尺寸重新硬編碼，以及 cache version 不同步。真實瀏覽器
測試則覆蓋 `file://`／HTTP、responsive overflow、Dock 幾何、Music 視覺／播放和所有
App 的開啟、拖動、最小化及還原。

## 分組與排序

- `group: "system"` 放 Finder 類系統入口。
- `group: "work"` 放作品 App。
- `group: "watching"` 放電影與影集片單。
- `group: "listening"` 放專輯與歌曲。
- 作品 App 依照陣列順序同步出現在 Dock、Launchpad 和 Spotlight。macOS 26 的固定
  `Apps` 入口會自動放在 Finder 後面，因此不需要加入 manifest，也不會占用
  `⌥數字` 快捷鍵。
- Dock 的 `Apps` 入口打開全螢幕 Launchpad；選單列搜尋、`/`、`⌘K` 和瀏覽器能收到
  按鍵時的 `⌘Space` 打開 Spotlight／Explore。兩個介面共用同一份 manifest，但用途
  不同：Launchpad 用於瀏覽，Spotlight 用於快速搜尋。
- 所有目前項目都屬於釘選 App，所以 Dock 不在 Finder、作品 App 與 Mail 之間插入
  假分隔線；將來只有加入「最近使用」或「文件／垃圾桶」區域時才應新增原生分隔線。
- `dockLabel` 只填 App 的固定名稱，不加入用途說明。Dock 以一個共享名稱泡泡追蹤實際
  放大、位移後的 icon；游標經過 icon 間空隙時會保留上一個名稱，直到碰到下一個 icon。
- Mail 是固定在 Dock 最右側的聯絡動作，不屬於作品 App 清單。
- Spotlight／Explore 的分類按鈕直接搜尋 manifest 的 `keywords`。若新 App 要出現在
  Code、iGEM、Writing、Study Notes 或 Media 分類，加入對應英文關鍵字即可；新增分類只需在
  `index.html` 加一個 `data-explore-filter="關鍵字"` 按鈕，不必修改 JavaScript。

## 個人媒體資料

Netflix 片單和 Music 專輯／歌曲放在 `media.config.js`。只能加入 Anson 明確提供的項目；
不從瀏覽器歷史、私人帳戶或本機 Music 資料庫推測。Netflix 可用 `heroId` 指定主視覺，
每個項目可用 `id`/`title`/`type`/`year`/`rating`/`genreZh`/`genreEn`/
`descriptionZh`/`descriptionEn`/`cast`/`language`/`artwork`/`logo`/`url`/`isNew`。
Music 專輯可用 `title`/`artist`/`artwork`；歌曲可再加 `album`/`duration`/`url` 及選用的
`previewUrl`。素材的公開來源記在 `assets/netflix/SOURCES.md` 和 `assets/music/SOURCES.md`。

## 改名或刪除

- 改 ID 時，同步修改 `data-window`、任何 `data-open-app` 深層入口，以及舊網址
  `#app-id` 的外部連結。
- 刪除時，同時刪除 manifest 項目、對應視窗、專用 controller/CSS 和不用的圖示。
- 每次變更後都跑檢查器；它以 `apps.config.js` 與 `index.html` 的一對一關係為準。

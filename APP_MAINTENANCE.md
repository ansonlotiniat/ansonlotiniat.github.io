# AnsonOS App 維護指南

Dock、Explore 搜尋結果、App 名稱、圖示與 `⌥數字` 快捷鍵都由
[`apps.config.js`](apps.config.js) 這一份清單生成。新增 App 時，不要手動複製 Dock
按鈕或 Explore 結果。

## 新增一個 App

1. 把圖示放入 `assets/app-icons/`，盡量使用 512×512 或以上、帶透明背景的 PNG。
2. 在 `apps.config.js` 的 `apps` 陣列加入一筆：

```js
{
    id: "new-app",
    appLabel: "App Name",
    group: "work",
    shortcut: "4",
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
        zh: "App Name — 中文用途",
        en: "App Name — English purpose",
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

4. 在 `style.css` 寫 App 內部內容；只在需要改桌面殼層時才修改 `macos.css`。
5. 如果 App 有分頁或可操作內容，在 `main.js` 加一個以 App 名稱開頭的 controller，
   並確保鍵盤與 `prefers-reduced-motion` 仍可用。
6. 記錄第三方圖示來源與授權到 `assets/app-icons/SOURCES.md`。
7. 執行：

```sh
node scripts/validate-apps.mjs
```

檢查器會阻止以下常見錯誤：重複 ID、重複快捷鍵、清單與視窗 ID 不一致、缺少中英
文字段、圖示路徑失效、固定 Apps／Folder／Mail 殼層圖示遺失、Apps 入口遺失，以及
script 載入順序錯誤。

## 分組與排序

- `group: "system"` 放 Finder 類系統入口。
- `group: "work"` 放作品 App。
- 作品 App 仍依照陣列順序顯示。macOS 26 的固定 `Apps`／Explore 入口會自動放在
  Finder 後面，因此不需要加入 manifest，也不會占用 `⌥數字` 快捷鍵。
- 所有目前項目都屬於釘選 App，所以 Dock 不在 Finder、作品 App 與 Mail 之間插入
  假分隔線；將來只有加入「最近使用」或「文件／垃圾桶」區域時才應新增原生分隔線。
- Mail 是固定在 Dock 最右側的聯絡動作，不屬於作品 App 清單。
- Tahoe Explore 的分類按鈕直接搜尋 manifest 的 `keywords`。若新 App 要出現在
  Engineering、iGEM 或 Writing 分類，加入對應英文關鍵字即可；新增分類只需在
  `index.html` 加一個 `data-explore-filter="關鍵字"` 按鈕，不必修改 JavaScript。

## 改名或刪除

- 改 ID 時，同步修改 `data-window`、任何 `data-open-app` 深層入口，以及舊網址
  `#app-id` 的外部連結。
- 刪除時，同時刪除 manifest 項目、對應視窗、專用 controller/CSS 和不用的圖示。
- 每次變更後都跑檢查器；它以 `apps.config.js` 與 `index.html` 的一對一關係為準。

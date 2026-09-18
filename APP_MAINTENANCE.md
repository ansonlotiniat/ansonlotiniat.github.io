# AnsonOS App 維護指南

Last updated: 2026-09-18

**只修改 `src/`；根目錄的 HTML、JS、CSS 是建置產物。** 完整入口見[維護地圖](knowledge/map.md)，每個 App 見[自動生成索引](knowledge/apps.md)。

## 新增 App

```sh
npm ci
npm run app:new -- notes "Notes"
npm run build
npm run dev
```

指令從 `src/apps/_template/` 建立獨立目錄，分配排序與可用 `⌥數字`。數字用完後 `shortcut` 為 `null`，其他入口照常運作。同名 App 會被拒絕，不會覆蓋。

```text
src/apps/notes/
├── manifest.json     名稱、中英說明、排序、搜尋字、快捷鍵、圖示
├── view.html         一個 data-window="notes" 視窗
├── controller.js     mount()、互動狀態與生命週期
├── styles.css        App 內部畫面
├── window.css        視窗大小、標題列、responsive 規則
├── assets/           自己的圖片等資產
└── README.md         內容來源、操作、狀態、限制、驗證
```

需要資料時再加 `content.json`／`content.js`。`manifest.id` 必須等於資料夾名稱，採小寫 kebab-case；顯示名稱可含空格或中文。`order` 是不重複的非負整數。資料夾以 `_` 開頭不會註冊。

建置自動組合視窗、註冊 controller，生成 Dock／Apps／Spotlight、快取版本和維護索引。**不需要修改 shell、根目錄 `index.html`／`main.js` 或另一個 App。** `npm run dev` 監看來源並重建；儲存後手動重新整理瀏覽器。

## 控制器

Default export：`mount({ root, manifest, openApp, reportPointer })`。每頁只呼叫一次，初始語言已設定；在此渲染初始狀態、绑定事件。可回傳以下任選 hooks：

| Hook | 時機 |
| --- | --- |
| `open()` | 視窗顯示／還原前 |
| `close()` | 關閉動畫完成，視窗已隱藏 |
| `minimize()` | 最小化完成 |
| `languageChanged()` | 文件語言改變後，更新動態文字 |

關閉不銷毀狀態、不重新 mount；重開不能重複绑定事件。重載頁面才清空目前的記憶體狀態。長期資源由 App 決定何時停止；目前 Music 保留背景播放。

App 只能 import 自己目錄和 `src/shared/`，不能 import shell／另一個 App。DOM 查詢用 `root.querySelector()`；`document.createElement()` 可用。跨 App 導覽使用 `openApp(id)` 或靜態 `data-open-app`；動態建立的按鈕使用前者。

只有須在 eager iframe 解析前接收訊息時才使用選用的 `early.js`：`prepare({ getRoot })` 於 head 執行，目前僅 VS Code 使用。

## 樣式、圖示與素材

- `styles.css` 放內容，`window.css` 放視窗與 native chrome。建置用零 specificity 的 `:where()` 將規則限制於自己視窗；`@font-face`／keyframe 名稱仍是全域，須用 App 專屬名稱。
- 桌面／視窗 primitive 在 `src/shell/styles/`；Dock 只由 `dock.css` 控制，底板只由 `icons.css` 控制。App 不能覆寫 launcher 或 shell。
- 按鈕使用有意義的 class／`data-*`，不靠第幾個按鈕或 margin 鏈定位。窄螢幕使用 App 內部捲動，不讓整個桌面溢出。
- 完整圖示底板在 manifest 記錄 `crop: { canvas, x, y, size }`；單純標誌用 `symbol: true` 及 `background`。所有 icon 共用 renderer，不為個別 App 調大小。靜止桌面 Dock 底板目前為 47×47 CSS px、間距 11 px。
- 圖片／CSS URL 以發布站點根目錄為基準，例如 `src/apps/notes/assets/icon.svg`。既有素材保留 `assets/` 與其來源紀錄；新專屬素材可放自己目錄。
- 只加入明確提供或核實的公開內容，並記錄來源／授權。不從私人帳戶、瀏覽歷史、本機 App 推測內容。

## 更新與移除

改名只改顯示欄位；改 ID 會破壞原有 `#app-id` 連結。一般內容改自己的 view／content；Netflix／Music 資料各在 `src/apps/<id>/content.json`。

停用可改名為 `_id`，永久刪除可移除該目錄；先搜尋並更新其他 `data-open-app`／`#id` 引用，再建置檢查。共享素材仍有引用時不能刪除。

每次重要修改更新 App README 與 `knowledge/` 的 last updated。提交前 `npm run build && npm run check`，VS Code bridge 改動另跑 `npm run test:vscode`。來源、lockfile、產物一併提交；`build:check` 防止漏建置。依[發布手冊](knowledge/operations.md)驗收，不因 push 成功便宣稱已上線。

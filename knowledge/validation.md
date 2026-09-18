# 驗證地圖

Last updated: 2026-09-18

完整入口：`npm run build && npm run check`。使用隔離 headless browser；無本機 Chrome 時先 `npx playwright install --with-deps chromium`。

| 檢查 | Contract |
| --- | --- |
| build:check | 每個生成檔、hash、source map、App 索引與來源一致，不修改 checkout |
| format:check／lint | 統一來源格式、未定義／未使用變數、App DOM 只查自己的 root |
| validate-apps | manifest/window 一對一、ID／快捷鍵、中英欄位、圖示及所有入口 |
| validate-ui-contract | owner、semantic controls、renderer、快取版本 |
| validate-architecture | import 邊界、HTML root／ID／ARIA、App 不覆寫 shell、file:// |
| architecture.test.mjs | mount 一次；臨時副本從 Template 建第九 App、file/HTTP 三入口、11 圖示手機 Dock、互動、locale、CSS 隔離、可重現 build、拒絕覆蓋／無效 ID／重複快捷鍵／過期產物 |
| app-interactions.test.mjs | file/HTTP 的 Xcode tab、Overleaf 文件與編譯、Goodnotes 分頁及新增頁、Books reader、Netflix 篩選／搜尋／profile、跨 App locale 更新 |
| launcher-contract.mjs | 八種寬度 × DPR1/2，三 launcher 的尺寸、對齊、邊緣間距、mask 輪廓 |
| ui-runtime.mjs | file/HTTP responsive、Music glyph／試聽、Dock hover、所有 App 視窗 lifecycle |
| test:vscode | 真實 file:// Code OSS、四 workspace、Quick Open risk.js、Monaco 內容 |
| Site quality CI | Ubuntu 24.04／Node 24、npm ci、headless Chromium、預設完整檢查，失敗上傳證據 |

本次初始畫面比對：1440／480 px × 八個 App，共 16 組、27 項 computed styles，零差異。證據在 output/architecture/。信心高，但不代表全部互動狀態都逐像素相等。圖示比較同色 mask 的空間輪廓；GPU alpha rounding 另記錄。

最終本機、CI、公開站驗證通過；結果見[操作手冊](operations.md)。Code OSS file:// 有預期 worker/font 診斷，與 shell 未捕捉例外分開；真實工作區／搜尋必須可用，`.nojekyll` 必須保留。

VS Code 專項測試原先依賴過期的 iframe 顯示標題，已改用固定 `data-vscode-frame`。真實 Code OSS 於約 1 秒就緒，四個工作區、Quick Open 與 risk.js/Monaco 內容檢查通過；不是以 mock 取代 runtime。

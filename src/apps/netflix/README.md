# Netflix (`netflix`)

Last updated: 2026-09-18

Anson 提供的四部電影／影集片單。

- 入口：`#netflix`；名稱／排序／圖示在 [manifest](manifest.json)。
- 畫面：[view](view.html)；互動：[controller](controller.js)。content.json 管理片單、heroId、profileName；分類、搜尋、通知及 profile menu。
- 樣式：[styles](styles.css) 是內部畫面，[window](window.css) 是 native chrome／視窗與響應式。
- 狀態與限制：只導向公開 Netflix 頁面，不連接或推測已登入帳戶。新增片名、封面、說明時記錄來源。
- 素材／依據：[來源](../../../assets/netflix/SOURCES.md)；共用圖示來源見 [icons](../../../assets/app-icons/SOURCES.md)。
- 驗證：`npm run build && npm run check`。VS Code bridge 變更另跑 `npm run test:vscode`；新增功能要補對應行為測試。

[維護地圖](../../../knowledge/map.md) · [App 指南](../../../APP_MAINTENANCE.md) · [架構](../../../knowledge/architecture.md)

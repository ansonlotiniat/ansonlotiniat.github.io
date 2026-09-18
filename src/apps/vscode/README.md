# Visual Studio Code (`vscode`)

Last updated: 2026-09-18

Code OSS 1.131.0 公開程式碼工作區。

- 入口：`#vscode`；名稱／排序／圖示在 [manifest](manifest.json)。
- 畫面：[view](view.html)；互動：[controller](controller.js)。early.js 防止 iframe 首次 readiness 遺失；controller.js 管理握手、poll、watchdog、retry、command center、指標轉送。
- 樣式：[styles](styles.css) 是內部畫面，[window](window.css) 是 native chrome／視窗與響應式。
- 狀態與限制：iframe assets/vscode-oss/index.html 必須保留；跨來源訊息檢查 event.source。vendor runtime 和公開 snapshots 不隨一般網站 build 重建。
- 素材／依據：[來源](../../../assets/vscode-oss/SOURCES.md)；共用圖示來源見 [icons](../../../assets/app-icons/SOURCES.md)。
- 驗證：`npm run build && npm run check`。VS Code bridge 變更另跑 `npm run test:vscode`；新增功能要補對應行為測試。

[維護地圖](../../../knowledge/map.md) · [App 指南](../../../APP_MAINTENANCE.md) · [架構](../../../knowledge/architecture.md)

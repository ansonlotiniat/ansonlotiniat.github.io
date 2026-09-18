# Overleaf (`overleaf`)

Last updated: 2026-09-18

澳門日記編輯資料與 Between Bells and Heartbeats 詩作節錄。

- 入口：`#overleaf`；名稱／排序／圖示在 [manifest](manifest.json)。
- 畫面：[view](view.html)；互動：[controller](controller.js)。切換文件同步 source/preview；模擬 recompile、原圖放大鏡。
- 樣式：[styles](styles.css) 是內部畫面，[window](window.css) 是 native chrome／視窗與響應式。
- 狀態與限制：controller.js 不進行真實 LaTeX 編譯；文案與內容在 view.html。根目錄 macao-diary-colophon.png 是既有明確提供素材。
- 素材／依據：[來源](../../../knowledge/history/2026-09-18-pre-modular.md)；共用圖示來源見 [icons](../../../assets/app-icons/SOURCES.md)。
- 驗證：`npm run build && npm run check`。VS Code bridge 變更另跑 `npm run test:vscode`；新增功能要補對應行為測試。

[維護地圖](../../../knowledge/map.md) · [App 指南](../../../APP_MAINTENANCE.md) · [架構](../../../knowledge/architecture.md)

# Goodnotes (`goodnotes`)

Last updated: 2026-09-18

數學、物理、化學的七份筆記與 35 個作者撰寫頁面。

- 入口：`#goodnotes`；名稱／排序／圖示在 [manifest](manifest.json)。
- 畫面：[view](view.html)；互動：[controller](controller.js)。搜尋／filter／grid/list／folder／document menu／editor／分頁／新增／複製。
- 樣式：[styles](styles.css) 是內部畫面，[window](window.css) 是 native chrome／視窗與響應式。
- 狀態與限制：content.js 的 createDocuments() 建立可變內容；狀態不持久化，重載重設。非實際 Goodnotes 帳戶；全 App 原生 1:1 尚未完整比對。
- 素材／依據：[來源](../../../assets/fonts/SOURCES.md)；共用圖示來源見 [icons](../../../assets/app-icons/SOURCES.md)。
- 驗證：`npm run build && npm run check`。VS Code bridge 變更另跑 `npm run test:vscode`；新增功能要補對應行為測試。

[維護地圖](../../../knowledge/map.md) · [App 指南](../../../APP_MAINTENANCE.md) · [架構](../../../knowledge/architecture.md)

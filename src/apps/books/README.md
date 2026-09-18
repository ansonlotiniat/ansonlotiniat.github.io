# Books (`books`)

Last updated: 2026-09-18

三本明確提供的閱讀書目及進度。

- 入口：`#books`；名稱／排序／圖示在 [manifest](manifest.json)。
- 畫面：[view](view.html)；互動：[controller](controller.js)。Home／All／Search／More／reader 與返回；content.js 管理書目。
- 樣式：[styles](styles.css) 是內部畫面，[window](window.css) 是 native chrome／視窗與響應式。
- 狀態與限制：reader 使用介面示範文案，不提供受版權保護的正文或私人標註；改進度同步檢查 view.html 的書卡。
- 素材／依據：[來源](../../../assets/books/SOURCES.md)；共用圖示來源見 [icons](../../../assets/app-icons/SOURCES.md)。
- 驗證：`npm run build && npm run check`。VS Code bridge 變更另跑 `npm run test:vscode`；新增功能要補對應行為測試。

[維護地圖](../../../knowledge/map.md) · [App 指南](../../../APP_MAINTENANCE.md) · [架構](../../../knowledge/architecture.md)

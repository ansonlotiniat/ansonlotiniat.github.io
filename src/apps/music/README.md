# Music (`music`)

Last updated: 2026-09-18

Anson 提供的專輯、歌曲、播放列表。

- 入口：`#music`；名稱／排序／圖示在 [manifest](manifest.json)。
- 畫面：[view](view.html)；互動：[controller](controller.js)。content.json 管理 recentSections/songs/playlists/nowPlaying；播放官方 preview、上下一首、音量、repeat、搜尋與 pane controls。
- 樣式：[styles](styles.css) 是內部畫面，[window](window.css) 是 native chrome／視窗與響應式。
- 狀態與限制：音訊只在使用者操作後啟動；close/minimize 保留背景播放。播放器外觀由既有 DPR2 fixture 約束；目前全部 native 樣式放在 window.css。
- 素材／依據：[來源](../../../assets/music/SOURCES.md)；共用圖示來源見 [icons](../../../assets/app-icons/SOURCES.md)。
- 驗證：`npm run build && npm run check`。VS Code bridge 變更另跑 `npm run test:vscode`；新增功能要補對應行為測試。

[維護地圖](../../../knowledge/map.md) · [App 指南](../../../APP_MAINTENANCE.md) · [架構](../../../knowledge/architecture.md)

# 維護地圖

Last updated: 2026-09-18

先找要改的功能，再進入對應來源。App 索引由建置更新；決策、驗證、發布狀態由維護者更新。

| 要改甚麼 | 入口 | 責任 |
| --- | --- | --- |
| 新增 App | [指南](../APP_MAINTENANCE.md)、[Template](../src/apps/_template/README.md) | scaffold、生命週期、圖示、資料 |
| 某個 App | [App 索引](apps.md) | manifest／view／controller／content／CSS／README |
| 桌面 HTML／metadata | [shell HTML](../src/shell/index.html)、[copy](../src/shell/copy.js) | 共用靜態畫面與文案 |
| 視窗操作 | [windows](../src/shell/windows.js) | 開關、焦點、拖曳、最小化、最大化 |
| 三個 launcher 入口 | [render-launchers](../src/shell/render-launchers.js) | manifest → Dock／Apps／Spotlight、icon renderer |
| Apps／Spotlight | [overlays](../src/shell/overlays.js) | 過濾、快捷鍵、焦點隔離 |
| Dock 幾何／放大 | [JS](../src/shell/dock.js)、[CSS](../src/shell/styles/dock.css) | 圖示、名稱、指示點、命中位置、響應式數量 |
| 共用圖示 | [icons CSS](../src/shell/styles/icons.css)、[shell icons](../src/shell/icons.json) | 整數底板、遮罩；crop 在各 App manifest |
| 選單與桌面設定 | [menus](../src/shell/menus.js) | 共用選單／狀態／設定 |
| 語言與時鐘 | [locale](../src/shell/locale.js)、[shared i18n](../src/shared/i18n.js) | shell 文字、通知 App 更新動態文字 |
| 指標／iframe | [pointer](../src/shell/pointer.js) | 通用 pointer API；App 自己驗證訊息來源 |
| 註冊與啟動 | [start](../src/shell/start.js)、[registry](../src/shared/app-registry.js)、[boot](../src/shell/boot.js) | 一次 mount、hooks、hash |
| 共用動畫／圖片 | [motion](../src/shared/motion.js)、[media](../src/shared/media.js) | reduced motion、panel、fallback |
| 共用外觀 | [base](../src/shell/styles/base.css)、[theme](../src/shell/styles/theme.css) | 桌面與視窗 primitive |
| 建置／隔離／版本 | [build](../scripts/build.mjs)、[project](../scripts/lib/project.mjs)、[css](../scripts/lib/css.mjs) | 可重現輸出、來源探索、scope、hash |
| scaffold／預覽 | [create-app](../scripts/create-app.mjs)、[dev](../scripts/dev.mjs)、[server](../scripts/lib/server.mjs) | 新 App、localhost、監看重建 |
| 驗證 | [package](../package.json)、[測試地圖](validation.md)、[UI audit](../UI_AUDIT.md) | 格式、lint、靜態、瀏覽器測試 |
| 發布／回滾 | [操作手冊](operations.md)、[CI](../.github/workflows/ci.yml) | Pages、版本驗收、回復 |
| 取捨／未解問題 | [架構](architecture.md)、[技術債](debt.md) | 已確定的邊界與後續工作 |
| 歷史與依據 | [歷史](history/2026-09-18-pre-modular.md) | 舊 reference、內容、量測、部署 |

## 素材與 vendor

[圖示](../assets/app-icons/SOURCES.md)、[Books](../assets/books/SOURCES.md)、[Netflix](../assets/netflix/SOURCES.md)、[Music](../assets/music/SOURCES.md)、[字型](../assets/fonts/SOURCES.md)、[桌布](../assets/wallpapers/SOURCES.md)各有來源紀錄。

VS Code 的[來源與授權](../assets/vscode-oss/SOURCES.md)、[公開工作區](../assets/vscode-oss/WORKSPACES.md)、[更新腳本](../scripts/build-vscode-workspace.mjs)是獨立供應鏈。一般 App 修改不重建 vendor runtime。

## 更新規則

重要決策、參數、發現、狀態變化同步更新相關文件及 `Last updated`，保持短摘要、證據、信心與未解問題。大圖／量測放 `output/` 或附件；可重跑測試放 `tests/`。歷史文件記錄當時狀態，不能當作最新操作指南。

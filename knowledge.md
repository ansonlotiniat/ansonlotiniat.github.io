# AnsonOS knowledge

Last updated: 2026-09-18 19:38 CST

先讀[維護地圖](knowledge/map.md)。網站有八個 App，採 macOS 桌面／視窗導覽，使用繁體中文及英文。

- **實作／本機驗收完成：** 八個獨立 App、Template、可重現建置、CSS 隔離、維護 map、格式／lint／自動檢查。16 組桌面／手機的 27 項 computed styles 零差異；完整 `npm run check`、真實 VS Code 工作區／搜尋通過。第九 App 的 scaffold、三入口、手機 Dock、互動、locale 與隔離通過。CI／正式站驗收待發布。信心高（來源與 headless Chrome 實測）。
- **正式站：** 仍為統一圖示 release `9d2dda46d5cdd5907a21f7390ef1e5b11b2564fa`；最新狀態見[操作手冊](knowledge/operations.md)。
- **內容：** 只用 Anson 明確提供或核實的公開資料，不讀私人帳戶／repos／前景桌面 App。工具名稱與圖示不代表官方背書。文案具體，不發明獎項、書名或研究成果。
- **不變項：** 八個原有 hash、直接 `file://`、HTTP／Pages 須有效；保留 `.nojekyll`、共用圖示幾何和無障礙控制。
- **限制：** Goodnotes 全 App 1:1 尚未全面驗證；歷史 CSS 仍有重複；尚未全面型別檢查。見[技術債](knowledge/debt.md)。

舊來源、reference、量測、部署史保留在[遷移前紀錄](knowledge/history/2026-09-18-pre-modular.md)，此入口保持簡短。

# 技術債與未解問題

Last updated: 2026-09-18

| 項目 | 狀態／信心 | 後續驗收條件 |
| --- | --- | --- |
| 歷史 CSS 重複／無效規則 | 已有 owner，未全面合併；高 | 每次處理一個 App，覆蓋互動及 responsive 後清理，不單憑初始畫面推斷 |
| Goodnotes controller 大小 | 已隔離，資料已抽出；高 | 可再拆 library/editor/menu，保留複製、新頁面、搜尋、locale |
| JavaScript 型別 | ESM + ESLint + API 文件，未全面 TypeScript；高 | 先為 shared/context 建型別，再分批遷移 |
| Safari／Firefox 像素 | Chrome DPR1/2 有 contract；其他引擎未全面測；高 | 增加瀏覽器矩陣、記錄引擎差異 |
| App 互動測試深度 | 核心流程已測，非所有功能分支；高 | 新實際功能需覆蓋可見結果與失敗路徑 |
| Goodnotes 全 App 1:1 | library hover 有實測，editor 未全面比對；高 | 再操作前景原生 App 前，需取得本次 GUI 授權 |
| Pages 強制 gate | main/root publishing，CI 可與 Pages 平行；高 | push 前完整檢查；需強制 gate 時切 Actions deployment 或設 branch protection |
| Code OSS 內部來源 snapshot | 固定在過去公開來源；高 | 按 SOURCES／WORKSPACES 更新，不隨一般 App CSS 重建大型 vendor |
| 廢棄 atlas／舊 OG 圖 | map.js、geojson、舊圖仍保留；高 | 獨立確認無引用後清理，另製 AnsonOS 分享圖 |
| Spider-Verse 片名 | 依提供歌曲採 Across the Spider-Verse；中 | 使用者確認另一部才更改，不自行推測 |
| OJ／詩集正式名稱 | 缺公開資料或完整名稱；高 | 等明確提供，不補造作品與書名 |

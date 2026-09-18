# 開發、發布與回滾

Last updated: 2026-09-18 19:41 CST

## 本機

建議 Node 24，支援 22.13+。`npm ci` → `npm run dev`，預覽 http://127.0.0.1:4173/，來源儲存後自動建置，瀏覽器手動重新整理。可用 `PORT=4174` 換埠。直接開根 index.html 仍可用，但改 src 後先建置。

提交前 `npm run build && npm run check`；VS Code bridge 另跑 `npm run test:vscode`。Vendor 更新依它的 SOURCES／WORKSPACES，不憑一般建置刷新公開 repo snapshots。

## 正式站

Repository `ansonlotiniat/ansonlotiniat.github.io`，Pages source `main`／root；[正式站](https://ansonlotiniat.github.io/)。`.nojekyll` 保證 Code OSS 的 node_modules 資產正常。

1. 完整本機檢查後提交 source + lockfile + outputs，再推送。Site quality 是檢查，現在 Pages branch publishing 並非由它強制 gate。
2. 查詢該 SHA 的 Pages run，等待成功；核對 site.build.json、HTML contract version 和 JS／CSS bytes，不能只看 HTTP 200。
3. 公開站 headless 檢查三 launcher、App 視窗、窄螢幕及修改功能，記錄 SHA、run、version、測試與限制。

回滾前保存未提交工作，使用 `git revert <sha>`，正常推送並重新驗收；不要 force-push。跨建置架構回滾要整組回復 source／lockfile／outputs，不能只把舊 main.js 蓋回新 source。

## 最新已驗收版本

已發布內容版本 `build-6e481d012e1c`，commit `39b404d3f32988781d32a1e7240868d6e091fc1f`：[Pages 35340650021](https://github.com/ansonlotiniat/ansonlotiniat.github.io/actions/runs/35340650021) 成功，10 份公開產物及 canonical HTML 版本相符。完整 `npm run check`、`npm run test:vscode` 通過；16 組畫面 computed-style 比對零差異；200 個文件本地連結有效。[Site quality 35340650983](https://github.com/ansonlotiniat/ansonlotiniat.github.io/actions/runs/35340650983) 通過；公開站 28 組 launcher/DPR 檢查、八個 App 開关、真實 Code OSS/Quick Open risk.js 通過，零未捕捉 App 例外。證據：`output/architecture/production-report.json`、`output/playwright/launcher-modular-production-measurements.json`。大型 vendor assets 未改動。

先前內容 release `9d2dda46d5cdd5907a21f7390ef1e5b11b2564fa` 的[Pages 35323313757](https://github.com/ansonlotiniat/ansonlotiniat.github.io/actions/runs/35323313757)成功；文件 follow-up `22cc70ca7b791411194483cbbe086624a2fa2b14` 的[Pages 35323565838](https://github.com/ansonlotiniat/ansonlotiniat.github.io/actions/runs/35323565838)也成功。舊紀錄見[歷史](history/2026-09-18-pre-modular.md)。

CI 的 runner 固定為 Ubuntu 24.04、Node 24，避免 ubuntu-latest 自動換代影響視覺基準。升級時另做瀏覽器驗證；GitHub 本次 run 已公告 latest 將於 2026-10-19 遷移 Ubuntu 26。

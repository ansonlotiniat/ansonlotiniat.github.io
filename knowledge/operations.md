# 開發、發布與回滾

Last updated: 2026-09-18 19:38 CST

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

待發布內容版本 `build-6e481d012e1c`：完整 `npm run check`、`npm run test:vscode` 通過；16 組畫面 computed-style 比對零差異；200 個文件本地連結有效。下一步是推送、等待 Site quality／Pages，再核對公開站 bytes 與 headless smoke。大型 vendor assets 未改動。

本次模組遷移尚未發布。上一內容 release `9d2dda46d5cdd5907a21f7390ef1e5b11b2564fa` 的[Pages 35323313757](https://github.com/ansonlotiniat/ansonlotiniat.github.io/actions/runs/35323313757)成功；文件 follow-up `22cc70ca7b791411194483cbbe086624a2fa2b14` 的[Pages 35323565838](https://github.com/ansonlotiniat/ansonlotiniat.github.io/actions/runs/35323565838)也成功。舊紀錄見[歷史](history/2026-09-18-pre-modular.md)。

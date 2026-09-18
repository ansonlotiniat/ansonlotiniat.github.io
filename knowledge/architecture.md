# Architecture

Last updated: 2026-09-18

狀態：模組遷移、完整本機回歸、GitHub CI 及正式站驗收通過，已發布。信心高：import／DOM／CSS 檢查、Template 實際擴充、App 互動、真實 Code OSS 與 16 組版面比對。

```text
src/apps/<id>/      App manifest、HTML、controller、content、CSS、README
    ↓ imports
src/shared/         共用功能與 registry；不能依賴 App／shell

src/shell/          桌面、視窗、導覽、語言、Dock、焦點
    ↓ services
App mount(context) → optional lifecycle hooks

scripts/build.mjs   掃描 App → JS bundle、HTML 組合、scoped CSS
    ↓
root outputs       GitHub Pages／HTTP／file://
```

來源採標準 JavaScript ES modules，發布為 classic IIFE，保留本機雙擊 HTML。使用 [esbuild API](https://esbuild.github.io/api/) 和 [PostCSS](https://postcss.org/api/)；依賴鎖在 package-lock，CI 用 `npm ci`。不加入產品框架、後端或遠端 runtime。

## App contract

Manifest 是唯一 identity，folder／id 對應、order 唯一；沒有第二份手寫 App 名單。View 只有一個對應的根視窗與 traffic-light 控制。Controller 狀態留在 mount 閉包，只查注入的 root；只能 import 自己或 shared。

Shell 透過 `open/close/minimize/languageChanged` hooks 通知 App，不硬寫個別 App 的 refresh/open 分支。關閉保留狀態，重開不重复绑定事件。初始 locale 先設定，然後 mount，再處理 hash。固定 Finder／Apps／Mail 保留系統導覽語義。

純資料用 content.json，資料建構器用 content.js；Goodnotes 每次 mount 產生新頁面集合。選用的 early.js 只處理 eager iframe 啟動競態，目前僅 VS Code 使用。

## CSS 與圖示

順序：共用 base → App content → 共用 theme → App window chrome → Dock → icons。Music native 樣式在自己的 window.css。每條 App selector 最後的元素加零 specificity 的 `:where([data-window="id"], [data-window="id"] *)`，放在 pseudo-element 之前。規則只能匹配自己視窗或後代。

這是維護隔離，不是安全 sandbox。共用 reset、繼承變數、全域 font-face/keyframe 仍需明確命名。圖示一致性指畫布／底板／遮罩／影子／對齊／邊緣間距；不同圖案不可能具有相同 RGB。

## Source 與 output

編輯 `src/`、scripts、tests、維護文件及有來源的素材。生成且提交：index.html、main.js／map、apps.config.js、style.css、macos.css、dock.css、icons.css、site.build.json、knowledge/apps.md。`.gitattributes` 標示產物；build:check 重新生成逐份比較 bytes。

快取版本由輸出內容 hash 自動生成，不再手動同步日期。runtime 輸出不包含時間戳，同一來源與 lockfile 可重現。

## 評估

遷移前 main.js 4,014 行、style.css 10,223 行、index.html 1,507 行；已有 registry／測試，但 App 仍以全域變數與多檔修改耦合。現在 App 可在自己的目錄完成；shell 分成視窗、選單、overlay、Dock 等模組，import／DOM／CSS 有可執行邊界。

尚有歷史 CSS 疊加、偏大的 Goodnotes controller、缺少全面型別檢查。此次先保持外觀、建立邊界，後續逐 App 清理，見[技術債](debt.md)。

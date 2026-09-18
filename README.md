# AnsonOS

Anson 的 macOS 桌面式個人網站：[正式站](https://ansonlotiniat.github.io/)。

```sh
npm ci
npm run dev
```

修改 `src/`，不直接改根目錄生成的 HTML／JS／CSS。

```sh
npm run app:new -- notes "Notes"
npm run build
npm run check
```

- [維護地圖](knowledge/map.md)：功能與來源。
- [App 指南](APP_MAINTENANCE.md)：Template、生命週期、樣式、資料。
- [App 索引](knowledge/apps.md)：自動生成的全部 App 檔案。
- [架構](knowledge/architecture.md)、[驗證](knowledge/validation.md)、[發布／回滾](knowledge/operations.md)、[技術債](knowledge/debt.md)。

建議 Node 24，支援 22.13+。測試用 headless Chrome／Chromium；無本機 Chrome 時先 `npx playwright install --with-deps chromium`。保留 file:// 與 GitHub Pages；第三方來源見各 assets/*/SOURCES.md。

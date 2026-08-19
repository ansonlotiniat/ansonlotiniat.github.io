import { createRequire } from "node:module";
import path from "node:path";
import { pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);
const { expect, test } = require("@playwright/test");

test.use({
    channel: "chrome",
    viewport: { width: 1440, height: 900 },
});

test("direct file URL boots Code - OSS and searches the public workspace", async ({ page }) => {
    const startedAt = Date.now();
    const pageErrors = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));

    const portfolioUrl = pathToFileURL(path.resolve("index.html"));
    portfolioUrl.hash = "vscode";
    await page.goto(portfolioUrl.href);

    const frame = page.frameLocator('iframe[title="Visual Studio Code — Code - OSS 1.131.0"]');
    await expect(frame.locator(".monaco-workbench")).toHaveCount(1, { timeout: 30000 });
    console.log(`file:// Code - OSS ready in ${Date.now() - startedAt} ms`);
    await expect(frame.getByRole("button", { name: "開啟作品工作區" })).toBeVisible();
    await frame.getByRole("button", { name: "開啟作品工作區" }).click();

    for (const root of ["START HERE", "ALGORITHMS", "OPEN SOURCE", "ANSON OS"]) {
        await expect(frame.getByRole("treeitem", { name: root, exact: true })).toBeVisible();
    }

    await page.keyboard.press("Meta+P");
    const quickOpen = frame.getByRole("textbox", {
        name: "名稱搜尋檔案 (附加 : 可前往行，而附加 @ 則會前往符號)",
    });
    await quickOpen.fill("risk.js");
    await expect(frame.getByRole("option", { name: /risk\.js.*agent-trust\/lib/ })).toBeVisible();
    await page.keyboard.press("Enter");
    await expect(frame.getByRole("tab", { name: "risk.js", exact: true })).toBeVisible();
    await expect(frame.locator(".view-lines")).toContainText("maxRisk");

    expect(pageErrors).toEqual([]);
});

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const output = path.join(root, "output/playwright");
const assert = (condition, message) => {
    if (!condition) throw new Error(message);
};
const equal = (a, b, message) => assert(Math.abs(a - b) < 0.02, `${message}: ${a} vs ${b}`);

async function settle(page) {
    await page.waitForFunction(
        () =>
            document.body.classList.contains("is-ready") &&
            (!window.gsap ||
                window.gsap
                    .getTweensOf(
                        document.querySelectorAll(
                            ".dock, .dock-item, #launchpad, .launchpad-app, #explore, [data-explore-result]",
                        ),
                    )
                    .every((tween) => tween.totalProgress() === 1)) &&
            document
                .getAnimations()
                .every(
                    (animation) =>
                        animation.playState !== "running" ||
                        !animation.effect?.target?.closest?.(".dock, #launchpad, #explore"),
                ),
    );
}

async function inspectPlates(page, selector, label, expectedCount, horizontal = false) {
    const records = await page.locator(selector).evaluateAll((plates) =>
        plates.map((plate) => {
            const rect = plate.getBoundingClientRect();
            const frame = plate.parentElement.getBoundingClientRect();
            const style = getComputedStyle(plate);
            const image = plate.querySelector("img");
            return {
                width: rect.width,
                height: rect.height,
                left: rect.left,
                right: rect.right,
                top: rect.top,
                bottom: rect.bottom,
                offsetX: rect.left + rect.width / 2 - frame.left - frame.width / 2,
                offsetY: rect.top + rect.height / 2 - frame.top - frame.height / 2,
                radius: style.borderRadius,
                mask: style.maskImage,
                shadow: getComputedStyle(plate.parentElement).filter,
                loaded: image.complete && image.naturalWidth > 0,
            };
        }),
    );
    assert(records.length === expectedCount, `${label}: missing normalized plates`);
    const first = records[0];
    assert(first.width > 0 && Number.isInteger(first.width), `${label}: fractional/empty plate`);
    const gaps = [];
    for (const [index, record] of records.entries()) {
        equal(record.width, first.width, `${label}: plate ${index} width`);
        equal(record.height, first.width, `${label}: plate ${index} height`);
        equal(record.offsetX, 0, `${label}: plate ${index} horizontal centre`);
        equal(record.offsetY, 0, `${label}: plate ${index} vertical centre`);
        assert(record.loaded, `${label}: plate ${index} image failed to load`);
        assert(
            record.radius === first.radius && record.mask === first.mask && record.shadow === first.shadow,
            `${label}: inconsistent mask/shadow`,
        );
        if (horizontal) {
            equal(record.top, first.top, `${label}: plate ${index} top alignment`);
            equal(record.bottom, first.bottom, `${label}: plate ${index} bottom alignment`);
            if (index) gaps.push(record.left - records[index - 1].right);
        }
    }
    if (gaps.length) {
        assert(gaps[0] > 0 && Number.isInteger(gaps[0]), `${label}: fractional/negative gap`);
        gaps.forEach((gap) => equal(gap, gaps[0], `${label}: unequal edge gaps`));
    }
    if (!horizontal) {
        const rows = [...new Set(records.map((record) => record.top))].sort((a, b) => a - b);
        const rowGaps = rows.slice(1).map((top, index) => top - rows[index] - first.height);
        rowGaps.forEach((gap) => equal(gap, rowGaps[0], `${label}: unequal row gaps`));
        const columnGaps = rows.flatMap((top) => {
            const row = records.filter((record) => record.top === top).sort((a, b) => a.left - b.left);
            return row.slice(1).map((record, index) => record.left - row[index].right);
        });
        columnGaps.forEach((gap) => equal(gap, columnGaps[0], `${label}: unequal column gaps`));
    }
    return { label, count: records.length, plateSize: first.width, gap: gaps[0] ?? null };
}

async function verifyPixelMasks(page, PNG, label, selector = ".dock .launcher-plate") {
    // Compare geometry with a uniform fill. Different artwork colours can alter
    // the screenshot's premultiplied-alpha rounding even with identical masks.
    const isolation = await page.addStyleTag({
        content: `
        html, body { background: transparent !important; }
        body * { visibility: hidden !important; }
        ${selector}, ${selector} * { visibility: visible !important; }
        ${selector} { --icon-background: #fff !important; }
        ${selector} img { visibility: hidden !important; }
    `,
    });
    try {
        let reference;
        let largestAlphaRounding = 0;
        const plates = page.locator(selector);
        for (let index = 0; index < (await plates.count()); index += 1) {
            const image = PNG.sync.read(await plates.nth(index).screenshot({ omitBackground: true }));
            if (!reference) {
                reference = image;
                continue;
            }
            assert(
                image.width === reference.width && image.height === reference.height,
                `${label}: raster dimensions differ`,
            );
            let mismatches = 0;
            let maximumAlphaDelta = 0;
            let silhouetteMismatches = 0;
            for (let pixel = 3; pixel < image.data.length; pixel += 4) {
                if (image.data[pixel] !== reference.data[pixel]) mismatches += 1;
                maximumAlphaDelta = Math.max(
                    maximumAlphaDelta,
                    Math.abs(image.data[pixel] - reference.data[pixel]),
                );
                if (image.data[pixel] >= 128 !== reference.data[pixel] >= 128) silhouetteMismatches += 1;
            }
            // Coverage is the spatial contract. GPU shadow/mask compositing can
            // quantize edge opacity differently without moving a covered pixel.
            largestAlphaRounding = Math.max(largestAlphaRounding, maximumAlphaDelta);
            assert(
                silhouetteMismatches === 0,
                `${label}: plate ${index} has ${mismatches} alpha differences, maximum delta ${maximumAlphaDelta}, ${silhouetteMismatches} silhouette differences`,
            );
        }
        return {
            rasterWidth: reference.width,
            rasterHeight: reference.height,
            silhouetteMismatches: 0,
            largestAlphaRounding,
        };
    } finally {
        await isolation.evaluate((element) => element.remove());
    }
}

export async function verifyLauncherContract(browser, url, label, PNG) {
    fs.mkdirSync(output, { recursive: true });
    const results = [];
    for (const dpr of [1, 2]) {
        const context = await browser.newContext({
            viewport: { width: 1459, height: 900 },
            deviceScaleFactor: dpr,
        });
        try {
            const page = await context.newPage();
            await page.goto(url, { waitUntil: "load" });
            await settle(page);
            const appCount = await page.evaluate(() => window.ANSON_APP_MANIFEST.length);
            for (const width of [1459, 1440, 1000, 760, 520, 480, 375, 360]) {
                await page.setViewportSize({ width, height: 900 });
                const record = await inspectPlates(
                    page,
                    ".dock .launcher-plate",
                    `${label} ${width}px DPR${dpr}`,
                    appCount + 2,
                    true,
                );
                if (width >= 1001) {
                    equal(record.plateSize, 47, "Desktop plate size");
                    equal(record.gap, 11, "Desktop plate gap");
                }
                results.push(record);
            }
            await page.setViewportSize({ width: 1459, height: 900 });
            if (dpr === 2)
                await page
                    .locator(".dock")
                    .screenshot({ path: path.join(output, `launcher-${label}-dock.png`) });
            results.push({
                label: `${label} DPR${dpr} raster`,
                ...(await verifyPixelMasks(page, PNG, label)),
            });

            await page.getByRole("button", { name: "Apps", exact: true }).click();
            await settle(page);
            results.push(
                await inspectPlates(
                    page,
                    ".launchpad-icon .launcher-plate",
                    `${label} Apps DPR${dpr}`,
                    appCount,
                ),
            );
            results.push({
                label: `${label} Apps DPR${dpr} raster`,
                ...(await verifyPixelMasks(page, PNG, label, ".launchpad-icon .launcher-plate")),
            });
            if (dpr === 2) await page.screenshot({ path: path.join(output, `launcher-${label}-apps.png`) });
            await page.setViewportSize({ width: 480, height: 900 });
            results.push(
                await inspectPlates(
                    page,
                    ".launchpad-icon .launcher-plate",
                    `${label} mobile Apps DPR${dpr}`,
                    appCount,
                ),
            );
            await page.setViewportSize({ width: 1459, height: 900 });
            await page.keyboard.press("Escape");
            await page.locator("#launchpad").waitFor({ state: "hidden" });
            await page.getByRole("button", { name: "Open Explore", exact: true }).click();
            await settle(page);
            results.push(
                await inspectPlates(
                    page,
                    ".app-icon .launcher-plate",
                    `${label} Spotlight DPR${dpr}`,
                    appCount,
                ),
            );
            results.push({
                label: `${label} Spotlight DPR${dpr} raster`,
                ...(await verifyPixelMasks(page, PNG, label, ".app-icon .launcher-plate")),
            });
        } finally {
            await context.close();
        }
    }
    fs.writeFileSync(
        path.join(output, `launcher-${label}-measurements.json`),
        JSON.stringify(results, null, 2) + "\n",
    );
    console.log(`✓ Equal launcher plates, edge gaps and raster masks at DPR1/2 (${label})`);
}

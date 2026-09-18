export const goodnotesSubjectCopy = {
    math: { zh: "數學 · MATHEMATICS", en: "MATHEMATICS" },
    physics: { zh: "物理 · PHYSICS", en: "PHYSICS" },
    chemistry: { zh: "化學 · CHEMISTRY", en: "CHEMISTRY" },
};

export const gnBi = (zh, en) => ({ zh, en });

export const gnSection = (title, zhLines, enLines, formula = "", mark = "yellow") => ({
    title: gnBi(title[0], title[1]),
    lines: gnBi(zhLines, enLines),
    formula,
    mark,
});

export const gnPage = (title, layout, sections, sketch, callout) => ({
    title: gnBi(title[0], title[1]),
    layout,
    sections,
    sketch,
    callout: gnBi(callout[0], callout[1]),
});

export const goodnotesLibraryTitleCopy = {
    all: { zh: "文件", en: "Documents" },
    favorites: { zh: "最愛", en: "Favorites" },
    shared: { zh: "分享", en: "Shared" },
    marketplace: { zh: "市集", en: "Marketplace" },
    math: { zh: "數學", en: "Mathematics" },
    physics: { zh: "物理", en: "Physics" },
    chemistry: { zh: "化學", en: "Chemistry" },
};

export const goodnotesSketches = {
    curve: '<path d="M24 132H282M42 146V18"/><path class="gn-sketch-soft" d="M45 122C82 120 96 106 119 76s55-62 143-53"/><path d="M76 116 245 38"/><circle cx="154" cy="80" r="4"/>',
    area: '<path d="M25 132H282M42 146V18"/><path class="gn-sketch-soft" d="M45 124C82 110 102 54 154 48s77 49 116 70"/><path class="gn-sketch-fill" d="M72 132V100C96 70 120 50 154 48c35-2 60 25 82 52v32Z"/><path d="M72 132V100M236 132V100"/>',
    box: '<rect x="79" y="42" width="142" height="78" rx="2"/><path d="M79 128c38 8 104 8 142 0M67 43c-8 20-8 55 0 77M88 31c33-8 91-8 124 0"/><path d="m194 99 18-18m-4 3 4-3-1 5"/>',
    circle: '<circle cx="150" cy="80" r="60"/><path d="M62 80h176M150 8v144M150 80l43-43M186 37a60 60 0 0 1 24 43"/><path class="gn-sketch-soft" d="m188 33 9 2-3 9"/><circle cx="193" cy="37" r="4"/>',
    identity:
        '<path d="M150 22 57 132h186Z"/><path d="M150 22v110M57 132l93-52 93 52"/><circle cx="150" cy="80" r="8"/><path class="gn-sketch-soft" d="m102 63 21 10m54 0 21-10m-31 45 18 10"/>',
    wave: '<path d="M18 83h270M28 34v98"/><path class="gn-sketch-soft" d="M28 82c22-56 43-56 65 0s43 56 65 0 43-56 65 0 43 56 65 0"/><path d="M94 34v96M223 34v96M96 26h124m-5-4 5 4-5 4"/>',
    triangle:
        '<path d="M49 128 244 128 178 33Z"/><path d="m49 128 25-1-1-24M174 35l2 19 19-7"/><path class="gn-sketch-soft" d="M85 128a36 36 0 0 1-24-29M220 128a34 34 0 0 0 13-27"/>',
    tree: '<path d="M36 80h45M81 80l62-46M81 80l62 46M143 34l75-22M143 34l75 40M143 126l75-40M143 126l75 22"/><circle cx="81" cy="80" r="4"/><circle cx="143" cy="34" r="4"/><circle cx="143" cy="126" r="4"/><path class="gn-sketch-soft" d="m203 10 15 2-9 12m-6 62 15 0-8 12"/>',
    distribution:
        '<path d="M22 132H283M43 144V24"/><path class="gn-sketch-soft" d="M45 130c35-1 48-5 62-30 14-28 20-63 48-64s35 35 49 64c13 25 29 29 64 30"/><path class="gn-sketch-fill" d="M155 36c29 0 35 35 49 64 13 25 29 29 64 30H155Z"/><path d="M155 36v96"/>',
    scatter:
        '<path d="M28 132H280M43 145V20"/><path class="gn-sketch-soft" d="m55 120 205-84"/><g class="gn-sketch-dots"><circle cx="64" cy="115" r="4"/><circle cx="87" cy="99" r="4"/><circle cx="109" cy="105" r="4"/><circle cx="134" cy="77" r="4"/><circle cx="158" cy="70" r="4"/><circle cx="183" cy="66" r="4"/><circle cx="205" cy="46" r="4"/><circle cx="235" cy="38" r="4"/><circle cx="232" cy="96" r="5"/></g>',
    force: '<path d="M42 129 237 129 170 55Z"/><rect x="128" y="67" width="54" height="40" rx="4" transform="rotate(-31 155 87)"/><path d="M155 86v-62m0 0-6 11m6-11 6 11M155 86v64m0 0-6-11m6 11 6-11M155 86l49-31m0 0-12 1m12-1-5 11M155 86l-48 31m0 0 12-1m-12 1 5-11"/>',
    motion: '<path d="M28 121h250M53 121c41 0 62-9 92-32 34-27 66-45 116-45"/><path d="m252 38 9 6-11 4M62 105 43 121l19 16"/><circle cx="103" cy="107" r="6"/><circle cx="191" cy="62" r="6"/>',
    collision:
        '<rect x="34" y="62" width="62" height="42" rx="8"/><rect x="208" y="62" width="62" height="42" rx="8"/><path d="M105 83h46m-9-7 9 7-9 7M199 83h-42m9-7-9 7 9 7"/><path class="gn-sketch-soft" d="m145 46 9 17 15-12-4 21 22 2-19 10 15 15-22-4-1 22-10-19-15 15 5-22-22-1 19-11-14-16 21 5Z"/>',
    energy: '<path d="M31 126h245M53 126l57-91 55 91 56-59 38 59"/><circle cx="110" cy="35" r="7"/><path d="M103 52 83 83m74 30 38-36"/><path class="gn-sketch-soft" d="m232 41 13 15 13-15m-13 15v49"/>',
    projectile:
        '<path d="M23 132h264M43 144V26"/><path class="gn-sketch-soft" d="M43 126C92 19 176 19 260 126"/><path d="M43 126 88 62m-45 64 65 0M43 126l45-64m0 0-13 5m13-5-1 14M132 45v48m0 0-6-11m6 11 6-11"/>',
    interference:
        '<circle cx="72" cy="80" r="7"/><circle cx="72" cy="80" r="24"/><circle cx="72" cy="80" r="43"/><circle cx="72" cy="80" r="62"/><circle cx="228" cy="80" r="7"/><circle cx="228" cy="80" r="24"/><circle cx="228" cy="80" r="43"/><circle cx="228" cy="80" r="62"/><path class="gn-sketch-soft" d="M150 18v124"/>',
    diffraction:
        '<path d="M68 15v53m0 25v53M70 68h36M70 93h36M106 68v25"/><path class="gn-sketch-soft" d="M107 80c35-5 50-18 62-42m-62 42c42 0 63 0 92 0m-92 0c35 5 50 18 62 42"/><path d="M238 16v128M226 50h24M217 80h42M226 110h24"/>',
    refraction:
        '<path d="M18 82h270M150 12v136"/><path class="gn-sketch-fill" d="M18 82h270v66H18Z"/><path d="m80 24 70 58 43 54M150 82l50-36m-50 36 24 24"/><path class="gn-sketch-soft" d="M123 60a36 36 0 0 1 27-14m0 63a29 29 0 0 0 18-7"/>',
    standing:
        '<path d="M25 28v104M280 28v104"/><path class="gn-sketch-soft" d="M25 80c31-60 64-60 96 0s64 60 96 0 32-60 63 0M25 80c31 60 64 60 96 0s64-60 96 0 32 60 63 0"/><circle cx="25" cy="80" r="4"/><circle cx="121" cy="80" r="4"/><circle cx="217" cy="80" r="4"/><circle cx="280" cy="80" r="4"/>',
    equilibrium:
        '<path d="M30 118h240M52 118c35-1 61-38 92-74 31 36 57 73 94 74M52 43c37 2 61 38 92 75 31-36 57-72 94-75"/><path d="M107 77h77m-9-7 9 7-9 7m2 12h-77m9-7-9 7 9 7"/><circle cx="144" cy="80" r="5"/>',
    balance:
        '<path d="M150 23v107M79 47h142M100 47 60 119h80Zm100 0-40 72h80ZM119 139h62"/><path class="gn-sketch-soft" d="M61 119c17 9 62 9 79 0m20 0c17 9 62 9 79 0"/>',
    ph: '<path d="M24 80h258"/><path class="gn-sketch-fill" d="M24 62h126v36H24Zm126 0h132v36H150Z"/><path d="M150 46v68M60 68v24m45-24v24m90-24v24m45-24v24"/><circle cx="95" cy="80" r="9"/><circle cx="222" cy="80" r="9"/>',
    titration:
        '<path d="M26 135h255M43 145V18"/><path class="gn-sketch-soft" d="M45 124c47 0 80-3 106-16 18-9 20-58 37-68 16-9 44-11 81-11"/><path d="M171 25v108M137 85h68"/><circle cx="171" cy="76" r="5"/>',
    reaction:
        '<rect x="20" y="55" width="70" height="50" rx="14"/><rect x="210" y="55" width="70" height="50" rx="14"/><path d="M102 80h95m-12-8 12 8-12 8"/><path class="gn-sketch-soft" d="M118 52h63M128 108h43"/><circle cx="55" cy="80" r="10"/><circle cx="245" cy="80" r="10"/>',
    mechanism:
        '<path d="M35 98 87 68l52 30 52-30 73 30"/><path d="M86 67c15-42 61-42 69 1m0 0-9-8m9 8 3-11"/><circle cx="87" cy="68" r="5"/><circle cx="191" cy="68" r="5"/><path class="gn-sketch-soft" d="m121 114 28 13 28-13"/>',
    spectrum:
        '<path d="M23 132H282M42 144V20"/><path d="M65 132V92m24 40V46m17 86V72m39 60V29m18 103V86m41 46V61m29 71V104m24 28V51"/><path class="gn-sketch-soft" d="M52 35c30 12 51 3 76 11s47 2 72-10 43-8 69 5"/>',
    checklist:
        '<path d="m45 42 10 10 20-24M45 82l10 10 20-24M45 122l10 10 20-24M93 42h154M93 82h132M93 122h146"/><path class="gn-sketch-soft" d="M103 52h94m-94 40h73m-73 40h105"/>',
};

export const goodnotesKindCopy = {
    all: { zh: "全部", en: "All" },
    documents: { zh: "文件", en: "Documents" },
    folders: { zh: "資料夾", en: "Folders" },
};

export const goodnotesFeedbackCopy = {
    notifications: { zh: "目前沒有新通知", en: "No new notifications" },
    "library-more": { zh: "更多文件操作已準備好", en: "More document actions are ready" },
    sync: { zh: "所有變更已同步", en: "All changes are synced" },
    "note-search": { zh: "這份示範筆記沒有更多搜尋結果", en: "No additional matches in this demo note" },
    ai: { zh: "示範模式不會連接 Goodnotes AI 帳號", en: "Demo mode does not connect a Goodnotes AI account" },
    share: { zh: "示範模式不會分享私人內容", en: "Demo mode does not share private content" },
    "note-more": { zh: "更多筆記操作已準備好", en: "More note actions are ready" },
    "page-options": { zh: "頁面操作已準備好", en: "Page actions are ready" },
    "page-filter": { zh: "目前顯示所有頁面", en: "Showing all pages" },
};

export function createDocuments() {
    return [
        {
            id: "calculus",
            subject: "math",
            favorite: true,
            shared: false,
            preview: "DIFFERENTIATION",
            title: gnBi("微積分整理", "Calculus Review"),
            updated: gnBi("7月28日 下午8:14", "28 Jul, 8:14 PM"),
            date: gnBi("2026年7月28日", "28 JUL 2026"),
            pages: [
                gnPage(
                    ["導數工具箱", "Derivative toolkit"],
                    "split",
                    [
                        gnSection(
                            ["先分辨結構", "Read the structure first"],
                            ["外層 × 內層 → 鏈式法則", "兩個函數相乘 → 乘積法則"],
                            ["outer × inner → chain rule", "two functions multiplied → product rule"],
                            "[f(g(x))]′ = f′(g(x))g′(x)",
                            "yellow",
                        ),
                        gnSection(
                            ["最常用三條", "Three rules I keep using"],
                            ["冪次先乘到前面，再把次方減 1", "商數法則分母記得平方"],
                            [
                                "bring the power down, then subtract one",
                                "the quotient-rule denominator is squared",
                            ],
                            "(uv)′ = u′v + uv′",
                            "blue",
                        ),
                    ],
                    { type: "curve", labels: ["secant", "tangent", "gradient"] },
                    [
                        "每行只做一個動作；最後先代數值，再整理。",
                        "One algebra move per line; substitute before simplifying.",
                    ],
                ),
                gnPage(
                    ["積分＝反向求導", "Integration reverses differentiation"],
                    "flow",
                    [
                        gnSection(
                            ["不定積分", "Indefinite integrals"],
                            ["積完一定補 + C", "先把根式、分式寫成冪次"],
                            ["always include + C", "rewrite roots and fractions as powers first"],
                            "∫xⁿdx = xⁿ⁺¹/(n+1) + C",
                            "mint",
                        ),
                        gnSection(
                            ["定積分與面積", "Definite integrals and area"],
                            ["上限代入減下限代入", "跨過 x 軸時要分段；幾何面積取絕對值"],
                            [
                                "upper value minus lower value",
                                "split at x-axis crossings; geometric area is positive",
                            ],
                            "∫ₐᵇf(x)dx = F(b) − F(a)",
                            "pink",
                        ),
                    ],
                    { type: "area", labels: ["a", "signed area", "b"] },
                    [
                        "積分答案微分一次，應該回到 integrand。",
                        "Differentiate the result: it should return the integrand.",
                    ],
                ),
                gnPage(
                    ["切線與法線｜完整例題", "Tangent & normal - worked example"],
                    "worked",
                    [
                        gnSection(
                            ["題目", "Question"],
                            ["曲線 y = x² + 3x，在 x = 1 求切線及法線。"],
                            ["For y = x² + 3x, find tangent and normal at x = 1."],
                            "y(1)=4,  dy/dx = 2x+3",
                            "yellow",
                        ),
                        gnSection(
                            ["逐步做", "Working"],
                            ["x=1 時斜率 mₜ=5", "法線斜率 mₙ=−1/5", "都通過點 (1,4)"],
                            ["at x=1, tangent slope mₜ=5", "normal slope mₙ=−1/5", "both pass through (1,4)"],
                            "y−4=5(x−1)  /  y−4=−⅕(x−1)",
                            "violet",
                        ),
                    ],
                    { type: "curve", labels: ["(1,4)", "m=5", "m=−1/5"] },
                    [
                        "兩條非垂直直線互相垂直 ⇒ 斜率乘積 = −1。",
                        "Perpendicular non-vertical lines have slope product −1.",
                    ],
                ),
                gnPage(
                    ["最優化：先畫再設變量", "Optimisation: sketch, then define"],
                    "map",
                    [
                        gnSection(
                            ["固定周長的長方形", "Rectangle with fixed perimeter"],
                            ["周長 20 ⇒ y = 10−x", "面積 A=x(10−x)"],
                            ["perimeter 20 ⇒ y = 10−x", "area A=x(10−x)"],
                            "A′=10−2x=0  ⇒  x=5",
                            "blue",
                        ),
                        gnSection(
                            ["最大還是最小？", "Maximum or minimum?"],
                            ["A″=−2 < 0，所以是最大值", "記得回答題目要的量及單位"],
                            ["A″=−2 < 0, so this is a maximum", "state the requested quantity and units"],
                            "Amax = 5×5 = 25",
                            "yellow",
                        ),
                    ],
                    { type: "box", labels: ["x", "10−x", "Amax"] },
                    ["可行域也要檢查：這題 0 < x < 10。", "Check the feasible domain: here 0 < x < 10."],
                ),
                gnPage(
                    ["微積分考前一頁", "One-page calculus check"],
                    "checklist",
                    [
                        gnSection(
                            ["看到題目先問", "Before calculating"],
                            ["函數的 domain？", "要的是斜率、面積，還是座標？", "答案需不需要 exact form？"],
                            [
                                "what is the domain?",
                                "slope, area, or coordinates?",
                                "is exact form required?",
                            ],
                            "differentiate → solve → interpret",
                            "mint",
                        ),
                        gnSection(
                            ["最後 30 秒", "Final 30 seconds"],
                            ["+C、上下限、正負號", "把答案代回條件", "單位與有效數字"],
                            [
                                "+C, limits, and signs",
                                "substitute into the condition",
                                "units and significant figures",
                            ],
                            "✓ structure  ✓ algebra  ✓ meaning",
                            "pink",
                        ),
                    ],
                    { type: "checklist", labels: ["rules", "working", "check"] },
                    [
                        "我最常錯的不是 calculus，是太早把式子展開。",
                        "My common error is expanding too early, not the calculus itself.",
                    ],
                ),
            ],
        },
        {
            id: "trigonometry",
            subject: "math",
            favorite: false,
            shared: false,
            preview: "TRIGONOMETRY",
            title: gnBi("三角函數公式", "Trigonometry Formulae"),
            updated: gnBi("7月24日 下午5:40", "24 Jul, 5:40 PM"),
            date: gnBi("2026年7月24日", "24 JUL 2026"),
            pages: [
                gnPage(
                    ["單位圓｜exact values", "Unit circle - exact values"],
                    "map",
                    [
                        gnSection(
                            ["坐標就是答案", "Coordinates are the answer"],
                            ["圓上點 = (cosθ, sinθ)", "tanθ = sinθ / cosθ"],
                            ["point on circle = (cosθ, sinθ)", "tanθ = sinθ / cosθ"],
                            "30°=π/6, 45°=π/4, 60°=π/3",
                            "yellow",
                        ),
                        gnSection(
                            ["象限符號", "Signs by quadrant"],
                            ["I：全部正；II：sin 正", "III：tan 正；IV：cos 正"],
                            ["I: all positive; II: sin positive", "III: tan positive; IV: cos positive"],
                            "ASTC → All / Sin / Tan / Cos",
                            "blue",
                        ),
                    ],
                    { type: "circle", labels: ["cosθ", "sinθ", "tanθ"] },
                    [
                        "角度制 ↔ 弧度制：乘 π/180 或 180/π。",
                        "Degrees ↔ radians: multiply by π/180 or 180/π.",
                    ],
                ),
                gnPage(
                    ["恆等式不是公式大亂鬥", "Identity strategy"],
                    "split",
                    [
                        gnSection(
                            ["三個核心", "Three core identities"],
                            ["需要消掉 tan，就改寫成 sin/cos", "看到 1−sin²x，就換成 cos²x"],
                            ["rewrite tan as sin/cos when needed", "replace 1−sin²x with cos²x"],
                            "sin²x+cos²x=1,  tanx=sinx/cosx",
                            "mint",
                        ),
                        gnSection(
                            ["雙角與降冪", "Double angle and power reduction"],
                            ["依題目已有的函數選版本", "不要一開始把所有式子都展開"],
                            ["choose the form matching the expression", "do not expand everything at once"],
                            "cos2x = 1−2sin²x = 2cos²x−1",
                            "pink",
                        ),
                    ],
                    { type: "identity", labels: ["sin²", "cos²", "1"] },
                    ["證明題只改一邊；不要同時改 LHS 和 RHS。", "For proofs, transform one side only."],
                ),
                gnPage(
                    ["解方程：先基本角，再補週期", "Equations: principal angles, then cycles"],
                    "worked",
                    [
                        gnSection(
                            ["例：sin2x = √3/2", "Example: sin2x = √3/2"],
                            ["範圍 0≤x<2π，所以 0≤2x<4π", "2x = π/3, 2π/3, 7π/3, 8π/3"],
                            ["0≤x<2π gives 0≤2x<4π", "2x = π/3, 2π/3, 7π/3, 8π/3"],
                            "x = π/6, π/3, 7π/6, 4π/3",
                            "yellow",
                        ),
                        gnSection(
                            ["檢查", "Check"],
                            ["逐個代回原式", "確認全部都在指定範圍"],
                            ["substitute every value", "confirm every value is in range"],
                            "period(sin2x)=π",
                            "violet",
                        ),
                    ],
                    { type: "circle", labels: ["π/3", "2π/3", "+2π"] },
                    [
                        "calculator 用 RAD 還是 DEG，要在第一行就確認。",
                        "Confirm RAD or DEG before the first calculation.",
                    ],
                ),
                gnPage(
                    ["圖像變換", "Graph transformations"],
                    "flow",
                    [
                        gnSection(
                            ["y = a sin(bx+c)+d", "y = a sin(bx+c)+d"],
                            ["振幅 = |a|；中線 y=d", "週期 = 2π/|b|"],
                            ["amplitude = |a|; midline y=d", "period = 2π/|b|"],
                            "phase shift = −c/b",
                            "blue",
                        ),
                        gnSection(
                            ["畫圖次序", "Sketching order"],
                            ["先畫中線與一個週期", "標出最大、最小及零點，再連成光滑曲線"],
                            [
                                "draw the midline and one period",
                                "mark maxima, minima, zeros, then connect smoothly",
                            ],
                            "range: [d−|a|, d+|a|]",
                            "yellow",
                        ),
                    ],
                    { type: "wave", labels: ["amplitude", "period", "midline"] },
                    [
                        "sin 從中線向上；cos 從極大值開始。",
                        "sin starts upward at the midline; cos starts at a maximum.",
                    ],
                ),
                gnPage(
                    ["非直角三角形｜選哪條公式？", "Non-right triangles - which rule?"],
                    "checklist",
                    [
                        gnSection(
                            ["正弦定理", "Sine rule"],
                            ["已知一組對邊與對角時最好用", "SSA 要留意 ambiguous case"],
                            [
                                "best when one opposite side-angle pair is known",
                                "SSA may have an ambiguous case",
                            ],
                            "a/sinA = b/sinB = c/sinC",
                            "mint",
                        ),
                        gnSection(
                            ["餘弦定理＋面積", "Cosine rule and area"],
                            ["SAS 或 SSS 用餘弦定理", "兩邊夾角可直接求面積"],
                            ["use cosine rule for SAS or SSS", "two sides and included angle give area"],
                            "a²=b²+c²−2bc cosA;  Area=½bc sinA",
                            "pink",
                        ),
                    ],
                    { type: "triangle", labels: ["a↔A", "b↔B", "c↔C"] },
                    [
                        "圖不一定按比例；邊和對角的配對要自己標。",
                        "The diagram may not be to scale; label opposite pairs yourself.",
                    ],
                ),
            ],
        },
        {
            id: "statistics",
            subject: "math",
            favorite: false,
            shared: false,
            preview: "PROBABILITY",
            title: gnBi("概率與統計", "Probability & Statistics"),
            updated: gnBi("7月20日 上午10:22", "20 Jul, 10:22 AM"),
            date: gnBi("2026年7月20日", "20 JUL 2026"),
            pages: [
                gnPage(
                    ["條件概率｜樣本空間變了", "Conditional probability changes the sample"],
                    "split",
                    [
                        gnSection(
                            ["核心", "Core idea"],
                            ["條件 B 已發生，所以分母是 P(B)", "交集是 A 與 B 同時發生"],
                            [
                                "once B is known, the denominator is P(B)",
                                "the intersection means A and B both occur",
                            ],
                            "P(A|B)=P(A∩B)/P(B)",
                            "yellow",
                        ),
                        gnSection(
                            ["樹狀圖", "Probability trees"],
                            ["沿同一路徑相乘", "互斥的完整路徑相加"],
                            ["multiply along a path", "add mutually exclusive complete paths"],
                            "P(A∩B)=P(A)P(B|A)",
                            "blue",
                        ),
                    ],
                    { type: "tree", labels: ["A", "B|A", "not B"] },
                    ["獨立才可以寫 P(A∩B)=P(A)P(B)。", "Only independent events allow P(A∩B)=P(A)P(B)."],
                ),
                gnPage(
                    ["二項分佈", "Binomial distribution"],
                    "flow",
                    [
                        gnSection(
                            ["先驗四個條件", "Check four conditions"],
                            ["固定試驗次數 n", "每次只有成功／失敗", "p 固定；各次獨立"],
                            ["fixed number n", "success/failure only", "constant p; independent trials"],
                            "X ~ B(n,p)",
                            "mint",
                        ),
                        gnSection(
                            ["概率、平均、離散程度", "Probability, mean, spread"],
                            ["組合數決定成功出現在哪幾次", "方差不是標準差"],
                            [
                                "the combination counts placements of successes",
                                "variance is not standard deviation",
                            ],
                            "P(X=r)=ⁿCᵣpʳ(1−p)ⁿ⁻ʳ; μ=np; σ²=np(1−p)",
                            "pink",
                        ),
                    ],
                    { type: "distribution", labels: ["0", "np", "n"] },
                    ["題目問至少 r：通常用 1−P(X≤r−1)。", "For at least r, usually use 1−P(X≤r−1)."],
                ),
                gnPage(
                    ["Normal distribution｜標準化", "Normal distribution - standardise"],
                    "worked",
                    [
                        gnSection(
                            ["把任何 N(μ,σ²) 轉成 Z", "Convert N(μ,σ²) to Z"],
                            ["先畫鐘形圖並塗區域", "標準差是 σ，不是 σ²"],
                            ["sketch and shade the required region", "use σ, not σ²"],
                            "Z=(X−μ)/σ",
                            "blue",
                        ),
                        gnSection(
                            ["反求臨界值", "Finding a cutoff"],
                            ["先從概率找 z 值", "再用 x=μ+zσ 轉回原單位"],
                            ["find z from the probability", "then return with x=μ+zσ"],
                            "P(X≤x)=0.90 ⇒ z≈1.282",
                            "yellow",
                        ),
                    ],
                    { type: "distribution", labels: ["μ−σ", "μ", "μ+σ"] },
                    [
                        "圖上的陰影方向可抓到大部分 calculator 尾端錯誤。",
                        "The shaded sketch catches most tail-direction errors.",
                    ],
                ),
                gnPage(
                    ["假設檢驗｜證據有多極端？", "Hypothesis testing - how extreme?"],
                    "checklist",
                    [
                        gnSection(
                            ["六步", "Six steps"],
                            ["寫 H₀、H₁ 與顯著水平", "選統計量及其 H₀ 分佈", "算 p-value，與 α 比較"],
                            [
                                "state H₀, H₁, and significance",
                                "choose statistic and null distribution",
                                "calculate p-value and compare with α",
                            ],
                            "p≤α ⇒ reject H₀",
                            "yellow",
                        ),
                        gnSection(
                            ["結論語言", "Conclusion wording"],
                            ["說『有足夠證據支持 H₁』", "不要說『證明 H₀ 錯』"],
                            ["say ‘sufficient evidence supports H₁’", "do not say ‘H₀ is proved false’"],
                            "decision ≠ certainty",
                            "pink",
                        ),
                    ],
                    { type: "checklist", labels: ["H₀", "p-value", "context"] },
                    [
                        "一尾或兩尾由 H₁ 決定，不由數據長相決定。",
                        "H₁ determines one- or two-tailed, not the data shape.",
                    ],
                ),
                gnPage(
                    ["相關、回歸與不能亂講因果", "Correlation, regression, and causation"],
                    "map",
                    [
                        gnSection(
                            ["散點圖先看", "Read the scatter first"],
                            ["方向、強度、形狀、離群值", "r 只量度線性相關"],
                            ["direction, strength, form, outliers", "r measures linear association only"],
                            "−1≤r≤1",
                            "mint",
                        ),
                        gnSection(
                            ["回歸線", "Regression line"],
                            ["ŷ=a+bx 用來預測 y", "只在數據範圍內內插較可信"],
                            ["ŷ=a+bx predicts y", "interpolation is safer than extrapolation"],
                            "residual = observed − predicted",
                            "blue",
                        ),
                    ],
                    { type: "scatter", labels: ["trend", "outlier", "residual"] },
                    [
                        "相關不代表因果：可能有 lurking variable。",
                        "Correlation is not causation; a lurking variable may explain both.",
                    ],
                ),
            ],
        },
        {
            id: "mechanics",
            subject: "physics",
            favorite: true,
            shared: false,
            preview: "MECHANICS",
            title: gnBi("力學與動量", "Mechanics & Momentum"),
            updated: gnBi("7月18日 下午9:06", "18 Jul, 9:06 PM"),
            date: gnBi("2026年7月18日", "18 JUL 2026"),
            pages: [
                gnPage(
                    ["受力圖：只畫作用在物體上的力", "Free-body diagrams"],
                    "map",
                    [
                        gnSection(
                            ["斜面分解", "Resolve on a slope"],
                            ["平行斜面：mg sinθ", "垂直斜面：mg cosθ", "N 不一定等於 mg"],
                            ["parallel: mg sinθ", "perpendicular: mg cosθ", "N is not always mg"],
                            "ΣF∥=ma;  ΣF⟂=0",
                            "violet",
                        ),
                        gnSection(
                            ["摩擦力", "Friction"],
                            ["方向反抗相對運動或其趨勢", "極限摩擦 F=μN 只在臨界時用"],
                            ["opposes relative motion or its tendency", "F=μN only at limiting friction"],
                            "F≤μN",
                            "yellow",
                        ),
                    ],
                    { type: "force", labels: ["N", "mg", "friction"] },
                    [
                        "先選正方向，再寫每個力的正負；不要靠直覺改號。",
                        "Choose positive direction before assigning signs.",
                    ],
                ),
                gnPage(
                    ["SUVAT｜只適用於等加速度", "SUVAT - constant acceleration only"],
                    "split",
                    [
                        gnSection(
                            ["五個量", "Five quantities"],
                            ["s 位移、u 初速、v 末速", "a 加速度、t 時間"],
                            ["s displacement, u initial speed, v final speed", "a acceleration, t time"],
                            "v=u+at;  s=ut+½at²",
                            "blue",
                        ),
                        gnSection(
                            ["選公式技巧", "Choosing an equation"],
                            ["圈出已知量與所求量", "選一條不含未知干擾量的公式"],
                            [
                                "circle knowns and the target",
                                "choose an equation excluding the unwanted unknown",
                            ],
                            "v²=u²+2as",
                            "mint",
                        ),
                    ],
                    { type: "motion", labels: ["u", "a", "v"] },
                    [
                        "位移可為負；distance 與 displacement 不可混用。",
                        "Displacement can be negative; it is not distance.",
                    ],
                ),
                gnPage(
                    ["衝量與動量守恆", "Impulse and momentum"],
                    "worked",
                    [
                        gnSection(
                            ["系統觀點", "System view"],
                            ["外力衝量可忽略 ⇒ 總動量守恆", "碰撞前後分開寫，再選正方向"],
                            [
                                "negligible external impulse ⇒ momentum conserved",
                                "write before/after and choose a positive direction",
                            ],
                            "m₁u₁+m₂u₂=m₁v₁+m₂v₂",
                            "yellow",
                        ),
                        gnSection(
                            ["力-時間圖", "Force-time graph"],
                            ["曲線下的面積就是衝量", "衝量等於動量改變"],
                            ["area under the graph is impulse", "impulse equals change in momentum"],
                            "J=∫Fdt=Δp",
                            "pink",
                        ),
                    ],
                    { type: "collision", labels: ["before", "impact", "after"] },
                    [
                        "動能只在彈性碰撞守恆；動量在封閉系統都守恆。",
                        "Kinetic energy is conserved only in elastic collisions.",
                    ],
                ),
                gnPage(
                    ["功、能量、功率", "Work, energy, power"],
                    "flow",
                    [
                        gnSection(
                            ["能量帳本", "Energy bookkeeping"],
                            ["先定 system boundary", "損失的機械能通常轉成熱或聲"],
                            ["define the system boundary", "lost mechanical energy becomes heat or sound"],
                            "W=Fs cosθ;  Ek=½mv²;  Ep=mgh",
                            "mint",
                        ),
                        gnSection(
                            ["功率", "Power"],
                            ["功率是能量轉移速率", "恆速且力同方向時 P=Fv"],
                            ["power is the rate of energy transfer", "at constant speed along force, P=Fv"],
                            "P=W/t=Fv",
                            "violet",
                        ),
                    ],
                    { type: "energy", labels: ["Ep", "Ek", "thermal"] },
                    ["每項都寫單位 J；功率單位 W = J s⁻¹。", "Use J for energy and W = J s⁻¹ for power."],
                ),
                gnPage(
                    ["拋體運動：水平與鉛直分開", "Projectiles: split horizontal and vertical"],
                    "map",
                    [
                        gnSection(
                            ["初速度分量", "Initial components"],
                            ["uₓ=u cosθ；uᵧ=u sinθ", "忽略空氣阻力時 aₓ=0、aᵧ=−g"],
                            ["uₓ=u cosθ; uᵧ=u sinθ", "without drag, aₓ=0 and aᵧ=−g"],
                            "x=u cosθ·t",
                            "blue",
                        ),
                        gnSection(
                            ["同一個時間 t", "One shared time"],
                            ["先用鉛直運動求 t", "再把 t 放入水平位移"],
                            ["find t from vertical motion", "use the same t horizontally"],
                            "y=u sinθ·t−½gt²",
                            "yellow",
                        ),
                    ],
                    { type: "projectile", labels: ["u cosθ", "u sinθ", "g"] },
                    [
                        "最高點只有 vᵧ=0；水平速度仍然存在。",
                        "At the top only vᵧ=0; horizontal velocity remains.",
                    ],
                ),
            ],
        },
        {
            id: "waves",
            subject: "physics",
            favorite: false,
            shared: true,
            preview: "WAVES",
            title: gnBi("波與繞射", "Waves & Diffraction"),
            updated: gnBi("7月13日 下午12:13", "13 Jul, 12:13 PM"),
            date: gnBi("2026年7月13日", "13 JUL 2026"),
            pages: [
                gnPage(
                    ["波的語言", "The language of waves"],
                    "split",
                    [
                        gnSection(
                            ["一條式連起三個量", "One relationship"],
                            ["頻率由波源決定", "波速由介質決定；換介質時頻率不變"],
                            [
                                "frequency is fixed by the source",
                                "speed depends on medium; frequency stays constant across a boundary",
                            ],
                            "v=fλ",
                            "violet",
                        ),
                        gnSection(
                            ["相位差", "Phase difference"],
                            ["相差一個波長 = 2π rad", "同相加強，反相抵消"],
                            [
                                "one wavelength corresponds to 2π rad",
                                "in phase reinforces; antiphase cancels",
                            ],
                            "Δφ=2πΔx/λ",
                            "blue",
                        ),
                    ],
                    { type: "wave", labels: ["A", "λ", "T"] },
                    [
                        "振幅影響能量，不改變同一介質中的波速。",
                        "Amplitude affects energy, not wave speed in one medium.",
                    ],
                ),
                gnPage(
                    ["疊加與干涉", "Superposition and interference"],
                    "map",
                    [
                        gnSection(
                            ["路程差", "Path difference"],
                            ["相長：nλ", "相消：(n+½)λ"],
                            ["constructive: nλ", "destructive: (n+½)λ"],
                            "Δx = |S₁P−S₂P|",
                            "yellow",
                        ),
                        gnSection(
                            ["相干波源", "Coherent sources"],
                            ["頻率相同且相位差固定", "強度圖樣穩定才看得到條紋"],
                            [
                                "same frequency and fixed phase difference",
                                "stable phase gives a stable fringe pattern",
                            ],
                            "Imax ∝ (A₁+A₂)²",
                            "pink",
                        ),
                    ],
                    { type: "interference", labels: ["S₁", "S₂", "P"] },
                    [
                        "先判斷題目給的是 phase difference 還是 path difference。",
                        "Separate phase difference from path difference.",
                    ],
                ),
                gnPage(
                    ["單縫繞射", "Single-slit diffraction"],
                    "worked",
                    [
                        gnSection(
                            ["最小值條件", "Minima condition"],
                            ["a 是縫寬，不是屏幕距離", "中央亮紋寬度約為其他亮紋兩倍"],
                            [
                                "a is slit width, not screen distance",
                                "the central maximum is about twice as wide",
                            ],
                            "a sinθ=nλ,  n=1,2,3…",
                            "blue",
                        ),
                        gnSection(
                            ["圖樣怎樣變？", "How the pattern changes"],
                            ["λ 增大 ⇒ 展開", "a 減小 ⇒ 展開"],
                            ["larger λ ⇒ wider pattern", "smaller a ⇒ wider pattern"],
                            "small angle: y≈nλD/a",
                            "yellow",
                        ),
                    ],
                    { type: "diffraction", labels: ["slit a", "θ", "screen"] },
                    [
                        "最明顯的繞射：孔徑尺寸和 λ 同量級。",
                        "Diffraction is strongest when aperture and λ are comparable.",
                    ],
                ),
                gnPage(
                    ["折射與全內反射", "Refraction and total internal reflection"],
                    "flow",
                    [
                        gnSection(
                            ["折射率", "Refractive index"],
                            ["進入較慢介質時向法線偏", "頻率不變，速度與波長一起改"],
                            [
                                "slower medium bends toward the normal",
                                "frequency stays; speed and wavelength change together",
                            ],
                            "n=c/v;  n₁sinθ₁=n₂sinθ₂",
                            "mint",
                        ),
                        gnSection(
                            ["臨界角", "Critical angle"],
                            ["只由較密介質射向較疏介質", "入射角大於 c 才全內反射"],
                            ["only from higher n to lower n", "TIR occurs when incidence exceeds c"],
                            "sin c = n₂/n₁",
                            "violet",
                        ),
                    ],
                    { type: "refraction", labels: ["normal", "θ₁", "θ₂"] },
                    ["所有角度都從法線量，不是從界面量。", "Measure every angle from the normal."],
                ),
                gnPage(
                    ["駐波與共振", "Standing waves and resonance"],
                    "checklist",
                    [
                        gnSection(
                            ["駐波特徵", "Standing-wave features"],
                            ["節點振幅為 0；腹點振幅最大", "相鄰節點距離 = λ/2"],
                            ["nodes have zero amplitude; antinodes maximum", "adjacent nodes are λ/2 apart"],
                            "string/open pipe: L=nλ/2",
                            "yellow",
                        ),
                        gnSection(
                            ["一端封閉氣柱", "One-end-closed pipe"],
                            ["封閉端是位移節點", "只出現奇次諧波"],
                            ["closed end is a displacement node", "only odd harmonics occur"],
                            "L=(2n−1)λ/4",
                            "blue",
                        ),
                    ],
                    { type: "standing", labels: ["node", "antinode", "node"] },
                    [
                        "先畫邊界條件，再數四分之一波長。",
                        "Draw boundary conditions before counting quarter wavelengths.",
                    ],
                ),
            ],
        },
        {
            id: "equilibrium",
            subject: "chemistry",
            favorite: true,
            shared: false,
            preview: "EQUILIBRIUM",
            title: gnBi("化學平衡與酸鹼", "Equilibrium & Acids"),
            updated: gnBi("7月9日 下午6:32", "9 Jul, 6:32 PM"),
            date: gnBi("2026年7月9日", "9 JUL 2026"),
            pages: [
                gnPage(
                    ["動態平衡與 Kc", "Dynamic equilibrium and Kc"],
                    "split",
                    [
                        gnSection(
                            ["平衡不是停止", "Equilibrium is not stopped"],
                            ["正逆反應仍進行，但速率相等", "濃度保持不變，不代表相等"],
                            [
                                "forward and reverse reactions continue at equal rates",
                                "concentrations stay constant, not necessarily equal",
                            ],
                            "rateforward = ratereverse",
                            "mint",
                        ),
                        gnSection(
                            ["寫 Kc", "Writing Kc"],
                            ["次方來自化學計量係數", "純固體、純液體不寫入"],
                            ["powers come from stoichiometric coefficients", "omit pure solids and liquids"],
                            "aA+bB⇌cC+dD; Kc=[C]ᶜ[D]ᵈ/[A]ᵃ[B]ᵇ",
                            "yellow",
                        ),
                    ],
                    { type: "equilibrium", labels: ["forward", "equal rates", "reverse"] },
                    [
                        "同一反應只有溫度改變才會改變 Kc。",
                        "Only temperature changes Kc for a fixed reaction.",
                    ],
                ),
                gnPage(
                    ["Le Châtelier：系統反抗改變", "Le Châtelier - opposing change"],
                    "map",
                    [
                        gnSection(
                            ["濃度與壓力", "Concentration and pressure"],
                            ["加反應物 ⇒ 向消耗它的方向", "加壓 ⇒ 向氣體摩爾數較少一側"],
                            ["add reactant ⇒ shift to consume it", "higher pressure ⇒ fewer gas moles"],
                            "position changes; Kc unchanged",
                            "blue",
                        ),
                        gnSection(
                            ["溫度", "Temperature"],
                            ["把熱視為反應物或生成物", "升溫偏向吸熱方向，而且 Kc 改變"],
                            [
                                "treat heat as reactant or product",
                                "higher T favours endothermic direction and changes Kc",
                            ],
                            "exothermic: ΔH<0",
                            "pink",
                        ),
                    ],
                    { type: "balance", labels: ["stress", "shift", "new equilibrium"] },
                    [
                        "催化劑只加快到達平衡；不改變位置或 Kc。",
                        "A catalyst changes time to equilibrium, not position or Kc.",
                    ],
                ),
                gnPage(
                    ["pH 計算｜先判斷強弱", "pH - decide strong or weak first"],
                    "worked",
                    [
                        gnSection(
                            ["強酸例題", "Strong-acid example"],
                            ["0.0020 mol dm⁻³ HCl 完全解離", "[H⁺]=2.0×10⁻³"],
                            ["0.0020 mol dm⁻³ HCl fully dissociates", "[H⁺]=2.0×10⁻³"],
                            "pH=−log(2.0×10⁻³)=2.70",
                            "yellow",
                        ),
                        gnSection(
                            ["25°C 水的關係", "Water at 25°C"],
                            ["pH+pOH=14.00", "稀釋後 pH 靠近 7，但不會跨過 7"],
                            ["pH+pOH=14.00", "dilution moves pH toward 7 without crossing it"],
                            "Kw=[H⁺][OH⁻]=1.0×10⁻¹⁴",
                            "mint",
                        ),
                    ],
                    { type: "ph", labels: ["acid", "7", "alkali"] },
                    ["濃度單位要先化成 mol dm⁻³。", "Convert concentration to mol dm⁻³ before using logs."],
                ),
                gnPage(
                    ["滴定曲線怎樣讀", "Reading titration curves"],
                    "flow",
                    [
                        gnSection(
                            ["先認四個區域", "Four regions"],
                            ["初始 pH、緩衝區、當量點、過量滴定劑", "半當量點：pH=pKa（弱酸）"],
                            [
                                "initial pH, buffer, equivalence, excess titrant",
                                "half-equivalence: pH=pKa for a weak acid",
                            ],
                            "equivalence ≠ always pH 7",
                            "violet",
                        ),
                        gnSection(
                            ["指示劑選擇", "Choosing an indicator"],
                            ["變色範圍要落在陡直區", "不是挑 pH 最接近 7 的指示劑"],
                            [
                                "transition range must lie inside the steep section",
                                "do not simply choose one nearest pH 7",
                            ],
                            "indicator range ⊂ vertical jump",
                            "yellow",
                        ),
                    ],
                    { type: "titration", labels: ["buffer", "equivalence", "excess"] },
                    ["先標坐標：x 是加入體積，y 是 pH。", "Label axes first: volume added versus pH."],
                ),
                gnPage(
                    ["Buffer｜少量酸鹼來了也頂住", "Buffers resist small acid/base additions"],
                    "checklist",
                    [
                        gnSection(
                            ["組成", "Composition"],
                            ["弱酸 HA + 其共軛鹼 A⁻", "加 H⁺ 時 A⁻ 消耗它；加 OH⁻ 時 HA 消耗它"],
                            ["weak acid HA plus conjugate base A⁻", "A⁻ removes H⁺; HA removes OH⁻"],
                            "pH=pKa+log([A⁻]/[HA])",
                            "blue",
                        ),
                        gnSection(
                            ["容量與限制", "Capacity and limits"],
                            ["兩者濃度越高，buffer capacity 越大", "加入太多酸鹼仍會失效"],
                            [
                                "higher component concentrations give more capacity",
                                "too much acid/base overwhelms the buffer",
                            ],
                            "best near pH≈pKa",
                            "mint",
                        ),
                    ],
                    { type: "balance", labels: ["HA", "H⁺/OH⁻", "A⁻"] },
                    [
                        "稀釋理想 buffer 時比例近乎不變，所以 pH 近乎不變。",
                        "Dilution keeps the ratio, so ideal buffer pH changes little.",
                    ],
                ),
            ],
        },
        {
            id: "organic",
            subject: "chemistry",
            favorite: false,
            shared: true,
            preview: "ORGANIC",
            title: gnBi("有機反應路線", "Organic Reaction Routes"),
            updated: gnBi("7月4日 下午3:18", "4 Jul, 3:18 PM"),
            date: gnBi("2026年7月4日", "4 JUL 2026"),
            pages: [
                gnPage(
                    ["官能團先認清，再選反應", "Functional groups first"],
                    "map",
                    [
                        gnSection(
                            ["碳碳鍵路線", "Carbon-carbon routes"],
                            ["alkane → haloalkane：free-radical substitution", "alkene → alcohol：hydration"],
                            ["alkane → haloalkane: free-radical substitution", "alkene → alcohol: hydration"],
                            "C=C  →  C−C",
                            "mint",
                        ),
                        gnSection(
                            ["含氧官能團", "Oxygen groups"],
                            [
                                "primary alcohol 可氧化成 aldehyde，再成 acid",
                                "secondary alcohol 氧化成 ketone",
                            ],
                            [
                                "primary alcohol oxidises to aldehyde, then acid",
                                "secondary alcohol oxidises to ketone",
                            ],
                            "1° alcohol → aldehyde → carboxylic acid",
                            "yellow",
                        ),
                    ],
                    { type: "reaction", labels: ["functional group", "reagent", "product"] },
                    [
                        "箭嘴上寫 reagent；箭嘴下寫 condition。",
                        "Put reagent above the arrow and conditions below.",
                    ],
                ),
                gnPage(
                    ["機理：curly arrow 從電子出發", "Mechanisms - arrows start at electrons"],
                    "worked",
                    [
                        gnSection(
                            ["親電加成", "Electrophilic addition"],
                            ["π 鍵電子攻擊 electrophile", "中間體再被 nucleophile 攻擊"],
                            [
                                "π electrons attack the electrophile",
                                "the intermediate is attacked by a nucleophile",
                            ],
                            "alkene + HBr → bromoalkane",
                            "pink",
                        ),
                        gnSection(
                            ["標記電荷", "Show charges"],
                            ["所有 lone pair、δ⁺/δ⁻、formal charge 都畫", "箭嘴頭指向新鍵或接受電子的原子"],
                            [
                                "draw lone pairs, δ⁺/δ⁻, and formal charges",
                                "arrowhead points to the new bond or electron receiver",
                            ],
                            "electron pair: source ↷ destination",
                            "violet",
                        ),
                    ],
                    { type: "mechanism", labels: ["π electrons", "carbocation", "Br⁻"] },
                    [
                        "半箭嘴代表單電子；一般 ionic mechanism 用全箭嘴。",
                        "Half-headed arrows are for single electrons; ionic mechanisms use full arrows.",
                    ],
                ),
                gnPage(
                    ["氧化、還原與條件", "Oxidation, reduction, and conditions"],
                    "split",
                    [
                        gnSection(
                            ["控制 aldehyde 或 acid", "Stop at aldehyde or continue"],
                            ["蒸餾：aldehyde 生成後移走", "回流＋過量 oxidant：到 carboxylic acid"],
                            ["distil aldehyde as it forms", "reflux with excess oxidant to the acid"],
                            "K₂Cr₂O₇/H⁺: orange → green",
                            "yellow",
                        ),
                        gnSection(
                            ["還原", "Reduction"],
                            ["NaBH₄ 還原 aldehyde/ketone", "H₂/Ni 可還原 C=C"],
                            ["NaBH₄ reduces aldehydes/ketones", "H₂/Ni reduces C=C"],
                            "C=O + 2[H] → CH−OH",
                            "blue",
                        ),
                    ],
                    { type: "reaction", labels: ["distil", "reflux", "reduce"] },
                    [
                        "『heat』不夠：要寫 reflux / distillation 及試劑。",
                        "‘Heat’ is not enough: state reflux/distillation and reagent.",
                    ],
                ),
                gnPage(
                    ["光譜拼圖：每種證據答一件事", "Spectroscopy as a puzzle"],
                    "flow",
                    [
                        gnSection(
                            ["IR", "IR"],
                            ["寬闊 O−H 約 2500-3300 cm⁻¹（acid）", "強 C=O 約 1700 cm⁻¹"],
                            ["broad O−H around 2500-3300 cm⁻¹ for acids", "strong C=O near 1700 cm⁻¹"],
                            "bond type ← absorption position",
                            "mint",
                        ),
                        gnSection(
                            ["¹H NMR + mass spectrum", "¹H NMR + mass spectrum"],
                            ["峰組數＝不同 proton environment", "integration 給相對 H 數；M⁺ 給 Mr"],
                            [
                                "signal count gives proton environments",
                                "integration gives H ratio; M⁺ gives Mr",
                            ],
                            "structure = formula + IR + NMR",
                            "pink",
                        ),
                    ],
                    { type: "spectrum", labels: ["chemical shift", "integration", "splitting"] },
                    [
                        "先寫 molecular formula，再檢查總 H 數與不飽和度。",
                        "Start with molecular formula; check H total and unsaturation.",
                    ],
                ),
                gnPage(
                    ["合成題｜由目標倒推", "Synthesis planning - work backwards"],
                    "checklist",
                    [
                        gnSection(
                            ["Retrosynthesis", "Retrosynthesis"],
                            ["圈出目標官能團，問它可由什麼前體生成", "再把逆向步驟翻回正向路線"],
                            [
                                "circle the target group and identify a precursor",
                                "then reverse the steps into a forward route",
                            ],
                            "target ⇐ precursor ⇐ starting material",
                            "blue",
                        ),
                        gnSection(
                            ["每一步要齊", "Every step needs"],
                            ["試劑、條件、主要產物", "必要時寫 purification 或 observation"],
                            [
                                "reagent, conditions, major product",
                                "include purification or observation when required",
                            ],
                            "reagent + condition + transformation",
                            "yellow",
                        ),
                    ],
                    { type: "reaction", labels: ["start", "intermediate", "target"] },
                    [
                        "最後逐個碳原子數一次，避免無意中增碳或減碳。",
                        "Count carbons at every step to catch accidental chain changes.",
                    ],
                ),
            ],
        },
    ];
}

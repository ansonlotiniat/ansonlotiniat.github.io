import postcss from "postcss";
import selectorParser from "postcss-selector-parser";

/** Constrain the matched element without increasing selector specificity. */
export function scopeAppStyles(css, id) {
    const sheet = postcss.parse(css);
    const guard = `:where([data-window="${id}"], [data-window="${id}"] *)`;
    sheet.walkRules((rule) => {
        if (rule.parent.type === "atrule" && /keyframes$/.test(rule.parent.name)) return;
        rule.selector = selectorParser((selectors) => {
            selectors.each((selector) => {
                const boundary = selector.nodes.findLastIndex((node) => node.type === "combinator");
                const pseudoElement = selector.nodes
                    .slice(boundary + 1)
                    .find(
                        (node) =>
                            node.type === "pseudo" &&
                            (/^::/.test(node.value) ||
                                /^:(before|after|first-letter|first-line)$/.test(node.value)),
                    );
                const constraint = selectorParser().astSync(guard).first.first.clone();
                if (pseudoElement) selector.insertBefore(pseudoElement, constraint);
                else selector.append(constraint);
            });
        }).processSync(rule.selector);
    });
    return sheet.toString();
}

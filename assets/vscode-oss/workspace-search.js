/* Search provider for the disposable public tmp: workspace. This classic
   script runs before the Code - OSS module so the pinned core hook can
   register it while the workbench services are being constructed. */
(() => {
    const workspace = globalThis.__ANSON_VSCODE_WORKSPACE;
    if (!workspace?.files?.length) return;

    const files = workspace.files.map((file) => ({
        ...file,
        basename: file.path.slice(file.path.lastIndexOf("/") + 1),
        lowerPath: file.path.toLowerCase(),
    }));

    function isCancelled(token) {
        return Boolean(token?.isCancellationRequested);
    }

    function folderRoot(folderQuery) {
        return String(folderQuery?.folder?.path || "").replace(/^\/+|\/+$/g, "");
    }

    function isInsideFolder(file, folderQuery) {
        const root = folderRoot(folderQuery);
        return !root || file.path === root || file.path.startsWith(`${root}/`);
    }

    function fileMatches(file, rawPattern) {
        const pattern = String(rawPattern || "").toLowerCase();
        if (!pattern) return true;
        if (file.lowerPath.includes(pattern)) return true;

        // Quick Open also sends fuzzy fragments. A subsequence match keeps the
        // small in-memory workspace feeling like native VS Code file search.
        let cursor = 0;
        for (const character of file.lowerPath) {
            if (character === pattern[cursor]) cursor += 1;
            if (cursor === pattern.length) return true;
        }
        return false;
    }

    function matchingFiles(query, token) {
        const matches = [];
        const seen = new Set();
        for (const folderQuery of query.folderQueries || []) {
            for (const file of files) {
                if (isCancelled(token)) return matches;
                if (seen.has(file.path) || !isInsideFolder(file, folderQuery)) continue;
                if (!fileMatches(file, query.filePattern)) continue;
                seen.add(file.path);
                matches.push({ file, folderQuery });
            }
        }
        return matches.sort((left, right) => {
            const pattern = String(query.filePattern || "").toLowerCase();
            const leftName = left.file.basename.toLowerCase();
            const rightName = right.file.basename.toLowerCase();
            const leftRank = leftName === pattern ? 0 : leftName.startsWith(pattern) ? 1 : 2;
            const rightRank = rightName === pattern ? 0 : rightName.startsWith(pattern) ? 1 : 2;
            return leftRank - rightRank || left.file.path.localeCompare(right.file.path);
        });
    }

    function fileResource(file, folderQuery) {
        return folderQuery.folder.with({ path: `/${file.path}` });
    }

    function findLiteralMatches(line, pattern, caseSensitive, wordMatch) {
        const haystack = caseSensitive ? line : line.toLowerCase();
        const needle = caseSensitive ? pattern : pattern.toLowerCase();
        const matches = [];
        if (!needle) return matches;
        let offset = 0;
        while (offset <= haystack.length - needle.length) {
            const index = haystack.indexOf(needle, offset);
            if (index < 0) break;
            const before = line[index - 1] || "";
            const after = line[index + needle.length] || "";
            const isWordCharacter = (character) => /[\p{L}\p{N}_]/u.test(character);
            if (!wordMatch || (!isWordCharacter(before) && !isWordCharacter(after))) {
                matches.push([index, index + needle.length]);
            }
            offset = index + Math.max(needle.length, 1);
        }
        return matches;
    }

    function findRegExpMatches(line, patternInfo) {
        let expression;
        try {
            expression = new RegExp(
                patternInfo.pattern,
                `g${patternInfo.isCaseSensitive ? "" : "i"}${patternInfo.isUnicode ? "u" : ""}`,
            );
        } catch {
            return [];
        }

        const matches = [];
        let match;
        while ((match = expression.exec(line))) {
            matches.push([match.index, match.index + match[0].length]);
            if (!match[0].length) expression.lastIndex += 1;
        }
        return matches;
    }

    function textMatchesForFile(file, patternInfo, remaining) {
        const results = [];
        const lines = file.content.split("\n");
        for (let lineNumber = 0; lineNumber < lines.length && results.length < remaining; lineNumber += 1) {
            const line = lines[lineNumber];
            const matches = patternInfo.isRegExp
                ? findRegExpMatches(line, patternInfo)
                : findLiteralMatches(line, patternInfo.pattern, patternInfo.isCaseSensitive, patternInfo.isWordMatch);
            for (const [startColumn, endColumn] of matches) {
                const source = { startLineNumber: lineNumber, startColumn, endLineNumber: lineNumber, endColumn };
                const preview = { startLineNumber: 0, startColumn, endLineNumber: 0, endColumn };
                results.push({ previewText: line, rangeLocations: [{ source, preview }] });
                if (results.length >= remaining) break;
            }
        }
        return results;
    }

    globalThis.__ANSON_SEARCH_PROVIDER = {
        async getAIName() {
            return undefined;
        },

        async clearCache() {},

        async fileSearch(query, token) {
            const maxResults = Math.max(1, query.maxResults || 10000);
            const matches = matchingFiles(query, token);
            const limitHit = matches.length > maxResults;
            if (query.exists) return { limitHit: matches.length > 0, results: [], messages: [] };
            return {
                limitHit,
                messages: [],
                results: matches.slice(0, maxResults).map(({ file, folderQuery }) => ({
                    resource: fileResource(file, folderQuery),
                })),
            };
        },

        async textSearch(query, onProgress, token) {
            const maxResults = Math.max(1, query.maxResults || 10000);
            const fileCandidates = matchingFiles({ ...query, filePattern: "" }, token);
            const results = [];
            let matchCount = 0;
            let limitHit = false;

            for (const { file, folderQuery } of fileCandidates) {
                if (isCancelled(token)) break;
                const fileResults = textMatchesForFile(file, query.contentPattern, maxResults - matchCount);
                if (!fileResults.length) continue;
                const fileMatch = { resource: fileResource(file, folderQuery), results: fileResults };
                results.push(fileMatch);
                onProgress?.(fileMatch);
                matchCount += fileResults.length;
                if (matchCount >= maxResults) {
                    limitHit = true;
                    break;
                }
            }

            return { limitHit, results, messages: [] };
        },
    };
})();

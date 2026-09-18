import js from "@eslint/js";
import globals from "globals";

export default [
    { ignores: ["src/apps/_template/**"] },
    js.configs.recommended,
    { files: ["src/**/*.js"], languageOptions: { globals: globals.browser } },
    {
        files: ["src/apps/*/**/*.js", "src/apps/*/*.js"],
        rules: {
            "no-restricted-syntax": [
                "error",
                {
                    selector:
                        "CallExpression[callee.object.name='document'][callee.property.name=/^(querySelector|querySelectorAll|getElementById)$/]",
                    message: "App DOM queries must use the injected root so they cannot reach another App.",
                },
            ],
        },
    },
    {
        files: ["scripts/**/*.mjs", "tests/**/*.mjs", "eslint.config.js"],
        languageOptions: { globals: { ...globals.node, ...globals.browser } },
    },
    { rules: { "no-unused-vars": ["error", { argsIgnorePattern: "^_", caughtErrorsIgnorePattern: "^_" }] } },
];

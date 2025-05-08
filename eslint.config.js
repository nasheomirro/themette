import js from "@eslint/js";
import ts from "typescript-eslint";
import prettier from "eslint-config-prettier/flat";
import globals from "globals";
import svelte from "eslint-plugin-svelte";

export default ts.config(
  {
    ignores: [
      "**/node_modules/*",
      "**/dist/",
      "**/build/",
      "**/pagefind",
      "**/.svelte-kit",
    ],
  },
  prettier,
  js.configs.recommended,
  ts.configs.recommended,
  svelte.configs["flat/recommended"],
  {
    files: ["**/*.svelte", "**/*.svelte.ts", "**/*.svelte.js"],
    // See more details at: https://typescript-eslint.io/packages/parser/
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        projectService: true,
        extraFileExtensions: [".svelte"], // Add support for additional file extensions, such as .svelte
        parser: ts.parser,
      },
    },
  },
);

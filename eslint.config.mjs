import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";


/** @type {import('eslint').Linter.Config[]} */
export default [
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: [
      "node_modules",
      "dist",
      "webpack.config.js"
    ],
  },
  {
    files: [
      "src/**/*.ts"
    ],
    languageOptions: { 
      parser: tsParser,
      globals: globals.node 
    },
    plugins: {
      "@typescript-eslint": tsPlugin
    },
    "rules": {
      "@typescript-eslint/no-explicit-any": "warn"
    }
  }
];
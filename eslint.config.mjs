import { defineConfig } from "eslint/config";
import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default defineConfig([
  {
    files: ["src/**/*.js", "test/**/*.js"],
    extends: compat.extends("eslint:recommended"),

    languageOptions: {
      globals: {
        ...globals.webextensions,
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
        importScripts: "readonly",
      },

      ecmaVersion: "latest",
      sourceType: "module",
    },

    rules: {},
  }
]);
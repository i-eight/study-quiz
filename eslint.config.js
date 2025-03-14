// @ts-check
import eslint from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import globals from "globals";
import tseslint from "typescript-eslint";
import gitignore from "eslint-config-flat-gitignore";
import prettierConfig from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import";
import unusedImports from "eslint-plugin-unused-imports";

export default tseslint.config(
  {
    ignores: ["eslint.config.js"],
  },
  gitignore(),
  eslint.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  importPlugin.flatConfigs.recommended,
  importPlugin.flatConfigs.typescript,
  {
    languageOptions: {
      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        project: true,
        tsconfigRootDir: "src/",
      },
    },
  },
  prettierConfig
);

// @ts-check
const { defineConfig } = require("eslint/config");
const eslint = require("@eslint/js");
const tseslint = require("typescript-eslint");
const angular = require("angular-eslint");

module.exports = defineConfig(
  {
    ignores: ["projects/**/*"],
  },
  {
    files: ["**/*.ts"],
    extends: [
      eslint.configs.recommended,
      tseslint.configs.recommended,
      angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      "@angular-eslint/directive-selector": "off",
      "@angular-eslint/component-selector": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-import-type-side-effects": "warn",
    },
  },
  {
    files: ["**/*.html"],
    extends: [
      angular.configs.templateRecommended,
      angular.configs.templateAccessibility,
    ],
    rules: {},
  }
);

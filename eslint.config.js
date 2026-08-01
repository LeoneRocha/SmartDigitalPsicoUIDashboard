// @ts-check
const eslint = require("@eslint/js");
const { defineConfig } = require("eslint/config");
const tseslint = require("typescript-eslint");
const angular = require("angular-eslint");

// Legacy NgModule + Creative Tim selectors: keep ESLint active without forcing standalone migration.
module.exports = defineConfig([
  {
    files: ["**/*.ts"],
    extends: [
      eslint.configs.recommended,
      tseslint.configs.recommended,
      angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      "@angular-eslint/prefer-standalone": "off",
      "@angular-eslint/prefer-inject": "off",
      "@angular-eslint/component-selector": "off",
      "@angular-eslint/directive-selector": "off",
      "@angular-eslint/no-empty-lifecycle-method": "warn",
      "@angular-eslint/no-output-native": "warn",
      "@angular-eslint/no-input-rename": "warn",
      "@angular-eslint/no-output-on-prefix": "warn",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
      "@typescript-eslint/ban-ts-comment": "warn",
      "@typescript-eslint/no-wrapper-object-types": "warn",
      "@typescript-eslint/no-unused-expressions": "warn",
      "@typescript-eslint/no-empty-object-type": "warn",
      "no-unused-vars": "off",
      "no-var": "warn",
      "prefer-const": "warn",
      "no-empty": "warn",
      "no-prototype-builtins": "warn",
      "no-case-declarations": "warn",
      "no-useless-escape": "warn",
      "no-debugger": "warn",
      "no-sparse-arrays": "warn",
      "no-constant-binary-expression": "warn",
      "no-useless-assignment": "warn",
    },
  },
  {
    files: ["**/*.html"],
    extends: [
      angular.configs.templateRecommended,
    ],
    rules: {
      "@angular-eslint/template/click-events-have-key-events": "off",
      "@angular-eslint/template/interactive-supports-focus": "off",
      "@angular-eslint/template/label-has-associated-control": "off",
      "@angular-eslint/template/elements-content": "off",
      "@angular-eslint/template/prefer-control-flow": "off",
      "@angular-eslint/template/eqeqeq": "warn",
    },
  }
]);

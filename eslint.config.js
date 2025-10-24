import js from "@eslint/js";
import tsdoc from "eslint-plugin-tsdoc";
import { globalIgnores } from "eslint/config";
import ts from "typescript-eslint";

export default ts.config(
  js.configs.recommended,
  ts.configs.recommended,
  {
    plugins: {
      tsdoc,
    },
  },
  {
    rules: {
      "prefer-const": "off",
      "@typescript-eslint/no-unused-vars": ["warn", {
        varsIgnorePattern: "^_.*",
        argsIgnorePattern: "^_.*",
        caughtErrorsIgnorePattern: "^_",
        destructuredArrayIgnorePattern: "^_",
      }],
    },
  },
  globalIgnores([
    "out/",
    "vendor/",
    "static/",
    "node_modules/",
  ]),
);

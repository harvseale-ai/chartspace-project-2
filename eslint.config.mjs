// eslint.config.mjs defines the rules and environment settings used by ESLint. It tells the project how JavaScript files should be checked, helping catch mistakes before the website is submitted or deployed.

import js from "@eslint/js";
import globals from "globals";

export default [
  js.configs.recommended,
  {
    files: ["assets/js/**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "script",
      globals: {
        ...globals.browser
      }
    },
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "error"
    }
  }
];
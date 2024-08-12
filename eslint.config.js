const eslintPluginPrettier = require("eslint-plugin-prettier");
const typeScriptParser = require("@typescript-eslint/parser");
const typeScriptPlugin = require("@typescript-eslint/eslint-plugin");
/** @type {import('eslint').Linter.Config} */
module.exports = {
    languageOptions: {
        parser: typeScriptParser,
        parserOptions: {
            project: "tsconfig.json",
            ecmaVersion: 2021,
            sourceType: 'module',
        }
    },
    files: [
        "**/*.ts",
        "**/*.tsx"
    ],
    plugins: {
        eslintPluginPrettier, typeScriptPlugin
    },
    rules: {
        'import/prefer-default-export': 'off',
        'class-methods-use-this': 'off',
        'implicit-arrow-linebreak': 'off',
        'typeScriptPlugin/indent': 'off',
        'object-curly-newline': 'off',
        'operator-linebreak': 'off',
        'max-classes-per-file': 'off',
        'function-paren-newline': 'off',
        'no-underscore-dangle': 'off',
        'typeScriptPlugin/no-explicit-any': 'off',
        'arrow-parens': 'off',
        'typeScriptPlugin/ban-types': 'off',
        'typeScriptPlugin/brace-style': 'off',
        "eslintPluginPrettier/prettier": "error",
        "typeScriptPlugin/no-unused-vars": ["error", {
            "argsIgnorePattern": "^_",
            "varsIgnorePattern": "^_",
            "caughtErrorsIgnorePattern": "^_"
        }],
        "typeScriptPlugin/no-unused-expressions": "error",
        "prefer-const": ["error", { "ignoreReadBeforeAssign": true }],
        // "no-unused-expressions": "error",
        // "no-shadow": "off",
        // "typeScriptParser/no-shadow": ["error"]

    },
    ignores: ['node_modules/', 'dist/'], // Add patterns to ignore
};

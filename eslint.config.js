import path from 'path';
import { fileURLToPath } from 'url';
import js from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig([
    globalIgnores(['dist/**', 'node_modules/**', 'src/components/ui/**', 'eslint.config.js']),
    // Main config for TypeScript/TSX source files
    {
        files: ['**/*.{ts,tsx}'],
        extends: [
            js.configs.recommended,
            ...tseslint.configs.recommended,
            reactHooks.configs.flat.recommended,
            reactRefresh.configs.vite,
            prettierConfig,
        ],
        plugins: {
            prettier: prettierPlugin,
        },
        languageOptions: {
            ecmaVersion: 2022,
            globals: {
                ...globals.browser,
            },
            parserOptions: {
                project: ['./tsconfig.app.json', './tsconfig.node.json'],
                tsconfigRootDir: __dirname,
            },
        },
        rules: {
            'prettier/prettier': 'error',

            // TypeScript specific rules
            '@typescript-eslint/no-explicit-any': 'error',
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                },
            ],
            '@typescript-eslint/no-empty-function': 'error',
            '@typescript-eslint/prefer-optional-chain': 'warn',
            '@typescript-eslint/no-unnecessary-type-assertion': 'warn',
            '@typescript-eslint/prefer-as-const': 'warn',
            '@typescript-eslint/naming-convention': [
                'error',
                {
                    selector: 'interface',
                    format: ['PascalCase'],
                },
                {
                    selector: 'typeAlias',
                    format: ['PascalCase'],
                },
                {
                    selector: 'enum',
                    format: ['PascalCase'],
                },
            ],

            // Security rules
            'no-console': 'error',
            'no-eval': 'error',
            'no-implied-eval': 'error',
            'no-new-func': 'error',

            // Code quality rules
            'no-duplicate-imports': 'error',
            'no-self-compare': 'error',
            'no-eq-null': 'warn',
            'no-multi-assign': 'warn',
            'no-nested-ternary': 'warn',
            'no-param-reassign': [
                'error',
                {
                    props: true,
                    ignorePropertyModificationsFor: ['state', 'draft', 'config'],
                },
            ],
            'no-undef-init': 'error',

            // Code style rules
            'arrow-body-style': ['error', 'as-needed'],
            'prefer-arrow-callback': 'warn',
            'prefer-const': 'error',
            'prefer-template': 'warn',
            'object-shorthand': 'warn',

            // Complexity rules
            complexity: ['warn', 15],
            'max-depth': ['warn', 4],
            'max-params': ['warn', 4],
            'max-lines': [
                'error',
                {
                    max: 300,
                    skipBlankLines: true,
                    skipComments: true,
                },
            ],

            // Misc
            'no-unexpected-multiline': 'warn',
            'no-case-declarations': 'off',
        },
    },
]);

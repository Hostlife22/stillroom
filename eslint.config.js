import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';

export default [
  {
    ignores: [
      'dist/**',
      'artifacts/**',
      'coverage/**',
      'playwright-report/**',
      'test-results/**',
      '.kilo/**',
    ],
  },
  {
    files: ['**/*.{js,jsx}'],
    ...js.configs.recommended,
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.browser, ...globals.node },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: { 'react-hooks': reactHooks },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'error',
      'no-unused-vars': [
        'error',
        {
          varsIgnorePattern: '^[A-Z]',
          argsIgnorePattern: '^[A-Z_]',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      'prefer-const': 'error',
    },
  },
];

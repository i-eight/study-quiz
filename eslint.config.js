// @ts-check
import eslint from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import gitignore from 'eslint-config-flat-gitignore';
import prettierConfig from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import unusedImports from 'eslint-plugin-unused-imports';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import tailwindPlugin from 'eslint-plugin-tailwindcss';

export default tseslint.config(
  {
    ignores: [
      'eslint.config.js',
      'next.config.js',
      'postcss.config.cjs',
      'tailwind.config.js',
    ],
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
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
        React: 'readonly',
        JSX: 'readonly',
      },
      parserOptions: {
        project: true,
        tsconfigRootDir: './',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      '@typescript-eslint/no-misused-promises': [
        'error',
        {
          checksVoidReturn: {
            attributes: false,
          },
        },
      ],
    },
  },
  // React configuration
  {
    files: ['**/*.{jsx,tsx}', '**/*.{js,ts}'],
    plugins: {
      react: reactPlugin,
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      'react/prop-types': 'off', // TypeScript handles prop types
      'react/react-in-jsx-scope': 'off', // Not needed in Next.js
      'react/jsx-uses-react': 'off', // Not needed with new JSX transform
      'react/jsx-filename-extension': [1, { extensions: ['.jsx', '.tsx'] }],
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  // React Hooks configuration
  {
    files: ['**/*.{jsx,tsx}', '**/*.{js,ts}'],
    plugins: {
      'react-hooks': reactHooksPlugin,
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
  // Tailwind CSS configuration
  {
    files: ['**/*.{jsx,tsx}', '**/*.{js,ts}'],
    plugins: {
      tailwindcss: tailwindPlugin,
    },
    rules: {
      ...tailwindPlugin.configs.recommended.rules,
      'tailwindcss/classnames-order': 'warn',
      'tailwindcss/no-custom-classname': 'warn',
      'tailwindcss/no-contradicting-classname': 'error',
    },
    settings: {
      tailwindcss: {
        callees: ['classnames', 'clsx', 'ctl'],
        config: 'tailwind.config.js',
      },
    },
  },
  prettierConfig,
);

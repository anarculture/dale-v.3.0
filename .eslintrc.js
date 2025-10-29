// ========================================
// ESLINT CONFIG - DALE PROJECT
// ========================================
module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'next/core-web-vitals',
    '@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: [
    '@typescript-eslint',
    'react',
    'react-hooks',
    'jsx-a11y',
    'import',
  ],
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: './tsconfig.json',
      },
    },
  },
  rules: {
    // ========================================
    // REACT SPECIFIC RULES
    // ========================================
    'react/react-in-jsx-scope': 'off', // Next.js doesn't require React import
    'react/prop-types': 'off', // Using TypeScript for prop validation
    'react/jsx-props-no-spreading': 'warn',
    'react/display-name': 'warn',
    'react/no-unescaped-entities': 'warn',
    'react/jsx-key': ['error', { checkFragmentShorthand: true }],
    
    // ========================================
    // REACT HOOKS RULES
    // ========================================
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    
    // ========================================
    // TYPESCRIPT RULES
    // ========================================
    '@typescript-eslint/no-unused-vars': ['error', { 
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
      caughtErrorsIgnorePattern: '^_',
    }],
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-non-null-assertion': 'warn',
    '@typescript-eslint/prefer-const': 'error',
    '@typescript-eslint/no-var-requires': 'error',
    
    // ========================================
    // IMPORT RULES
    // ========================================
    'import/order': ['error', {
      groups: [
        'builtin',
        'external',
        'internal',
        'parent',
        'sibling',
        'index',
      ],
      'newlines-between': 'always',
      alphabetize: {
        order: 'asc',
        caseInsensitive: true,
      },
    }],
    'import/no-unresolved': 'off',
    'import/named': 'off',
    'import/default': 'off',
    'import/no-absolute-path': 'error',
    
    // ========================================
    // GENERAL CODE QUALITY
    // ========================================
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-debugger': 'error',
    'no-alert': 'error',
    'prefer-const': 'error',
    'no-var': 'error',
    'prefer-arrow-callback': 'error',
    'prefer-template': 'error',
    'object-shorthand': 'error',
    'quote-props': ['error', 'as-needed'],
    
    // ========================================
    // ACCESSIBILITY
    // ========================================
    'jsx-a11y/alt-text': 'error',
    'jsx-a11y/anchor-has-content': 'error',
    'jsx-a11y/anchor-is-valid': 'error',
    'jsx-a11y/aria-role': 'error',
    'jsx-a11y/img-redundant-alt': 'error',
    'jsx-a11y/label-has-associated-control': 'error',
    'jsx-a11y/no-noninteractive-tabindex': 'error',
    'jsx-a11y/role-has-required-aria-props': 'error',
    'jsx-a11y/role-supports-aria-props': 'error',
    
    // ========================================
    // NEXT.JS SPECIFIC
    // ========================================
    '@next/next/no-img-element': 'error',
    '@next/next/no-html-link-for-pages': 'error',
  },
  overrides: [
    {
      files: ['**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts', '**/*.spec.tsx'],
      env: {
        jest: true,
      },
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        'react/display-name': 'off',
      },
    },
    {
      files: ['**/next.config.js', '**/tailwind.config.js', '**/postcss.config.js'],
      env: {
        node: true,
      },
    },
  ],
};
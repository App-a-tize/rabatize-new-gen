module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    parserOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      ecmaFeatures: {
        jsx: true,
      },
    },
    env: {
      es2022: true,
      node: true,
      jest: true,
    },
    plugins: [
      'react',
      'react-hooks',
      '@typescript-eslint',
      'prettier'
    ],
    extends: [
      'eslint:recommended',
      'plugin:react/recommended',
      'plugin:react-hooks/recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:prettier/recommended'
    ],
    rules: {
      // Typescript
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-module-boundary-types': 'off',
  
      // React
      'react/react-in-jsx-scope': 'off', // Not needed with React 17+
      'react/prop-types': 'off',        // Using TS instead
  
      // Prettier
      'prettier/prettier': ['error', {
        endOfLine: 'auto'
      }]
    },
    settings: {
      react: {
        version: 'detect'
      }
    }
  };
  
module.exports = {
    parser: "@typescript-eslint/parser",
    extends: [
      'airbnb-typescript/base',
      "eslint:recommended",
    //   'plugin:@typescript-eslint/recommended',
      'prettier',
    //   'prettier/@typescript-eslint',
    ],
    plugins: ['import', 'prettier', '@typescript-eslint'],
    parserOptions: {
      project: "./tsconfig.json",
      tsconfigRootDir: __dirname,
      project: './tsconfig.json',
    },
    rules: {
      quotes: [
        'error',
        'double',
        { avoidEscape: true, allowTemplateLiterals: true },
      ],
      'import/prefer-default-export': 'off',
      '@typescript-eslint/no-empty-interface': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-underscore-dangle': ['error', { allow: ['_id', '_update' , '__prode__'] }],
      'class-methods-use-this': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
    },
    env:{
      node:true
    }
  };
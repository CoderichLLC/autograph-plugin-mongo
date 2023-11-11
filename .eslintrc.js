module.exports = {
  parser: '@babel/eslint-parser',
  env: { jest: true },
  extends: 'airbnb-base',
  parserOptions: {
    ecmaVersion: 2020,
  },
  settings: {
    'import/core-modules': [
      '@aws-sdk/client-secrets-manager',
      '@aws-sdk/client-lambda',
      '@aws-sdk/util-utf8-node',
      '@coderich/dev',
    ],
  },
  rules: {
    'arrow-body-style': ['off', 'as-needed'],
    'arrow-parens': ['warn', 'as-needed', { requireForBlockBody: true }],
    'comma-dangle': ['error', {
      arrays: 'always-multiline',
      objects: 'always-multiline',
      imports: 'always-multiline',
      exports: 'always-multiline',
      functions: 'ignore',
    }],
    'default-param-last': 'off',
    'function-paren-newline': 'off',
    'import/no-extraneous-dependencies': ['error', { devDependencies: ['**/test/**', '**/__mocks__/**', 'jest.*'] }],
    'lines-between-class-members': ['error', 'always', { exceptAfterSingleLine: true }],
    'max-classes-per-file': 0,
    'max-len': 0,
    'newline-per-chained-call': ['error', { ignoreChainWithDepth: 10 }],
    'no-unsafe-optional-chaining': ['error'],
    'no-multi-assign': 'off',
    'no-constructor-return': 'off',
    'no-param-reassign': 0,
    'no-plusplus': 0,
    'one-var': 0,
    'one-var-declaration-per-line': 0,
    'no-return-assign': ['error', 'except-parens'],
    'no-unused-vars': ['error', { args: 'none' }],
    'object-curly-newline': ['error', { minProperties: 0, consistent: true }],
  },
};

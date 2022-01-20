module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
    'jest/globals': true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  plugins: ['jest'],
  rules: {
    'no-useless-escape': ['off'],
    'no-underscore-dangle': ['off'],
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
    'no-use-before-define': ['off'],
  },
};

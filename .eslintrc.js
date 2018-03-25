module.exports = {
  plugins: [
    'promise',
  ],
  extends: [
    'airbnb-base',
    'plugin:promise/recommended',
  ],
  rules: {
    'require-jsdoc': 'error',
    'valid-jsdoc': 'error',
  },
};

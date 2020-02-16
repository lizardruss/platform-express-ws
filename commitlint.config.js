module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [
      2,
      'always',
      [
        // Global scopes
        'all',
        'release',

        // Resource types
        'express-ws',
      ],
    ],
    'scope-empty': [2, 'never'],
  },
};

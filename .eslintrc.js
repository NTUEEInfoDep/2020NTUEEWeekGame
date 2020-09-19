module.exports = {
  env: {
    browser: true,
    es2020: true,
  },
  extends: ["airbnb", "plugin:prettier/recommended"],
  parserOptions: {
    ecmaVersion: 11,
    sourceType: "module",
  },
  overrides: [
    {
      files: ["src/server/**"],
      rules: {
        "no-console": "off",
        "no-unused-vars": "off",
      },
    },
  ],
};

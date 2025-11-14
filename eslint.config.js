export default [
    {
      ignores: ["node_modules/", "dist/", "venv/", "crwaler/"],
    },
    {
      files: ["**/*.js"],
      languageOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
      },
      rules: {
        semi: ["error", "always"],
        quotes: ["error", "double"],
      },
    },
  ];
  
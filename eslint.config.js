export default [
    {
      ignores: ["public/", "**/*.py", "crawler/**", "venv/**", "node_modules/**"],
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
  
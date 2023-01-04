module.exports = {
  root: true,

  env: {
    node: true
  },

  extends: ["plugin:vue/essential", "eslint:recommended"],

  parserOptions: {
    parser: "@typescript-eslint/parser"
  },

  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-unused-vars": "off",
    'vue/no-deprecated-slot-attribute': 'off',
    "vue/no-multiple-template-root": 0
  
  },

  extends: [
    "plugin:vue/essential",
    "eslint:recommended",    
    "@vue/typescript"
  ]
};

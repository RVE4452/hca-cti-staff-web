const path = require("path");
module.exports = {
  rootDir: path.resolve(__dirname),
  clearMocks: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  moduleFileExtensions: ["vue", "js", "json", "jsx", "ts", "tsx", "node"],
  // The alias set
  moduleNameMapper: {
    "@/(.*)$": "<rootDir>/src/components/$1",
  },
  preset: "ts-jest",
  testEnvironment: "jsdom",
  // The test file
  testMatch: [ "**/src/**/*.spec.[j]s?(x)"],
  // testMatch: [ "**/src/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).vue?(x)" ],
  transform: {
    "^.+\\.vue$": "vue-jest",
    "^.+\\js$": "babel-jest",
    "^.+\\.(t|j)sx?$": "ts-jest",
  },
};

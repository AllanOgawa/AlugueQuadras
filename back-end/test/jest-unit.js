module.exports = {
  moduleFileExtensions: ["js", "json", "ts"],
  rootDir: "..",
  testEnvironment: "node",
  testRegex: ".*\\.unit-tests\\.ts$",
  transform: {
    "^.+\\.(t|j)s$": "ts-jest"
  },
  moduleNameMapper: {
    "^@src/(.*)$": "<rootDir>/src/$1",
    "^@database/(.*)$": "<rootDir>/src/database/$1",
    "^@domains/(.*)$": "<rootDir>/src/domains/$1"
  }
};

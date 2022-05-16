module.exports = {
  setupFiles: ["<rootDir>/jest.setup.js"],
  testMatch: [
    "<rootDir>/src/**/__tests__/**/*.{js,jsx,mjs}",
    "<rootDir>/src/**/?(*.)(spec|test).{js,jsx,mjs}",
  ],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "<rootDir>/__mocks__/fileMock.js",
    "\\.(css|less)$": "<rootDir>/__mocks__/styleMock.js",
    "^@utilities(.*)$": "<rootDir>/src/utilities$1",
    server: "<rootDir>/__mocks__/styleMock.js",
    core: "<rootDir>/__mocks__/styleMock.js",
  },
  globals: {},
  testEnvironment: "jsdom",
  snapshotSerializers: ["enzyme-to-json/serializer"],
};

module.exports = {
    testEnvironment: "jsdom",
    setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"],
    transform: {
        "^.+\\.(js|jsx)$": "babel-jest"
    },
    moduleFileExtensions: ["js", "jsx"],
    transformIgnorePatterns: [
        "/node_modules/"
    ]
};

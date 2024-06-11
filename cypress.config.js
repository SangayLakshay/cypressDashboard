const { defineConfig } = require('cypress')

module.exports = defineConfig({
  projectId: 'q8wkgq',
  fileServerFolder: ".",
  fixturesFolder: "./cypress/fixtures",
  modifyObstructiveCode: false,
  video: false,
  chromeWebSecurity: false,
  viewportHeight: 1080,
  viewportWidth: 1920,
  watchForFileChanges: false,
  downloadsFolder: "download",
  defaultCommandTimeout: 20000,

  e2e: {
    baseUrl: 'https://example.cypress.io',
  },
});
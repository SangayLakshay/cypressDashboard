
export const baseConfig = {
  projectId: 'yyh18j',
  fileServerFolder: ".",
  fixturesFolder: "./cypress/fixtures",
  modifyObstructiveCode: false,
  video: false,
  videosFolder: "../../dist/cypress/apps/tg-e2e/videos",
  screenshotsFolder: "../../dist/cypress/apps/tg-e2e/screenshots",
  chromeWebSecurity: false,
  viewportHeight: 1080,
  viewportWidth: 1920,
  watchForFileChanges: false,
  downloadsFolder: "download",
  defaultCommandTimeout: 20000,

  e2e: {
    experimentalStudio: true,
    setupNodeEvents(on, config) {
      // event
    },
    specPattern: "./cypress/*.{js,jsx,ts,tsx}",
    supportFile: "./cypress/support/e2e.ts",
  },

  component: {
    specPattern: "**/*.cy.ts",
  },
};

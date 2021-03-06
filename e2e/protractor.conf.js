// @ts-check
// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const {SpecReporter} = require("jasmine-spec-reporter");

/**
 * @type { import("protractor").Config }
 */
exports.config = {
  allScriptsTimeout: 11000,
  specs: [
    "./src/**/*.e2e-spec.ts",
  ],
  capabilities: {
    chromeOptions: {
      args: [
        // '--headless',
        '--no-sandbox',
        '--disable-gpu',
        '--disable-dev-shm-usage'
      ]
    },
    browserName: "chrome",
  },
  chromeDriver: '../node_modules/protractor/node_modules/webdriver-manager/selenium/chromedriver_87.0.4280.141', // make sure to unzip if local
  directConnect: true,
  baseUrl: "https://localhost:4200",
  framework: "jasmine",
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000,
    print: function () {
    },
  },
  onPrepare() {
    require("ts-node").register({
      project: require("path").join(__dirname, "./tsconfig.json"),
    });
    jasmine.getEnv().addReporter(new SpecReporter({spec: {displayStacktrace: true}}));
  },
};

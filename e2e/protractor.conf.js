// @ts-check
// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const { SpecReporter } = require("jasmine-spec-reporter");

/**
 * @type { import("protractor").Config }
 */
exports.config = {
  allScriptsTimeout: 11000,
  specs: [
    "./src/**/*.e2e-spec.ts",
  ],
  capabilities: {
    acceptInsecureCerts: true,
    chromeOptions: {
      args: [
        // '--headless',
        '--no-sandbox ',
        '--disable-gpu',
        '--disable-dev-shm-usage',
        "--allow-insecure-localhost"
      ]
    },
    chromeDriver: "./node_modules/protractor/node_modules/webdriver-manager/selenium/chromedriver_96.0.4664.45",
    browserName: "chrome",
  },
  directConnect: true,
  baseUrl: "http://localhost:4200",
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
    jasmine.getEnv().addReporter(new SpecReporter({ spec: { displayStacktrace: true } }));
  },
};

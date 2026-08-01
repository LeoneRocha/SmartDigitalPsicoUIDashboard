// Karma configuration file, see link for more information
// https://karma-runner.github.io/0.13/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-coverage'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-junit-reporter'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      clearContext: false
    },
    files: [],
    preprocessors: {},
    mime: {
      'text/x-typescript': ['ts', 'tsx']
    },
    coverageReporter: {
      type: 'html',
      dir: 'coverage/',
      subdir: '.',
      includeAllSources: true
    },
    junitReporter: {
      outputDir: require('path').join(__dirname, 'coverage'),
      outputFile: 'test-results.xml',
      useBrowserName: false
    },
    reporters: config.angularCli && config.angularCli.codeCoverage
      ? ['progress', 'coverage', 'junit']
      : ['progress', 'kjhtml', 'coverage', 'junit'],
    port: 9877,
    colors: true,
    logLevel: config.LOG_WARN,
    autoWatch: false,
    singleRun: true,
    browsers: ['ChromeHeadless'],
    concurrency: 4,
    browserNoActivityTimeout: 60000
  });
};

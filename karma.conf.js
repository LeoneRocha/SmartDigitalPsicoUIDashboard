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
      require('karma-coverage-istanbul-reporter'),
      require('karma-junit-reporter'), // Adicione este plugin
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    files: [ 
    ],
    preprocessors: { 
    },
    mime: {
      'text/x-typescript': ['ts', 'tsx']
    },
    coverageReporter: {
      type: 'html',
      dir: 'coverage/',
      subdir: '.',
      includeAllSources: true
    },
    coverageIstanbulReporter: {
      dir: require('path').join(__dirname, 'coverage'),
      reports: ['html', 'lcovonly'],
      fixWebpackSourcePaths: true
    },
    junitReporter: { // Configuração do JUnit Reporter
      outputDir: require('path').join(__dirname, 'coverage'), // Diretório de saída
      outputFile: 'test-results.xml', // Nome do arquivo de saída
      useBrowserName: false // Não incluir o nome do navegador no arquivo
    },
    angularCli: {
      environment: 'dev'
    },
    reporters: config.angularCli && config.angularCli.codeCoverage
      ? ['progress', 'coverage-istanbul', 'coverage', 'junit']
      : ['progress', 'kjhtml', 'coverage-istanbul', 'coverage', 'junit'],// Adicione 'junit' aos repórteres
    port: 9877, // Porta alterada
    colors: true,
    logLevel: config.LOG_WARN,
    autoWatch: false, // Desativar autoWatch true to local 
    singleRun: true, // Executar apenas uma vez false to local 
    browsers: ['ChromeHeadless'],// Chrome to local 
    concurrency: 4, // Ajuste de concurrency
    browserNoActivityTimeout: 60000 // Ajuste de timeout
  });
};

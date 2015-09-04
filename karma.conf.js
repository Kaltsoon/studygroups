// Karma configuration
// Generated on Fri Sep 04 2015 11:50:56 GMT+0300 (EEST)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],

    plugins: [
      'karma-chrome-launcher',
      'karma-jasmine'
    ],


    // list of files / patterns to load in the browser
    files: [
      'public/components/jquery/dist/jquery.min.js',
      'public/components/moment/min/moment.min.js',
      'public/components/showdown/src/showdown.js',
      'public/components/bootstrap/dist/js/bootstrap.min.js',
      'public/components/angular/angular.min.js',
      'public/components/angular-sanitize/angular-sanitize.min.js',
      'public/components/angular-route/angular-route.min.js',
      'public/components/angular-moment/angular-moment.min.js',
      'public/components/angular-gravatar/build/angular-gravatar.min.js',
      'public/components/angular-markdown-directive/markdown.js',
      'public/components/lodash/lodash.min.js',
      'public/dist/app.min.js',
      'tests/front/*.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  })
}

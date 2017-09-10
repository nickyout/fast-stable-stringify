// Karma configuration
// Generated on Sun Sep 03 2017 04:55:32 GMT+0200 (CEST)

module.exports = function(config) {

  var customLaunchers = {
    sl_safari: {
      base: "SauceLabs",
      browserName: "safari",
      version: '5',
      idleTimeout: 180
    }
  };

  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['benchmark'],


    // list of files / patterns to load in the browser
    files: [
			'test/index.js'
    ],


    // list of files to exclude
    exclude: [
    ],

		client: {
			captureConsole: true,
			logLevel: config.LOG_LOG,
			mocha: {
				ui: 'tdd'
			}
		},

		browserConsoleLogOptions: {
			level: 'log',
			format: '%b %T: %m',
			terminal: true
		},


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'test/index.js': ['webpack']
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['benchmark'],
    
    benchmarkReporter: {
			destDir: 'results',
			exclude: ['native'],
			resolveName: function(libName) {
				var libInfo = require('./util/get-lib-info')(libName);
				return libInfo.name + '@' + libInfo.version;
			},
            logStyle: 'benchmark'
    },

    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    //customLaunchers: customLaunchers,
    //browsers: Object.keys(customLaunchers),
		browsers: ['Chrome'],

		browserNoActivityTimeout: 60000,

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
};

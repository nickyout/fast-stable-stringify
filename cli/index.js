var argv = require('minimist')(process.argv.slice(2), { '--': true });
var path = require('path');
var rootDir = path.resolve(__dirname, '..');
var split = require('split');

function readLog() {
	var logToSummary = require('./log-to-summary');
	var SummaryReader = require('./summary-reader');
	var reader = new SummaryReader({
		'benchmark-stats': require('./processor/stats'),
		'benchmark-relative': require('./processor/relative')
	}, rootDir);

	process.stdin
		.pipe(split())
		.pipe(logToSummary)
		.pipe(reader);
}

function compareResults(files, callback) {
	var fs;
	var filesToTable = require('./compare-results');
	var tableOptions = { hideColumns: ['JSON.stringify@native'] };
	var resultsDir;
	if (files.length) {
		filesToTable(files, tableOptions, callback);
	} else {
		fs = require('fs');
		resultsDir = path.resolve(rootDir, 'result');
		fs.readdir(resultsDir, function(err, dirFiles) {
			var actualFiles = dirFiles
				.map(function(file) {
					return path.resolve(resultsDir, file);
				});
			filesToTable(actualFiles, tableOptions, callback);
		});
	}
}

switch (argv._[0]) {
	case "read":
		readLog();
		break;
	case "table":
		compareResults(argv['--'], function(str) {
			console.log(str);
		});
		break;
	default:
		console.log('Usage: node cli [read|table]');
}
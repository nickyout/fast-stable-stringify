var argv = require('minimist')(process.argv.slice(2), { '--': true });
var path = require('path');
var rootDir = path.resolve(__dirname, '..');
var split = require('split');

function readLog() {
	var readline = require('readline');
	var rl = readline.createInterface(process.stdin, null, null, false);
	var logToSummary = require('./log-to-summary');
	var SummaryReader = require('./summary-reader');
	var reader = new SummaryReader({
		'json-benchmark-v1': require('./processor/json-benchmark-v1'),
		'json-benchmark-v2': require('./processor/json-benchmark-v2')
	}, rootDir);

	process.stdin
		.pipe(split())
		.pipe(logToSummary)
		.pipe(reader);
}

function compareResults() {
	var fs = require('fs');
	var table = require('./compare-results');
	fs.readdir('result', function(err, files) {
		var actualFiles = files
			//.filter(function(filename) { return filename !== 'JSON.stringify-native.json' })
			.map(function(file) { return './result/' + file; });
		console.log(actualFiles);
		table(actualFiles, function(str) {
			console.log(str);
		})
	});
}

switch (argv._[0]) {
	case "read": readLog();
		break;
	case "table": compareResults(); break;
	default:
		console.log('Usage: node cli [read|table]');
}
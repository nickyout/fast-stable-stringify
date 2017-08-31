var argv = require('minimist')(process.argv.slice(2), { '--': true });

function readLog() {
	var logToSummary = require('./log-to-summary');
	var SummaryReader = require('./summary-reader');
	var reader = new SummaryReader({
		// I'm fairly certain I will come up with another fancy format in a year.
		// I suspect this is pluggable enough for that moment
		'json-benchmark-v1': require('./processor/json-benchmark-v1')
	});
	process.stdin
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
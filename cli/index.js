var argv = require('minimist')(process.argv.slice(2));
var path = require('path');
var split = require('split');
var EnumBenchmarkType = require('../benchmark-log/enum');
var formatTable = require('./format-table');
var glob = require('glob');

function readLog(destDir) {
	var logToSummary = require('./log-to-summary');
	var SummaryReader = require('./summary-reader');
	var processors = {};
	processors[EnumBenchmarkType.STATS] = require('../benchmark-log/stats/text-to-file-processor');
	processors[EnumBenchmarkType.RELATIVE] = require('../benchmark-log/relative/text-to-file-processor');
	var reader = new SummaryReader(processors, destDir);

	process.stdin
		.pipe(split())
		.pipe(logToSummary)
		.pipe(reader);
}

function compareResults(files) {
	var FileComparer = require('./file-comparer');
	var processors = {};
	processors[EnumBenchmarkType.RELATIVE] = require('../benchmark-log/relative/file-compare');
	processors[EnumBenchmarkType.STATS] = require('../benchmark-log/stats/file-compare');
	var comparer = new FileComparer(processors);
	return comparer.compare(files);
}

switch (argv._[0]) {

	case "read":
		readLog(argv._[1] || path.resolve(process.cwd(), 'result'));
		break;

	case "table":
		var fileList = glob.sync(argv._.slice(1).join('|') || 'result/*.json', { nodir: true });
		compareResults(fileList)
			.then(function(comparisonResult) {
				return formatTable(comparisonResult, { hideColumns: ['JSON.stringify@native'] })
			})
			.then(function(str) {
				console.log(str);
			})
			.catch(function(err) {
				console.error(err);
			});
		break;
	default:
		console.log('Usage: node cli [read|table]');
}
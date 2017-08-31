var logToSummary = require('./log-to-summary');
var SummaryReader = require('./process-summary');

var reader = new SummaryReader({
	// I'm fairly certain I will come up with another fancy format in a year.
	// I suspect this is pluggable enough for that moment
	'json-benchmark-v1': require('./processor/json-benchmark-v1')
});

process.stdin
	.pipe(logToSummary)
	.pipe(reader);

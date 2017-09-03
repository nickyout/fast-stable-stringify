module.exports = function benchToStatsText(bench) {
	return JSON.stringify({
		name: bench.name,
		error: bench.error ? bench.error.message : '',
		hz: bench.hz,
		stats: bench.stats
	});
};
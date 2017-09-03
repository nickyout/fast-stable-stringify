module.exports = function benchToRelativeLog(bench, benchFastest) {
	return JSON.stringify({
		name: bench.name,
		error: bench.error ? bench.error.message : '',
		hz: bench.hz,
		fastest: benchFastest.compare(bench) === 0,
		rme: bench.stats.rme / 100,
		rhz: bench.hz / benchFastest.hz
	});
};
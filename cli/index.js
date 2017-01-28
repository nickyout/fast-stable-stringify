var api = {
	/**
	 * @param {string} logFilePath,
	 * @param {string} jsonDir,
	 * @param {string} gitRef (for tagging)
	 * @param {Function} callback
	 */
	'save': require('./save-log-results'),
	/**
	 * @param {string} filePath1
	 * @param {string} competitor1
	 * @param {string} filePath2
	 * @param {string} competitor2
	 * @param {Function} callback
	 */
	'compare': require('./create-comparison-table')
};
var args;

function cb(err, result) {
	if (err) {
		console.error('Error:', err);
	} else {
		console.log(result);
	}
}

args = process.argv.slice(2).concat(cb);
api[args[0]].apply(api, args.slice(1));
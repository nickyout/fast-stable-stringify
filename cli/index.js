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
	'compare': require('./create-comparison-table'),

    'help': function(cb) {
        cb(null, [
            'Usage: node cli save <logfilepath> <jsondir> <gitref>',
            '       node cli compare <filepath1> <competitor1> <filepath2> <competitor2>'
        ].join('\n'));
    }
};
var method;
var args;

function cb(err, result) {
	if (err) {
		console.error('Error:', err);
	} else {
		console.log(result);
	}
}

args = process.argv.slice(2);
method = args.shift();
if (!api.hasOwnProperty(method)) {
    method = 'help';
}
api[method].apply(api, args.concat(cb));

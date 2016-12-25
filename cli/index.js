var api = {
	'save': require('./save-log-results')
};
var args;

function cb(err, result) {
	if (err) {
		console.log('Error:', err);
	} else {
		console.log('Done:', result);
	}
}

args = process.argv.slice(2).concat(cb);
api[args[0]].apply(api, args.slice(1));
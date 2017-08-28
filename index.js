var escape = require('./lib/escape');

module.exports = require('./lib');

// For backwards compatibility
module.exports.stringSearch = escape.regSearch;
module.exports.stringReplace = escape.regReplace;

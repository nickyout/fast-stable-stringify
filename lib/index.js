var stringify = require('./stringify');
var execImpl = stringify.execImpl;
var regImpl = stringify.regImpl;
var browser = require('detect-browser');

function getExpectedFastestImpl() {
	switch (browser && browser.name) {
		case "edge":
		case "ie":
		case "opera":
		case "ios":
			return regImpl;

		case "firefox":
		case "chrome":
		case "safari":
		case "android":
		default:
			return execImpl;
	}
}

module.exports = getExpectedFastestImpl();
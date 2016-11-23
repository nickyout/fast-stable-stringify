var assert = require('assert');
var getGitHash = require('../util/get-git-hash');

suite("getGitHash", function() {
	test("gets full hash", function(done) {
		getGitHash('0.1.0', function(err, hash) {
			assert.equal(hash, '0abdaf627f5f26c36ae64603b875193c5b59a7f2');
			done();
		});
	});
	test("barfs on error", function(done) {
		getGitHash('unknown tag', function(err, hash) {
			assert.ok(err instanceof Error);
			assert.equal(err.message, 'Expected exit code 0, got: 128');
			done();
		});
	});
});
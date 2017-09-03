var fs = require('fs-extra');

/**
 * @typedef {Object} DataSetComparisonResult
 * @prop {string} browser
 * @prop {string} os
 * @prop {Object<DataSetComparisonResultItem>} resultMap - key is libName
 */

/**
 *
 * @param {Object<Function>} processors
 * @constructor
 */
function FileComparer(processors) {
	this._processors = processors || {};
}

/**
 *
 * @param {string[]} files
 * @returns {Promise<DataSetComparisonResult[]>}
 */
FileComparer.prototype.compare = function(files) {
	var processors = this._processors;
	return Promise
		.all(files.map(function(file) {
			return fs.readJson(file);
		}))
		.then(function (arrFileObj) {
			var i;
			var allResults = [];
			var benchmarkType;
			var arrFileObjSubset;

			for (benchmarkType in processors) {
				arrFileObjSubset = arrFileObj.filter(function(fileObj) {
					return fileObj._metaData && fileObj._metaData.type === benchmarkType;
				});
				allResults = allResults.concat(processors[benchmarkType](arrFileObjSubset));
			}

			return allResults;
		});
};

module.exports = FileComparer;
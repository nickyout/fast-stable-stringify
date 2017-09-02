var fs = require('fs-extra');
var table = require('markdown-table');
var benchStatsToComparisonResult = require('./comparer/stats');
var benchRelativeToComparisonResult = require('./comparer/relative');

/**
 * @typedef {Object} DataSetComparisonResult
 * @prop {string} browser
 * @prop {string} os
 * @prop {Object<DataSetComparisonResultItem>} resultMap - key is libName
 */

/**
 *
 * @param {string[]} files
 * @returns {Promise<DataSetComparisonResult[]>}
 */
function compareResults(files) {
	return Promise
		.all(files.map(function(file) {
			return fs.readJson(file);
		}))
		.then(function (arrFileObj) {
			var i;
			var allResults = [];
			var results;

			// default
			results = benchStatsToComparisonResult(arrFileObj.filter(function(fileObj) {
				return !fileObj._metaData || fileObj._metaData.type === 'benchmark-stats';
			}));

			allResults = allResults.concat(results);

			// relative
			results = benchRelativeToComparisonResult(arrFileObj.filter(function(fileObj) {
				return fileObj._metaData && fileObj._metaData.type === 'benchmark-relative';
			}));

			allResults = allResults.concat(results);

			return allResults;
		});
}

// Crude, but should be enough internally
function toFixedWidth(value, maxChars) {
	var result = value.toFixed(2).substr(0, maxChars);
	if (result[result.length - 1] == '.') {
		result = result.substr(0, result.length - 2) + ' ';
	}
	return result;
}

/**
 *
 * @param {DataSetComparisonResult[]} results
 * @param {Object} [options]
 */
function createTable(results, options) {
	options || (options = {});
	var columnAlign = ['l', 'l'];
	var header = ['Browser', 'OS' ];
	var libNames = [];
	var rows = [];
	var errorCell = 'X';
	var emptyCell = '?';
	var hideColumns = options.hideColumns || [];
	results.forEach(function(comparisonResult) {
		var resultMap = comparisonResult.resultMap;
		var libName;
		var libResults;
		var result;
		for (libName in resultMap) {
			// dictates order
			if (libNames.indexOf(libName) === -1 && hideColumns.indexOf(libName) === -1) {
				libNames.push(libName);
				columnAlign.push('r');
				rows.forEach(function(row) {
					// new column added, push empty element
					row.push(emptyCell);
				})
			}
		}
		libResults = libNames.map(function(libName) {
			result = resultMap[libName];
			if (result) {
				if (result.succeeded) {
					return (result.fastest ? '*' : '')
						+ (100 * result.rhz).toFixed(2) + '% '
						+ '(\xb1' + toFixedWidth(100 * result.rhz * result.rme, 4) + '%)';
				} else {
					return errorCell;
				}
			} else {
				return emptyCell;
			}
		});

		rows.push([comparisonResult.browser, comparisonResult.os].concat(libResults));
	});

	// slap header before it
	rows.unshift(header.concat(libNames));

	return table(rows, { align: columnAlign });
}

module.exports = function(files, options, callback) {
	compareResults(files)
		.then(function(data) {
			return createTable(data, options);
		})
		.then(callback);
};
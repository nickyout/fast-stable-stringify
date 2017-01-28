var getPath = require('./get-path');
var sprintf = require('tiny-sprintf/dist/sprintf.all');
var strHeader = '%-42.42s%|%-30.30s|%-30.30s|%-11.11s';
var strRow = '%-42.42s%|%22.22s ops/sec|%22.22s ops/sec|%+9.9d%';
var dashline = '-----------------------------------------------';

function keysShared(obj1, obj2) {
	return Object.keys(obj1).filter(function(key) {
		return obj2.hasOwnProperty(key);
	});
}

function compareDataPoints(data1, data2) {
	var value1 = data1.opsPerSec;
	var value2 = data2.opsPerSec;
	var diff = parseInt(((value1 / value2) - 1) * 100);
	return {
		header: null,
		value1: value1,
		value2: value2,
		diff: diff
	}
}

/**
 * Draws a single row of a table using a single data object.
 * @param {Object} rowData
 * @returns {string}
 */
function drawRow(str, rowData) {
    var val1 = typeof rowData.value1 == "number" ? rowData.value1.toFixed(3) : rowData.value1;
    var val2 = typeof rowData.value2 == "number" ? rowData.value2.toFixed(3) : rowData.value2;
	return sprintf(str, rowData.header, val1, val2, rowData.diff);
}

function compareCompetitors(competitor1, competitor2) {
	var results = [];
	keysShared(competitor1, competitor2).forEach(function(browserName) {
		keysShared(competitor1[browserName], competitor2[browserName]).forEach(function(osName) {
			// same or it is not valid
			var result = compareDataPoints(
				getPath(competitor1, [browserName, osName]),
				getPath(competitor2, [browserName, osName])
			);
			result.header = browserName + ' @ ' + osName;
			results.push(result);
		});
	});
	return results;
}

/**
 *
 * @param {Object} collection
 * @param {string[]} competitorPath1
 * @param {string[]} competitorPath2
 * @returns {string}
 */
function jsonToTable(collection, competitorPath1, competitorPath2) {
	var tableRows = [];
	var i;
	for (i = 0; i < competitorPath1.length; i++) {
		tableRows.push(drawRow(strHeader, {
			header: '',
			value1: competitorPath1[i],
			value2: competitorPath2[i],
			diff: i == competitorPath1.length - 1 ? 'faster' : ''
		}));
	}
	tableRows.push(drawRow(strHeader, {
		header: dashline,
		value1: dashline,
		value2: dashline,
		diff: dashline
	}));
	var results = compareCompetitors(
		getPath(collection, competitorPath1),
		getPath(collection, competitorPath2)
	);
	results.forEach(function(rowData) {
		tableRows.push(drawRow(strRow, rowData));
	});
	return tableRows.join('\n');
}

module.exports = jsonToTable;

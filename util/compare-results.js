var fs = require('fs-extra');
var Benchmark = require('benchmark');
var table = require('markdown-table');

/**
 * @typedef {Object} GroupedJSONBenchmarkObject
 * @prop {string} browser
 * @prop {string} os
 * @prop {JSONBenchmarkObject[]} dataSets
 */

/**
 * @typedef {Object} DataSetComparisonResult
 * @prop {string} browser
 * @prop {string} os
 * @prop {Object<DataSetComparisonResultItem>} resultMap - key is libName
 */

/**
 * @typedef {Object} DataSetComparisonResultItem
 * @prop {number} hz
 * @prop {number} rme
 * @prop {number} rhz
 * @prop {boolean} fastest
 */

function getKeyMapUnion(arrObjects) {
	var mapKeyToDataSets = {};
	arrObjects.forEach(function(el) {
		Object.keys(el).forEach(function(key) {
			if (!mapKeyToDataSets[key]) {
				mapKeyToDataSets[key] = [];
			}
			mapKeyToDataSets[key].push(el[key]);
		});
	});
	return mapKeyToDataSets;
}

/**
 *
 * @param {JSONBenchmarkObject[]} jsonBenchObjects
 * @returns {GroupedJSONBenchmarkObject[]}
 */
function groupDataSetsByBrowserAndOS(jsonBenchObjects) {
	var browserMap = getKeyMapUnion(jsonBenchObjects);
	var browser;
	var osMap;
	var os;
	var result = [];
	for (browser in browserMap) {
		if (browserMap[browser].length > 1) {
			// something to compare
			osMap = getKeyMapUnion(browserMap[browser]);
			for (os in osMap) {
				if (osMap[os].length > 1) {
					result.push({ browser: browser, os: os, dataSets: osMap[os] });
				}
			}
		}
	}
	return result;
}

function sortFastest(jsonA, jsonB) {
	return (jsonA.stats.mean + jsonA.stats.moe > jsonB.stats.mean + jsonB.stats.moe ? 1 : -1);
}

/**
 *
 * @param {GroupedJSONBenchmarkObject} dataSetGroup
 * @returns {DataSetComparisonResult}
 */
function createDataSetComparisonResult(dataSetGroup) {

	var browser = dataSetGroup.browser;
	var os = dataSetGroup.os;
	var dataSets = dataSetGroup.dataSets;
	var dataSetFastest;
	var resultMap = {};

	dataSets.sort(sortFastest);
	dataSetFastest = dataSets[0];

	dataSets.forEach(function(el) {
		resultMap[getLibName(el)] = {
			hz: el.hz,
			rme: el.stats.rme,
			fastest: Benchmark.prototype.compare.call(dataSetFastest, el) === 0,
			rhz: el.hz / dataSetFastest.hz
		};
	});

	return {
		browser: browser,
		os: os,
		resultMap: resultMap
	};
}

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
		.then(function (fileContents) {
			return groupDataSetsByBrowserAndOS(fileContents)
				.map(createDataSetComparisonResult);
		});
}

/**
 *
 * @param {DataSetComparisonResult[]} results
 */
function createTable(results) {
	var columnAlign = ['l', 'l'];
	var header = ['Browser', 'OS' ];
	var libNames = [];
	var rows = [];
	var emptyCell = '';
	results.forEach(function(comparisonResult) {
		var resultMap = comparisonResult.resultMap;
		var libName;
		var libResults;
		var result;
		for (libName in resultMap) {
			// dictates order
			if (libNames.indexOf(libName) == -1) {
				libNames.push(libName);
				columnAlign.push('r');
				rows.forEach(function(row) {
					// new column added,push empty element
					row.push(emptyCell);
				})
			}
		}
		libResults = libNames.map(function(libName) {
			result = resultMap[libName];
			if (result) {
				return (result.fastest ? '*' : '') + Math.round(100 * result.rhz) + '%';
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

function getLibName(el) {
	return el.name + '@' + el.version;
}


fs.readdir('result', function(err, files) {
	compareResults(files.map(function(file) { return './result/' + file; }))
		.then(createTable)
		.then(function(str) {
			console.log(str);
		});
});
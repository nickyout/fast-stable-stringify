var fs = require('fs');
var path = require('path');
var jsonToTable = require('../util/json-to-table');

//var superCollection  = {};

function compareCollections(filePath1, competitor1, filePath2, competitor2, callback) {
	var collection1 = JSON.parse(fs.readFileSync(filePath1, 'utf-8'));
	var collection2 = JSON.parse(fs.readFileSync(filePath2, 'utf-8'));
	var superCollection = {};
	var fileName1 = path.basename(filePath1);
	var fileName2 = path.basename(filePath2);
	superCollection[fileName1] = collection1;
	superCollection[fileName2] = collection2;
	callback(null, jsonToTable(superCollection,  [fileName1, competitor1], [fileName2, competitor2]));
}

module.exports = compareCollections;
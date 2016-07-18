var sprintf = require('tiny-sprintf');
var str = '%-27.27s|%-30.30s|%-30.30s|%-11.11s';
var dashline = '-----------------------------------------------';
var regHeader = /<(.+?) on (.+?)> console/;
var regBench = /Finished benchmarking: (.+?) x (.+?) ops\/sec/
var strNickyout = 'nickyout/fast-stable-stringify';
var strSubstack = 'substack/json-stable-stringify';
/*
<internet explorer 10 on Windows 2012> console
Finished benchmarking: nickyout/fast-stable-stringify x 7,407 ops/sec ±2.33% (59 runs sampled) (cumulative string length: 111485154)
Finished benchmarking: substack/json-stable-stringify x 3,321 ops/sec ±3.54% (56 runs sampled) (cumulative string length: 48916252)
 */
/* 
Benchmark commit e0176c7	|nickyout/fast-stable-stringify	|substack/json-stable-stringify	|last time*	|fastest*
----------------------------|-------------------------------|-------------------------------|-----------|----------
chrome 26 on Windows 10		| x 2,848 ops/sec				| x 2,277 ops/sec				|+47%		|+25%
*/

/**
 * Common object format for printing a single row
 * @typedef {Object} RowData
 * @prop {string} header
 * @prop {string} nickyout
 * @prop {string} substack
 * @prop {string} fastest
 */

/**
 * Something ike '3,456' becomes 3.456
 * @param {string} opsPerSec 
 * @returns {number}
 */
function toNumber(opsPerSec) {
    return parseFloat(opsPerSec.replace(',', '.'));
}
/**
 * @returns {RowData} 
 */
function createNewData() {
    return {
        state: 0,
        header: '', 
        nickyout: '',
        substack: '',
        fastest: ''
    }
}
/**
 * Reads the log. Extracts the info it wants. 
 * @param {string} text - contents of a text file
 * @returns {Array<RowData>}
 */
function interpretFileContents(text) {
    var textLines = text.split('\n');
    var textLine;
    var i;
    var match;
    var data = createNewData();
    var dataList = [];
    for (i = 0; i < textLines.length; i++) {
        textLine = textLines[i];
        // is header?
        match = textLine.match(regHeader);
        if (match) {
            // new header, start anew
            data.header = match[1] + ' on ' + match[2];
            data.label = match[1];
            data.state = 1;
        } else {
            match = textLine.match(regBench);
            if (match) {
                if (match[1] === strNickyout) {
                    data.nickyout = match[2];
                    data.state |= 2;
                } else {
                    data.substack = match[2];
                    data.state |= 4;
                }
            }
        }
        if (data.state === 7) {
            data.fastest = parseInt(((toNumber(data.nickyout) / toNumber(data.substack)) - 1) * 100) + '%';
            data.nickyout = ' x ' + data.nickyout + ' ops/sec';
            data.substack = ' x ' + data.substack + ' ops/sec';
            dataList.push(data);
            data = createNewData();
        }
    }

    dataList.sort(function(a, b) {
        var lblA = a.label;
        var lblB = b.label;
        var len = Math.min(lblA.length, lblB.length);
        for (i = 0; i < len; i++) {
            if (lblA[i] !== lblB[i]) {
                return lblA[i] < lblB[i] ? 1 : -1;
            }
        }
        return lblA.length < lblB.length ? 1 : -1;
    });
    return dataList;
}

/**
 * Draws a single row of a table using a single data object.
 * @param {RowData} rowData
 * @returns {string} 
 */
function drawRow(rowData) {
    return sprintf(str, rowData.header, rowData.nickyout, rowData.substack, rowData.fastest);
}

/**
 * Draws a table
 * @param {string} commitID
 * @param {Array<RowData>} dataList
 * @returns {string} formatted string
 */
function drawTable(dataList, commitID) {
    var lines = [drawRow({
        header: 'Benchmark commit ' + commitID,
        nickyout: 'nickyout/fast-stable-stringify',
        substack: 'substack/json-stable-stringify',
        lastTime: 'last time*',
        fastest: 'fastest*'
    }), drawRow({
        header: dashline,
        nickyout: dashline,
        substack: dashline,
        fastest: dashline
    })];
    dataList.forEach(function(testData) {
        lines.push(drawRow(testData));
    });
    return lines.join('\n');
}

module.exports = function logFileToTable(logFileContents, commitID) {
    var dataList = interpretFileContents(logFileContents);
    return drawTable(dataList, commitID);
}

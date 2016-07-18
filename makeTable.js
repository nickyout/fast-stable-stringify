var fs = require('fs');
var logToTable = require('./util/log-to-table.js');
var logFilePath = 'table.txt';
var commitID = 'abc';
if (process.argv.length >= 4) {
    logFilePath = process.argv[2];
    commitID = process.argv[3];
    console.log(logToTable(fs.readFileSync(logFilePath, 'utf-8'), commitID));
} else {
    console.log('Usage: ' + process.argv.slice(0,2).join(' ') + ' <logFile> <commitID>');
}

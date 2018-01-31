/**
 * Simple file logger
 *
 * @author Olaf Janssen <o.t.a.janssen@gmail.com>
 */

var fs = require('fs');

var Logger = function (path) {

    var date = new Date();
    var logFile = fs.createWriteStream(path + '/log-' + date.getFullYear() + '-' + date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getHours() + '-' + date.getMinutes() + '.txt', {flags: 'a'});


    function log(row) {
        var output = JSON.stringify(row);
        console.log('Logging: ' + output);
        logFile.write(output + '\n');
    }

    return {
        log: log
    };
};


module.exports = Logger;
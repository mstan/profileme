var mysql = require('mysql');

var dbConnection = null;

var SQLExports = {};

SQLExports.connectMySQL = function(params,cb) {
    var pool = mysql.createPool(params);
    pool.getConnection(function(err,connection){
        if(err) {
            cb(err,null);
        } else {
            dbConnection = connection;
            cb(null,true);
        }
    });
}

SQLExports.returnConnection = function() {
    return dbConnection;
}

SQLExports.heartbeat = function() {
    var heartbeatInterval = 4 * 60 * 60 * 1000; //4 hours * 60 min * 60 sec * 1000 ms

    setInterval(function() {
        dbConnection.query('SELECT CURTIME() AS Time', (err,response) => {
            var currentTime = response[0].Time;

            console.log(`MySQL still alive at ${currentTime}`)
        }); 
    }, heartbeatInterval);


}

module.exports = SQLExports;
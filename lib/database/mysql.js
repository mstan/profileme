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

module.exports = SQLExports;
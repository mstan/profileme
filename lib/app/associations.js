var mysql = require('mysql');
var dbConnection = require('../database/mysql.js').returnConnection;

var associationExports = {};

/*
    Function to query SQL to return all existing associations
*/
associationExports.getAll = function(params,cb) {
    var query = 
        `SELECT * 
         FROM Associations`;

        dbConnection().query(query,(err,response) => {
            if(err) {
                cb(err,null);
            } else {
                cb(null,response);
            }
        });
}

/*
    get a single association
*/
associationExports.getAssociation = function(params,cb) {
    var association = params.association;

    var query =
        `SELECT * 
         FROM Associations 
         WHERE Name = ?`;
    var queryparams = [association];
        query = mysql.format(query,queryparams);

        dbConnection().query(query,(err,response) => {
            if(err) {
                cb(err,null);
            } else if(response.length == 0) {
                cb({"Error": "Association not found"},null);
            } else {
                cb(null,response[0]);
            }
        })
}

module.exports = associationExports;
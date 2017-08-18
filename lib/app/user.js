var mysql = require('mysql');

var dbConnection = require('../database/mysql.js').returnConnection;

var userExports = {};

/*
    Return a single user
*/  
var getUser = function(params,cb) {
    var userID = params.UserID;

    var query = 
        `SELECT DisplayName,DateCreated 
         FROM Users 
         WHERE UserID = ?`;
    var queryparams = [userID];
        query = mysql.format(query,queryparams);

        dbConnection().query(query,(err,response) => {
            if(err) {
                cb(err,null);
            } else if(response.length == 0) {
                cb({"Error": "User not found"});
            } else {
                cb(null,response[0]);
            }
        });
}

/*
    Return single user's associations
*/
var getUserAssociations = function(params,cb) {
    var userID = params.UserID;

    var query = 
        `SELECT * 
         FROM UserAssociations
         WHERE UserID = ?`;
    var queryparams = [userID];
        query = mysql.format(query,queryparams);

        dbConnection().query(query,(err,response) => {
            if(err) {
                cb(err,null); 
            } else {
                cb(null,response);
            }
        })
}

/*
    Return a user's "profile".
    At the moment, this is a user's profile, and their associations

    We want both of these things, but don't care in what order we get them.

    Therefore, we use a Promise.all([]) which waits until all are promised, but runs them
    asychronously
*/  
userExports.getUserProfile = function(params,cb) {
    var responseObj = {
        User: null,
        Associations: [] 
    }

    Promise.all([
        new Promise((resolve,reject) => {
            getUser(params,(err,response) => {
                if(err) {
                    reject(err);
                } else { 
                    responseObj.User = response;
                    resolve();
                }
            })
        }),
        new Promise((resolve,reject) => { 
            getUserAssociations(params,(err,response) => {
                if(err) {
                    reject(err);
                } else {
                    responseObj.Associations = response;
                    resolve();
                }
            })
        })
    ])
    .then(() => {
        cb(null,responseObj);
    })
    .catch((err) => {
        cb(err,null);
    })
}

userExports.removeAssociation = function(params,cb) {
    var association = params.association;
    var userID = params.userID;

    var query =
        `DELETE 
         FROM UserAssociations 
         WHERE UserID = ? AND Client = ?`;
    var queryparams =[userID,association];
        query = mysql.format(query,queryparams);

        dbConnection().query(query,(err,response) => {
            if(err) {
                cb(err,null);
            } else {
                cb(null,response);
            }
        });
}

module.exports = userExports;
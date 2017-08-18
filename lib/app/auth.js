var mysql = require('mysql');
var dbConnection = require('../database/mysql.js').returnConnection;

var authExports = {};


authExports.register = function(params,cb) {
    var displayName = params.DisplayName;
    var email = params.Email;
    var password = params.Password;

    /*
        BEGIN PROMISE CHAIN.

        Email exists?
    */
    new Promise((resolve,reject) => {
        var query = 
            `SELECT UserID 
             FROM Users WHERE Email = ?`;
        var queryparams = [email];
            query = mysql.format(query,queryparams);

            dbConnection().query(query,(err,response) => {
                if(err) {
                    reject(err);
                } else if(response.length > 0) {
                    reject({Error: "Email already exists"});
                } else {
                    resolve();
                }
            });
    })
    /* 
        Email doesn't exist. Register user

        /!\ For this demonstration we are storing the password in plain text. Needless to say, this is BAD!
            This is simply a demonstration, so security is not being taken into account.
    */
    .then(() => {
        return new Promise((resolve,reject) => {    
            var query =
                `INSERT INTO Users (DisplayName,Email,Password) 
                 VALUES(?,?,?)`;
            var queryparams = [displayName,email,password];
                query = mysql.format(query,queryparams);

                dbConnection().query(query,(err,response) => {
                    if(err) {
                        reject(err);
                    } else {
                        var userID = response.insertId;
                        resolve(userID);
                    }
                });
        });
    })
    .then((userID) => {
        var newUserURL = `/api/user/profile/${userID}`;

        cb(null,newUserURL);
    })
    .catch((err) => {
        console.log(err);

        err = err.toString();
        cb(err,null);
    })
}

authExports.storeNewAssociation = function(params,cb) {
    var localUserID = params.localUserID;
    var clientUniqueID = params.clientUniqueID;
    var clientUsername = params.clientUsername;
    var client = params.client;


    //Start by checking if existing relationship exists
    new Promise((resolve,reject) => {
        var query = `SELECT * FROM UserAssociations WHERE ClientUniqueID = ? AND Client = ?`;
        var queryparams = [clientUniqueID,client];
            query = mysql.format(query,queryparams);

            dbConnection().query(query,function(err,response) {
                if(err) {
                    reject(err);
                } else if(response.length > 0) {
                    reject({"Error": "Account already associated"})
                } else {
                    resolve();
                }
            });
    })
    .then(() => {
        return new Promise((resolve,reject) => {
            var query =
                `INSERT INTO UserAssociations (UserID,DisplayName,Client,ClientUniqueID)
                 VALUES (?,?,?,?)`;
            var queryparams = [localUserID,clientUsername,client,clientUniqueID];
                query = mysql.format(query,queryparams);

                dbConnection().query(query,function(err,response) {
                    if(err) {
                        cb(err,null);
                    } else {
                        cb(null,true);
                    }
                });
        })
    })
    .catch((err) => {
        cb(err,null);
    }); 
}




module.exports = authExports;
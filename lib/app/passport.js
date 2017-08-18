/*
    This file runs all the available passport strategies and loads them in when called on 
    server.js load
*/

var mysql = require('mysql');
var passport = require('passport');

var LocalStrategy = require('passport-local');
var TwitterStrategy = require('passport-twitter');
var GitHubStrategy = require('passport-github').Strategy;

var dbConnection = require('../database/mysql.js').returnConnection;
var config = require('../../config.js');


var passportExports = {}

passportExports.configurePassport = function() {
    //PASSPORT STRATEGIES

    //TWITTER
    passport.use(new TwitterStrategy(config.twitter,
      function(token, tokenSecret, profile, cb) {
        return cb(null,profile);
      }
    ));

    //GITHUB
    passport.use(new GitHubStrategy(config.github,
      function(accessToken, refreshToken, profile, cb) {
        return cb(null,profile);
      }
    ));

    //LOCAL
    passport.use(new LocalStrategy(function(username,password,cb) {
        var email = username;

        var query = 
            `SELECT * 
             FROM Users 
             WHERE Email = ?`;
        var params = [email],
            query = mysql.format(query,params);

        dbConnection().query(query, function(err,response) {
            if(response.length == 0) {
                return cb(null,false);
            } else if(password != response[0].Password) {
                return cb(null,false);
            } else {
                var user = response[0];
                var userCookie = {
                    UserID: user.UserID,
                    DisplayName: user.DisplayName,
                    Email: user.Email,
                    DateCreated: user.DateCreated
                }

                return cb(null,userCookie);
            }
        });
    }));

    /*
        USER SERIALIZATION FUNCTIONS
    */

    passport.serializeUser(function(user,cb) {
        cb(null, user);
    });

    passport.deserializeUser(function(user,cb) {
        cb(null,user);
    });  

} 

module.exports = passportExports;
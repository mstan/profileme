/*
    Project to use multiple APIs from differnet gaming sites.
    This API is going to make a user sign up with an account, then using OAUTH from
    various other sources, "connect" those accounts.
*/
/*
    DEPENDENCIES
*/
var mysql = require('mysql');
var dbConnection = require('./lib/database/mysql.js').returnConnection;
var dbHeartbeat = require('./lib/database/mysql.js').heartbeat;

var express = require('express');
var ejs = require('ejs');

var session = require('express-session');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

var passport = require('passport');

var config = require('./config.js');
var router = require('./router.js');

var database = require('./lib/database/mysql.js');
/*
    CONFIGURATION
*/
var app = express();
/*
    SERVER CONFIGURATION PROMISE CHAIN
*/
var startServer = () => {
    /*
        CONNECT DATABASE

        First thing's first, let's connect to our database source before we do anything else!
    */
    new Promise((resolve,reject) => {
        var params = config.mysql;

        database.connectMySQL(params,(err,response) => {
            if(err) {
                reject(err);
            } else {
                resolve();
                dbHeartbeat(); // function to run at set intervals to prevent db disconnect
            }
        });

    })
    /*
        Passport Time!
    */
    .then(() => {
        return new Promise((resolve) => {
            var configurePassport = require('./lib/app/passport.js').configurePassport;
            configurePassport();

            resolve();
        })
    })
    /*
        SET UP EXPRESS. 

        For example, set our view engine to ejs.
    */
    .then(() => {
        return new Promise((resolve,reject) => {
            app.use(cookieParser(config.cookieParserSecret));
            app.use(bodyParser.urlencoded({ extended: false }));
            app.set('view engine', 'ejs');
            //Experiencing a bug here when I externalize the secret token. Not sure why. Leaving as string for now. Normally this is a bad idea
            app.use(session({ secret: 'something_super_secret', resave: true, saveUninitialized: false }));

            /*
                PASSPORT
            */
            app.use(passport.initialize());
            app.use(passport.session()); 
            /*
                END PASSPORT
            */
            resolve();
        })
    })
    /*
        CONFIGURE DEVELOPER DEFINED MIDDLEWARE
    */
    .then(() => {
        return new Promise((resolve) => {
            //This is example middlware of something that would log the user object to console
            //should the user object exist

            /*
            app.use('/', (req,res,next) => {
                if(req.user) {
                    console.log(req.user);
                }
                next();
            });
            */
            resolve();

        })

    })
    /*
        TIME TO CONFIGURE ROUTING. BIND IT ALL HERE
    */
    .then(() => {
        return new Promise((resolve) => {
            app.use('/api', router); //API router
            /*
                This app was originally built to be an API only demo, but has since had
                added view routes to it to help with viewing the app for demonstration purposes

                As such, there have been some added view routes.

                If a user accesses our route at the base, redirect them to the login page 
                so they can log in
            */

            app.get('/', (req,res) => {
                res.redirect('/api/auth/login');
            })

            resolve();
        })
    })
    /*
        ALL DONE! TIME TO BIND IT TO LISTEN
    */
    .then(() => {
        return new Promise((resolve,reject) => {
            app.listen(config.port);
            console.log(`listening at part ${config.port}`);
            resolve();
        })
    })
    .catch(function(err) {
        console.log(`Oh no! Something went wrong! \n`, err);
    })
}

startServer(); //Fire it up!
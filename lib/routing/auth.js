var passport = require('passport');
var auth = require('../app/auth.js');
var middleware = require('../app/middleware.js');

module.exports = (router) => {    
    /*
        This is a GET route that serves a registration page. In a conventional API, this wouldn't exist.

        But for this demonstration, I have provided one so the user can have visual representation.

        and does not need a client such as POSTMAN to interact with this demo.
    */
    router.get('/register', (req,res) => {
        if(req.user) {
            res.redirect('/api/user/me');
        } else {
            res.render('pages/auth/register.ejs');
        }
    });

    router.post('/register', (req,res) => {
        var params = {
            Email: req.body.email,
            DisplayName: req.body.displayname,
            Password: req.body.password
        }

        auth.register(params,(err,response) => {
            if(err) {
                res.send(err);
            } else {
                res.redirect(response);
            }
        });
    });


    /*
        PASSPORT
    */
    //LOCAL

    /*
        This is a GET route that serves a login page. In a conventional API, this wouldn't exist.

        But for this demonstration, I have provided one so the user can have visual representation.

        and does not need a client such as POSTMAN to interact with this demo.
    */
    router.get('/login', (req,res) => {
        if(req.user) {
            res.redirect('/api/user/me');
        } else {
            res.render('pages/auth/login.ejs');
        }
    });

    // Passport has a particular syntax that breaks our conventions, hence the oddities here
    router.post('/login', passport.authenticate('local', 
        { 
          successRedirect: '/api/user/me',
          failureRedirect: '/api/auth/login'
        }
    ));

    //TWITTER
    /*
        While unconventional, we want our user to be authenticated (locally) before 
        trying to call this twitter auth request, since we want something for our user to 
        associate WITH. If the user isn't logged in locally, redirect them
    */
    router.get('/oauth/twitter', (req,res,next) => {
        if(req.user) {
            passport.authenticate('twitter')(req,res,next);
        } else {
            res.redirect('/api/login');
        }
    });
    /*
        This return request is important in how it is handled.

        For passport, we have to provide a custom callback here for passport rather than the conventional handling.

        This is because in a standard callback, passport tries to return us the user in req.user.

        But, we are not wanting to authenticate this as a user session, we just want user info for our current user

    */
    router.get('/oauth/twitter/return', (req,res,next) => {
        passport.authenticate('twitter', { session: false }, (err,user,info) => {
            var localUserID = req.user.UserID; //from our local user session
            var twitterUserID = user.id; //from the twitter API response
            var twitterUsername = user.username; //from the twitter API response

            var params = {
                localUserID: localUserID,
                clientUniqueID: twitterUserID,
                clientUsername: twitterUsername,
                client: 'Twitter'
            }

            auth.storeNewAssociation(params, (err,response) => {
                if(err) {
                    res.send(err);
                } else {
                    res.redirect('/api/user/me');
                }
            });

        })(req,res,next);
    });

    //Github
    router.get('/oauth/github', (req,res,next) => {
        if(req.user) {
            passport.authenticate('github')(req,res,next);
        } else {
            res.redirect('/api/login');
        }
    });
    /*
        This return request is important in how it is handled.

        For passport, we have to provide a custom callback here for passport rather than the conventional handling.

        This is because in a standard callback, passport tries to return us the user in req.user.

        But, we are not wanting to authenticate this as a user session, we just want user info for our current user

    */
    router.get('/oauth/github/return', (req,res,next) => {

        passport.authenticate('github', { session: false }, (err,user,info) => {
            var localUserID = req.user.UserID; //from our local user session
            var gitHubUserID = user.id; //from the github API
            var gitHubUsername = user.username; // from the github API

            var params = {
                localUserID: localUserID,
                clientUniqueID: gitHubUserID,
                clientUsername: gitHubUsername,
                client: 'Github'
            }

            auth.storeNewAssociation(params,(err,response) => {
                if(err) {
                    res.send(err);
                } else {
                    res.redirect('/api/user/me');
                }
            });
        })(req,res,next);
    });



    
    return router;
}
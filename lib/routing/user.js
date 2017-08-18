var passport = require('passport');
var user = require('../app/user.js');
var associations = require('../app/associations.js');

module.exports = (router) => {
    /*
        AUTH ONLY
    */
    //Me is a special route that redirects you to your own profile if you're logged in, else redirects you to login
    router.get('/me', (req,res) => {
        if(!req.user) {
            res.redirect('/api/auth/login');
        } else {
            res.redirect('/api/user/profile/view/' + req.user.UserID);
        }
    });


    /*
        This is a GET route that lists all associations a user can associate with their account. 

        For this demonstration, I have provided this as a view so the user can have visual representation.

        Normally, this would simply retrun the response from associations.getAll and be a JSON object.

        Instead, we bind the response for a view element here

        If the user isn't logged in, we send them to the login page
    */
    router.get('/addAssociations', (req,res) => {
        if(!req.user) {
            res.redirect('/api/auth/login');
        } else {
            associations.getAll({}, (err,response) => {
                res.locals.associations = response;
                res.render('pages/user/addAssociations.ejs');
            })
        }
    });

    /*
        This requires the user to be logged in. If they are not, redirect them

        This takes the association as a parameter from the URL, and removes all rows
        where the user ID matches the authenticated uesr for the association ID
    */

    router.get('/removeAssociation/:association', (req,res) => {
        if(!req.user) {
            res.redirect('/api/auth/login');
        } else {
            var params = {
                association: req.params.association,
                userID: req.user.UserID
            }

            user.removeAssociation(params,function(err,response) {
                res.redirect('/api/user/me')
            });
        }
    });
    /*
        PUBLIC
    */

    /*
        While not typical for an API, this is a visual demonstration using a very simple
        view of a user's 'profile' page

        If the user is logged in, they have options for routes to remove existing associations
        or add new ones

        if the user is not logged in, this page is still viewable! the options to add/remove are gone
        but other users can view this page publicly
    */

    router.get('/profile/view/:id', function(req,res) {
        var params = {
            UserID: req.params.id
        }

        user.getUserProfile(params,function(err,response) {
            if(err) {
                res.send(err);
            } else {
                res.locals.profile = response;

                if((req.user) && (req.user.UserID == req.params.id)) {
                    res.locals.usersPage = true;
                } else {
                    res.locals.usersPage = false;
                }

                res.render('pages/user/profile.ejs');
            }
        })
    });

    /*
        This is a conventional API response. This is a text route that returns an object
        with a user object and an array of objects of associations
    */
    router.get('/profile/:id', function(req,res) {
        var params = {
            UserID: req.params.id
        }

        user.getUserProfile(params,function(err,response) {
            if(err) {
                res.send(err);
            } else {
                res.send(response);
            }
        })
    });

    return router;
}
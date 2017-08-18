var middlewareExports = {};

/*
    Middleware that informs of whether the user is logged in or not. This can be used to prefix express functions

    This will redirect a user to a login page, stopping execution if they are not logged in.

    Otherwise, let the request pass!
*/

middlewareExports.isLoggedIn = function(req,next) {
    if(req.user) {
        next();
    } else {
        res.redirect('/api/auth/login/');
    }
}

module.exports = middlewareExports;
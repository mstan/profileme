var router = require('express').Router(); //Express router object

//var dbConnection = require('./lib/database/mysql.js').returnDatabase;

/*
    SUBSIDIARY ROUTING DEPENDENCIES
*/

/*
    These are sub routers. For example, userRouter is all routes under /api/user/
*/
var userRouter = require('./lib/routing/user.js');
var authRouter = require('./lib/routing/auth.js');
var assocationsRouter = require('./lib/routing/associations.js');


/*
    Bind our routing objects
*/
router.use('/user', userRouter(router));
router.use('/auth', authRouter(router));
router.use('/associations', assocationsRouter(router));

module.exports = router;
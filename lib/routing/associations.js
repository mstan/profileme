var associations = require('../app/associations.js');

module.exports = (router) => {
    router.get('/all', (req,res) => {
        /*
            By convention, all functions should take a "params" value. This particular
            one does not need any parameters -- not forseeably!
            But in order to be consistent and allow for it in the future,
            we pass {} for our params.
        */
        associations.getAll({},(err,response) => {
            if(err) {
                res.send(err);
            } else {
                res.locals.associations = response;
                res.render('pages/associations/associations.ejs');
            }
        });
    });

    return router;
}
/*
    CONFIGURATION FILE
*/

module.exports = {
    github: {
        clientID: '',
        clientSecret: '',
        callbackURL: "http://127.0.0.1:2000/api/auth/oauth/github/return"
    },

    twitter: {
        consumerKey: '',
        consumerSecret: '',
        callbackURL: "http://127.0.0.1:2000/api/auth/oauth/twitter/return"
    },

    mysql: {
        host: 'localhost',
        user: '',
        password: '',
        database: 'profileme',
        charset: 'utf8mb4'
    },

    express: {
        cookieParserSecret: 'a secret token',
        sessionSecret: 'a more secret token'
    },

    port: 2000
}
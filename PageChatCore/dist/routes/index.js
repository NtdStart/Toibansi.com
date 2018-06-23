'use strict';

var express = require('express');
var router = express.Router();
var passport = require('passport');

// Home page
router.get('/', function (req, res, next) {
    // If user is already logged in, then redirect to rooms page
    if (req.isAuthenticated()) {
        res.redirect('/rooms');
    } else {}
});

// Login
router.post('/login', passport.authenticate('local', {
    successRedirect: '/rooms',
    failureRedirect: '/',
    failureFlash: true
}));

// Logout
router.get('/logout', function (req, res, next) {
    // remove the req.user property and clear the login session
    req.logout();
    // destroy session data
    req.session = null;
    // redirect to homepage
    res.redirect('/');
});

module.exports = router;
//# sourceMappingURL=index.js.map
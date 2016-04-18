var express = require('express');
var router = express.Router();
var log = require('winston');
var db = require('../db');

// GET /user
router.get('/', function(req, res) {
    res.redirect('/user/profile');
});

// GET /user/profile
router.get('/profile', function(req, res) {
    var token = req.session.user.token;
    db.getUserByToken(token, function(err, user) {
        if (err) {
            log.error("Failure looking for user profile `" + token + "`:", err);
            return res.status(500).send("Sorry, we got an error :(");
        }

        if (! user) {
            log.error("Coult not find profile for user: `" + user + "`");
            return res.status(404).send("User not found");
        }

        res.send(JSON.stringify(user));
    });
});


module.exports = router;

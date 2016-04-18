var express = require('express');
var router = express.Router();
var log = require('winston');
var db = require('../db');

router.get('/', function(req, res) {
    res.redirect('/user/profile');
});

router.get('/profile', function(req, res) {
    var userId = req.session.user.id;
    db.getUserById(userId, function(err, user) {
        if (err) {
            log.error("Failure looking for user profile `" + userId + "`:", err);
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

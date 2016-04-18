var express = require('express');
var log = require('winston');
var router = express.Router();
var db = require('../db');


router.post('/like', function(req, res) {
    var songId = req.body.songId;

    if (! songId) {
        return res.status(400).send({
            errors: [{ 
                id: "Missing song id",
                message: "Expected valid song id on every vote",
            }]
        });
    }

    var user = {
        email: req.session.user.email,
        name: req.session.user.name,
    };

    db.voteSong(songId, user, function(err) {
        if (err) {
            return res.fail("Vote Failure", err);
        }

        res.succeed({ message: "Vote succeeded!" });
    });
});

module.exports = router;

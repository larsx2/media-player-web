var express = require('express');
var log = require('winston');
var router = express.Router();


router.post('/like', function(req, res) {
    log.info("Got like");
});

module.exports = router;

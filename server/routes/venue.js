var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.send("Venue response");
});

router.get('/menu', function(req, res) {
  res.send("Mennu response");
});

router.get('/promotions', function(req, res) {
  res.send("Promotions response");
});


module.exports = router;


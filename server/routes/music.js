var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.json({ "songs": [] });
});

router.get('/genres', function(req, res) {
  res.send("Genres response");
});

router.get('/artists', function(req, res) {
  res.send("Artists response");
});

router.get('/albums', function(req, res) {
  res.send("Albums response");
});

router.get('/songs', function(req, res) {
  res.send("Songs response");
});

module.exports = router;

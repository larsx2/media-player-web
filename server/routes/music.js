var express = require('express');
var router = express.Router();
var db = require('../db');

router.get('/', function(req, res) {
  res.redirect("/music/songs");
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
    db.getAllSongs(function(err, songs) {
        if (err) return res.fail(500, "Failed to retrieve songs");
        res.succeed(songs);
    });
});

router.get('/playlist', function(req, res) {
    db.getPlaylist("applebees", function(err, playlist) {
        if (err) return res.fail(500, "Failed to retrieve playlist");
        res.succeed(playlist);
    });
});

module.exports = router;

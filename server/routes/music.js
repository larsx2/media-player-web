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
    db.getAllArtists(function(err, artists) {
        if (err) return res.fail(500, "Failed to retrieve artists", 500);
        if (! artists) return res.fail(404, "Artists not found", 404);

        res.succeed(artists);
    });
});

router.get('/albums', function(req, res) {
    db.getAllAlbums(function(err, albums) {
        if (err) return res.fail(500, "Failed to retrieve albums", 500);
        if (! albums) return res.fail(404, "Albums not found", 404);

        res.succeed(albums);
    });
});

router.get('/albums/:albumId', function(req, res) {
    var albumId = req.params.albumId;
    db.getAlbum(albumId, function(err, album) {
        if (err) return res.fail(500, "Failed to retrieve album", 500);
        if (! album) return res.fail(404, "Album not found", 404);

        res.succeed(album);
    });
});

router.get('/songs', function(req, res) {
    db.getAllSongs(function(err, songs) {
        if (err) return res.fail(500, "Failed to retrieve songs");
        res.succeed(songs);
    });
});

router.get('/songs/:songId', function(req, res) {
    var songId = req.params.songId;
    db.getSong(songId, function(err, song) {
        if (err) return res.fail(500, "Failed to retrieve song", 500);
        if (! song) return res.fail(404, "Song not found", 404);

        res.succeed(null, song);
    });
});

router.get('/playlist', function(req, res) {
    db.getPlaylist("applebees", function(err, playlist) {
        if (err) return res.fail(500, "Failed to retrieve playlist");
        res.succeed(playlist);
    });
});

module.exports = router;

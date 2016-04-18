var _ = require('lodash');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var log = require('winston');

mongoose.connect('mongodb://localhost/jukebox');

var UserSchema = new Schema({
    token: String,
    name: String,
    email: String,
    password: String,
    last_login: Date,
});
var User = mongoose.model('User', UserSchema, 'users');

var SongSchema = new Schema({
    name: String,
    band: String,
    album: String,
    genres: Array,
    votes: Number, // for Playlist only
});
var Song = mongoose.model('Song', SongSchema, 'songs');

var PlaylistSchema = new Schema({
    venue: String,
    updated_at: Date,
    songs: [SongSchema],
});
var Playlist = mongoose.model('Playlist', PlaylistSchema, 'playlists');


exports.authenticate = function(email, password, callback) {
    User.findOne({
        "profile.email": email,
        password: password
    }, function(err, user) {
        if (err) return callback(err);
        if (! user) return callback("User not found");
        callback(null, _.omit(user.toObject(), ['_id', 'password']));
    });
};

exports.getUserByToken = function(token, callback) {
    User.findOne({ token: token }, function(err, user) {
        if (err) return callback(err);
        callback(null, _.omit(user.toObject(), ['_id', 'password']));
    });
};

exports.voteSong = function(songId, voter, callback) {
    Playlist.findOne({ venue: "applebees" }, function(err, playlist) {
        if (err) return callback(err);
        if (! playlist) return callback("Playlist not found");
 
        Song.findOne({ _id: songId }, function(err, song) {
            if (err) return callback(err);
            if (! song) return callback("Song not found");
    
            var found = playlist.songs.id(song.id);
            if (found) {
                found.votes += 1;
            }
            else {
                song.votes = 1;
                playlist.songs.push(song);
            }

            playlist.save(function(err) {
                if (err) return callback(err);

                callback(null, _.omit(playlist.toObject(), ['_id']));
            });
        });
    });
};

exports.getAllSongs = function(callback) {
    Song.find({}, function(err, songs) {
        if (err) return callback(err);
        if (! songs) return callback("No songs found");

        callback(null, songs);
    });
};

exports.getPlaylist = function(playlistName, callback) {
    Playlist.findOne({ venue: playlistName }, function(err, playlist) {
        if (err) return callback(err);
        if (! playlist) return callback("Playlist not found");

        callback(null, _.omit(playlist.toObject(), ['_id', '__v']));
    });
};

exports.generateAll = function(callback) {
    var playlist = Playlist({ venue: "applebees", songs: [] });
    playlist.save();
    callback();
};

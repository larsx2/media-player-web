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
    artist: Schema.Types.ObjectId,
    album: Schema.Types.ObjectId,
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

var AlbumSchema = new Schema({
    name: String,
    image_url: String,
    songs: [],
    artist: Schema.Types.ObjectId,
});
var Album = mongoose.model('Album', AlbumSchema, 'albums');

var ArtistSchema = new Schema({
    name: String,
    albums: [],
});
var Artist = mongoose.model('Artist', ArtistSchema, 'artists');

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
    
            var found = playlist.songs.id(songId);

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

exports.getPlaylist = function(playlistName, callback) {
    Playlist.findOne({ venue: playlistName }, function(err, playlist) {
        if (err) return callback(err);
        if (! playlist) return callback("Playlist not found");

        callback(null, playlist);
    });
};

exports.getAllSongs = function(callback) {
    Song.find({}, function(err, songs) {
        if (err) return callback(err);
        if (! songs) return callback("No songs found");

        callback(null, songs);
    });
};

exports.getSong = function(songId, callback) {
    Song.findOne({ _id: songId }, function(err, song) {
        if (err) return callback(err);
        if (! song) return callback("Song not found");

        callback(null, song);
    });
};

exports.getAllAlbums = function(callback) {
    Album.find({}, function(err, albums) {
        if (err) return callback(err);
        if (! albums) return callback("Albums not found");

        callback(null, albums);
    });
};

exports.getAlbum = function(albumId, callback) {
    Album.findOne({ _id: albumId }, function(err, album) {
        if (err) return callback(err);
        if (! album) return callback("Album not found");

        callback(null, album);
    });
};

exports.getAllArtists = function(callback) {
    Artist.find({}, function(err, artists) {
        if (err) return callback(err);
        if (! artists) return callback("Artists not found");

        callback(null, artists);
    });
};

exports.getArtist = function(artistId, callback) {
    Artist.findOne({ _id: artistId }, function(err, artist) {
        if (err) return callback(err);
        if (! artist) return callback("Artist not found");

        callback(null, artist);
    });
};

exports.generateAll = function(callback) {
    var playlist = Playlist({ venue: "applebees", songs: [] });
    playlist.save();
    callback();
};

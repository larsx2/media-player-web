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
var User = mongoose.model('User', UserSchema);

exports.authenticate = function(email, password, callback) {
    User.findOne({
        "profile.email": email,
        password: password
    }, function(err, user) {
        if (err) return callback(err);
        if (! user) return callback("User not found");
        callback(null, user.toObject());
    });
};

exports.getUserByToken = function(token, callback) {
    User.findOne({ token: token }, function(err, user) {
        if (err) return callback(err);
        callback(null, _.omit(user.toObject(), ['_id', 'password']));
    });
};

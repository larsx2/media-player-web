var _ = require('lodash');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var log = require('winston');

mongoose.connect('mongodb://localhost/jukebox');

var UserSchema = new Schema({
    userId: String,
    name: String,
    email: String,
    password: String,
    last_login: Date,
});
var User = mongoose.model('User', UserSchema);

exports.authenticate = function(email, password, callback) {
    User.findOne({ email: email, password: password }, callback);
};

exports.getUserById = function(userId, callback) {
    User.findOne({ userId: userId }, function(err, user) {
        if (err) {
            return callback(err);
        }
        callback(null, _.omit(user.toObject(), ['_id']));
    });
};

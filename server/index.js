var url = require('url');
var uuid = require('node-uuid');
var express = require('express');
var server = require('http').createServer();
var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({ server: server });
var db = require('./db');

var favicon = require('serve-favicon');
var cookieSession = require('cookie-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var serveStatic = require('serve-static');

var logger = require('morgan');
var log = require('winston');

var app = express();
var PORT = 3000;

var music = require('./routes/music');
var venue = require('./routes/venue');
var action = require('./routes/action');
var user = require('./routes/user');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(serveStatic('web', {'index': 'playlist.html'}));
app.use(serveStatic('web/audio'));

app.use(cookieSession({
  name: 'session',
  secret: '2743f70422e4b22a1bbb5621721143f1df107074e489cd4bf35aae1f80cf16d3',
}));

app.use(function(req, res, next) {
    res.contentType('application/json');

    res.fail = function(errorId, errorMsg, status) {
        return res.status(status || 400).json({
            errors: [{
                id: errorId,
                message: errorMsg,
            }]
        });
    };

    res.succeed = function(msg) {
        return res.status(200).json(msg);
    };

    next();
});

wss.on('connection', function connection(ws) {
  var location = url.parse(ws.upgradeReq.url, true);

  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
  });

  ws.send('something');
});

app.post('/login', function(req, res) {
    var email = req.body.email;   
    var password = req.body.password;

    db.authenticate(email, password, function(err, user) {
        if (err || !user) {
            log.warn("Failed to authenticate `" + email + "`:`" + password + "`");
            return res.fail(400, "Failed to authenticate user", 400);
        }
        req.session.user = {
            token: user.token,
            email: user.profile.email,
            name: user.profile.display_name,
        };
        res.succeed(user);
    });
});

app.all('/*', function(req, res, next) {
    if (! req.session.user) {
        return res.fail(401, "Unauthorized", 401);
    }

    next();
});

app.use('/music', music);
app.use('/venue', venue);
app.use('/action', action);
app.use('/user', user);

app.use(function notFound(req, res, next) {
    res.fail("Not Found", "Resource not found", 404);
});

app.use(function onError(err, req, res, next) {
    console.error(err.stack);
    res.fail(500, "Something broke!", 500);
});

server.on('request', app);
server.listen(PORT, function() { 
    log.info('server started on port', server.address().port);
});

/**
 *  # Authentication
 *  POST /v1/login 
 *    - username={username}
 *    - password={password}
 * 
 *  # Profile
 *  GET /v1/profile 
 *
 *  # Music 
 *  GET /v1/music/songs
 *  GET /v1/music/albums
 *  GET /v1/music/artists
 *  GET /v1/music/genres
 *
 *  # Votes
 *  POST /v1/actions/vote/{song id}
 *    - like=true|false
 *    - user_id=<int>
 *
 *  # Venues
 *  GET /v1/venue
 *  GET /v1/venue/menu
 *  GET /v1/venue/promotions
 */ 

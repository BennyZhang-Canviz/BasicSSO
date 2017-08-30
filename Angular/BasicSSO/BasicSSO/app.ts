import { appAuth } from './services/appAuth';
var http = require("http");
var https = require("https");
var cookieSession = require('cookie-session');
var express = require("express");
var path = require("path");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var fs = require("fs");
var url = require("url");
var dbContext_1 = require("./services/dbContext");
var meRoute = require("./routes/me");
var app = express();

// Authentication
var auth = new appAuth(app);

// Angular
app.use("/app", express.static(path.join(__dirname, 'app')));
app.use("/node_modules", express.static(path.join(__dirname, 'node_modules'), { maxAge: 1000 * 60 * 60 * 24 }));
app.get("/systemjs.config.js", function (req, res) {
    res.sendfile(path.join(__dirname, 'systemjs.config.js'));
});

// Config the app
app.use(logger('dev'));
app.use(cookieSession({
    name: 'session',
    keys: ['key1', 'key2'],
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));

// Initialize Passport
auth.initPassport(app);

app.use(express.static(path.join(__dirname, 'public')));

// APIs
app.use('/api/me', auth.ensureAuthenticated, meRoute);

// Configure auth route
auth.initAuthRoute(app);

// Pass constants to client side through cookie
app.get('/*', function (req, res) {
    res.sendfile(path.join(__dirname, "index.html"));
});

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err['status'] = 404;
    next(err);
});

// Handle errors
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err['status'] || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

app.use(function (err, req, res, next) {
    res.status(err['status'] || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

// Sync database
var db = new dbContext_1.DbContext();
db.sync({ force: false }).then(function () { });

// Create server
var port = process.env.port || 1337;
if (app.get('env') === 'development') {
    https.createServer({
        key: fs.readFileSync('ssl/key.pem'),
        cert: fs.readFileSync('ssl/cert.pem')
    }, app).listen(port);
}
else {
    http.createServer(app).listen(port, function () {
        console.log('Express server listening on port ' + port);
    });
}
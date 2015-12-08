var express = require('express');
var app = express();
var port = process.env.PORT || 4000;

var mongoose = require('mongoose');
var dbUrl = 'mongodb://localhost/movie';
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

var path = require('path');

var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.listen(port);
app.set('views', './app/views/pages');
app.set('view engine', 'jade');
console.log('Process running in:' + port);

mongoose.connect(dbUrl);
app.use(session({
    secret: 'movie',
    store: new MongoStore({
        url: dbUrl,
        collection: 'session'
    })
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());

app.locals.moment = require('moment');

if('development' == app.get('env')) {
    app.set('showStackShow', true);
    app.use(express.logger(':method :url :status'));
    app.locals.pretty = true;
    mongoose.set('debug', true);
}

require('./config/routes')(app, urlencodedParser);
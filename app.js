var express = require('express');
var _ = require('underscore');
var Movie = require('./modules/movie');
var User = require('./modules/user');

var app = express();
app.set('views', './views/pages');
app.set('view engine', 'jade');
var port = process.env.PORT || 4000;
app.listen(port);
console.log('Process running in:' + port);

var path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

var mongoose = require('mongoose');
var dbUrl = 'mongodb://localhost/movie';
mongoose.connect(dbUrl);
var session = require('express-session');
// app.use(express.cookieParser());
var MongoStore = require('connect-mongo')(session);
app.use(session({
    secret: 'movie',
    store: new MongoStore({
        url: dbUrl,
        collection: 'session'
    })
}));

var bodyParser = require('body-parser');
// var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(bodyParser.json());

app.locals.moment = require('moment');


// index page
app.get('/', function (req, res) {
    Movie.fetch(function (err, movie) {
        if(err) {
            console.log(err);
        }

        res.render('index', {
            title: '首页',
            movie: movie
        })
    })
})

// movie list page
app.get('/movie/list', function (req, res) {
    Movie.fetch(function (err, movie) {
        if(err) {
            console.log(err);
        }

        res.render('movielist', {
            title: '列表页',
            movie: movie
        })
    })
})

// movie detail page
app.get('/movie/detail/:id', function (req, res) {
    var id = req.params.id;

    Movie.findById(id, function (err, movie) {
        res.render('moviedetail', {
            title: '详情页',
            movie: movie
        })
    })
})

// add movie
app.get('/admin/movie/add', function (req, res) {
    res.render('adminmovie', {
        title: '录入页',
        movie: {
            _id: '',
            title: '',
            summary: ''
        }
    })
})

// admin update movie
app.get('/admin/movie/update/:id', function (req, res) {
    var id = req.params.id;

    if(id) {
        Movie.findById(id, function (err, movie) {
            if(err) {
                console.log(err);
            }

            res.render('adminmovie', {
                title: '更新页',
                movie: movie
            })
        })
    }
})

// admin post new movie
app.post('/admin/movie/new', urlencodedParser, function (req, res) {
    var movieObj = req.body;
    var id = movieObj._id;
    var _movie;

    if(id !== '') {
        Movie.findById(id, function (err, movie) {
            if(err) {
                console.log(err);
            }

            _movie = _.extend(movie, movieObj);
            _movie.save(function (err, movie) {
                if(err) {
                    console.log(err);
                }

                res.redirect('/movie/detail/' + movie._id);
            })
        })
    }
    else {
        _movie = new Movie({
            title: movieObj.title,
            summary: movieObj.summary
        })

        _movie.save(function (err, movie) {
            if(err) {
                console.log(err);
            }

            res.redirect('/movie/detail/' + movie._id);
        })
    }
})

// admin delete movie
app.delete('/admin/movie/delete', function (req, res) {
	var id = req.query.id;

	if(id) {
		Movie.remove({_id: id}, function (err, movie) {
			if(err) {
				console.log(err);
			}
			else {
				res.json({success: 1});
			}
		})
	}
})


// user list
app.get('/user/list', function (req, res) {
    User.fetch(function (err, user) {
        if(err) {
            console.log(err);
        }

        res.render('userlist', {
            title: '用户列表页',
            user: user
        })
    })
})

// user signin
app.post('/admin/user/signin', urlencodedParser, function (req, res) {
    var _user = req.body;

    User.findOne({name: _user.name}, function (err, user) {
        if(err) {
            console.log(err);
        }

        if(user) {
            user.comparePassword(_user.password, function (err, isMatch) {
                if(err) {
                    console.log(err);
                }

                if(isMatch) {
                    req.session.user = user;
                    console.log('Password is matched!');
                    res.redirect('/');
                }
                else {
                    console.log('Password is not matched!');
                }
            })
        }
        else {
            console.log('User is not exit!');
        }
    })
})

// user signup
app.post('/admin/user/signup', urlencodedParser, function (req, res) {
    var _user = req.body;

    User.findOne({name: _user.name}, function (err, user) {
        if(err) {
            console.log(err);
        }

        if(user) {
            return res.redirect('/');
        }
        else {
            var user = new User(_user);
            user.save(function (err, user) {
                if(err) {
                    console.log(err);
                }

                res.redirect('/user/list');
            })
        }
    })
})
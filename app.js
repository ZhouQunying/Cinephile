var express = require('express');
var _ = require('underscore');
var Movie = require('./modules/movie');

var app = express();
app.set('views', './views/pages');
app.set('view engine', 'jade');
var port = process.env.PORT || 4000;
app.listen(port);
console.log('Process running in:' + port);

var path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/movie');

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

// list page
app.get('/list', function (req, res) {
    Movie.fetch(function (err, movie) {
        if(err) {
            console.log(err);
        }

        res.render('list', {
            title: '列表页',
            movie: movie
        })
    })
})

// detail page
app.get('/detail/:id', function (req, res) {
    var id = req.params.id;

    Movie.findById(id, function (err, movie) {
        res.render('detail', {
            title: '详情页',
            movie: movie
        })
    })
})

// add movie page
app.get('/admin/add', function (req, res) {
    res.render('admin', {
        title: '录入页',
        movie: {
            _id: '',
            title: '',
            summary: ''
        }
    })
})

// admin update
app.get('/admin/update/:id', function (req, res) {
    var id = req.params.id;

    if(id) {
        Movie.findById(id, function (err, movie) {
            if(err) {
                console.log(err);
            }

            res.render('admin', {
                title: '更新页',
                movie: movie
            })
        })
    }
})

// admin post new
app.post('/admin/new', urlencodedParser, function (req, res) {
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

                res.redirect('/detail/' + movie._id);
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

            res.redirect('/detail/' + movie._id);
        })
    }
})

// admin delete movie
app.delete('/admin/delete', function (req, res) {
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
var _ = require('underscore');
var Movie = require('../modules/movie');

exports.list = function (req, res) {
    Movie.fetch(function (err, movie) {
        if(err) {
            console.log(err);
        }

        res.render('movielist', {
            title: '列表页',
            movie: movie
        })
    })
}

exports.detail = function (req, res) {
    var id = req.params.id;

    Movie.findById(id, function (err, movie) {
        res.render('moviedetail', {
            title: '详情页',
            movie: movie
        })
    })
}

exports.add = function (req, res) {
    res.render('adminmovie', {
        title: '录入页',
        movie: {
            _id: '',
            title: '',
            summary: ''
        }
    })
}

exports.update = function (req, res) {
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
}

exports.save = function (req, res) {
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
}

exports.del = function (req, res) {
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
}
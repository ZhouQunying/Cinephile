var Movie = require('../modules/movie');

exports.index = function (req, res) {
    Movie.fetch(function (err, movie) {
        if(err) {
            console.log(err);
        }

        res.render('index', {
            title: '首页',
            movie: movie
        })
    })
}
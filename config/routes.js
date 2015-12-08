var Index = require('../app/controllers/index');
var Movie = require('../app/controllers/movie');
var User = require('../app/controllers/user');

module.exports = function(app, urlencodedParser) {

    // pre handle user
    app.use(function (req, res, next) {
        var _user = req.session.user;
        app.locals.user = _user;

        next();
    })

    // index
    app.get('/', Index.index);

    // movie
    app.get('/movie/list', Movie.list);
    app.get('/movie/detail/:id', Movie.detail);
    app.get('/admin/movie/add', Movie.add);
    app.get('/admin/movie/update/:id', Movie.update);
    app.post('/admin/movie/new', urlencodedParser, Movie.save);
    app.delete('/admin/movie/delete', Movie.del);

    // user
    app.get('/user/list', User.list);
    app.post('/signin', urlencodedParser, User.signin);
    app.post('/signup', urlencodedParser, User.signup);
    app.get('/logout', User.logout);
}
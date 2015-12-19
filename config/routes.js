var Index = require('../app/controllers/index');
var Movie = require('../app/controllers/movie');
var User = require('../app/controllers/user');
var Comment = require('../app/controllers/comment');

module.exports = function(app, urlencodedParser) {

    // pre handle user
    app.use(function (req, res, next) {
        var _user = req.session.user;
        app.locals.user = _user;

        next();
    })

    // index
    app.get('/', Index.index);

    // user
    app.get('/signin/page', User.signin);
    app.get('/signup/page', User.signup);
    app.get('/logout/page', User.logout);
    app.post('/admin/signin', urlencodedParser, User.adminSignin);
    app.post('/admin/signup', urlencodedParser, User.adminSignup);
    app.get('/admin/user/list', User.signinRequire, User.adminRequire, User.list);

    // movie
    app.get('/movie/detail/:id', User.signinRequire, Movie.detail);
    app.get('/admin/movie/list', User.signinRequire, User.adminRequire, Movie.list);
    app.get('/admin/movie/add', User.signinRequire, User.adminRequire, Movie.add);
    app.get('/admin/movie/update/:id', User.signinRequire, User.adminRequire, Movie.update);
    app.post('/admin/movie/new', urlencodedParser, User.signinRequire, User.adminRequire, Movie.save);
    app.delete('/admin/movie/delete', User.signinRequire, User.adminRequire, Movie.del);

    // comment
    app.post('/user/comment', urlencodedParser, User.signinRequire, Comment.save);
}
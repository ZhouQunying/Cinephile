var User = require('../modules/user');

exports.list = function (req, res) {
    User.fetch(function (err, user) {
        if(err) {
            console.log(err);
        }

        res.render('userlist', {
            title: '用户列表页',
            users: user
        })
    })
}

exports.signin = function (req, res) {
    res.render('signin', {
        title: '登陆页'
    })
}

exports.signup = function (req, res) {
    res.render('signup', {
        title: '注册页'
    })
}

exports.logout = function (req, res) {
    delete req.session.user;
    // delete app.locals.user;

    res.redirect('/');
}

exports.adminSignin = function (req, res) {
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
                    res.redirect('/');
                }
                else {
                    res.redirect('/signin');
                }
            })
        }
        else {
            res.redirect('/signup');
        }
    })
}

exports.adminSignup = function (req, res) {
    var _user = req.body;

    User.findOne({name: _user.name}, function (err, user) {
        if(err) {
            console.log(err);
        }

        if(user) {
            res.redirect('/signin');
        }
        else {
            user = new User(_user);
            user.save(function (err, user) {
                if(err) {
                    console.log(err);
                }

                res.redirect('/user/list');
            })
        }
    })
}
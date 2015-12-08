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
                    console.log('Password is matched!');

                    req.session.user = user;
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
}

exports.signup = function (req, res) {
    var _user = req.body;

    User.findOne({name: _user.name}, function (err, user) {
        if(err) {
            console.log(err);
        }

        if(user) {
            res.redirect('/');
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
}

exports.logout = function (req, res) {
    delete req.session.user;
    // delete app.locals.user;

    res.redirect('/');
}
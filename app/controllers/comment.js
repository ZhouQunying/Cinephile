var Comment = require('../modules/comment');

exports.save = function (req, res) {
    var commentObj = req.body;
    var comment = new Comment(commentObj);

    comment.save(function (err, comment) {
        if(err)  {
            console.log(err);
        }

        res.redirect('/movie/detail/' + commentObj.movie);
    })
}
var Comment = require('../modules/comment');

exports.save = function (req, res) {
    var commentObj = req.body;

    if(commentObj.commentId) {
        Comment.findById(commentObj.commentId, function (err, comment) {
            var reply = {
                from: commentObj.from,
                to: commentObj.toId,
                content: commentObj.content
            }

            comment.reply.push(reply);
            comment.save(function (err, comment) {
                if(err)  {
                    console.log(err);
                }

                res.redirect('/movie/detail/' + commentObj.movie);
            })
        })
    }
    else {
        var comment = new Comment(commentObj);

        comment.save(function (err, comment) {
            if(err)  {
                console.log(err);
            }

            res.redirect('/movie/detail/' + commentObj.movie);
        })
    }
}
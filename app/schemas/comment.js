var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = new Schema({
    movie: {type: Schema.Types.ObjectId, ref: 'Movie'},
    from: {type: Schema.Types.ObjectId, ref: 'User'},
    reply: [{
        from: {type: Schema.Types.ObjectId, ref: 'User'},
        to: {type: Schema.Types.ObjectId, ref: 'User'},
        content: {type: String}
    }],
    content: {type: String},
    meta: {
        createAt: {
            type: Date,
            default: Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        }
    }
})

commentSchema.pre('save', function (next) {
    if(this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now();
    }
    else {
        this.meta.updateAt = Date.now();
    }

    next();
})

commentSchema.statics = {
    fetch: function(callback) {
        return this
            .find({})
            .sort('meta.updateAt')
            .exec(callback)
    },
    findById: function(id, callback) {
        return this
            .find({_id: id})
            .sort('mate.updateAt')
            .exec(callback)
    }
}

module.exports = commentSchema;
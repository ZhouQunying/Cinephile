var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
var hash = bcrypt.hashSync('bacon');
var SALT_WORK_FACTOR = 10;

var userSchema = new Schema({
    name: {
        unique: true,
        type: String
    },
    password: String,
    meta: {
        createAt: {
            type: Date,
            default: Date.now()
        },
        update: {
            type: Date,
            default: Date.now()
        }
    }
})

userSchema.pre('save', function (next) {
    // this amount to userSchema
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now();
    }
    else {
        this.meta.updateAt = Date.now();
    }

    // salt
    var user = this;
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) {
            return next(err);
        }

        bcrypt.hash(user.password, salt, null, function (err, hash) {
            if (err) {
                return next(err);
            }
            user.password = hash;
            next();
        })
    })
})

userSchema.methods = {
    comparePassword: function(_password, callback) {
        var hashPassword = this.password;
        bcrypt.compare(_password, hashPassword, function (err, isMatch) {
            if(err) {
                return callback(err);
            }

            callback(null, isMatch);
        })
    }
}

userSchema.statics = {
    fetch: function(callback) {
        return this
            .find({})
            .sort('meta.updateAt')
            .exec(callback)
    },
    findById: function(id, callback) {
        return this
            .find({_id: id})
            .sort('meta.updateAt')
            .exec(callback)
    }
}

module.exports = userSchema;
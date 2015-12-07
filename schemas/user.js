var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
var hash = bcrypt.hashSync("bacon");
// The cost fo processing the data
var SALT_WORK_FACTOR = 10;

var UserSchema = new Schema({
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

UserSchema.pre('save', function (next) {
    // this amount to UserSchema
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

UserSchema.methods = {
    comparePassword: function (_password, cb) {
        var hashPassword = this.password;
        bcrypt.compare(_password, hashPassword, function (err, isMatch) {
            if(err) {
                return cb(err);
            }

            cb(null, isMatch);
        })
    }
}

UserSchema.statics = {
    fetch: function (cb) {
        return this
            .find({})
            .sort('meta.updateAt')
            .exec(cb)
    },
    findById: function (id, cb) {
        return this
            .find({_id: id})
            .sort('meta.updateAt')
            .exec(cb)
    }
}

module.exports = UserSchema;
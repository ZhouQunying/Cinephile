var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var movieSchema = new Schema({
	title: String,
	summary: String,
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

movieSchema.pre('save', function (next) {
	// this amount to movieSchema
	if(this.isNew) {
		this.meta.createAt = this.meta.updateAt = Date.now();
	}
	else {
		this.meta.updateAt = Date.now();
	}

	next();
})

movieSchema.statics = {
	fetch: function(callback) {
		return this
			.find({})
			.sort('meta.updateAt')
			.exec(callback)
	},
	findById: function(id, callback) {
		return this
			.findOne({_id: id})
			.sort('meta.updateAt')
			.exec(callback)
	}
}

module.exports = movieSchema;
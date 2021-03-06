var mongoose = require('mongoose');

var reviewSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	comment: {
		type: String
	},
	rating: {
		type: Number,
		min: 0.0,
		max: 5.0,
		required: true
	},
	author: {
		type: String,
		required: true
	}
});

var productSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	price: {
		type: Number,
		min: 0.0,
		max: 10000.0,
		required: true
	},
	condition: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: true
	},
	tags: {
		type: [String]
	},
	reviews: [reviewSchema],
	poster: {
		type: String,
		required: true
	}
});

var Product = mongoose.model('Product', productSchema);
module.exports = { Product };

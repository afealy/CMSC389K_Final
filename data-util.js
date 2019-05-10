var mongoose = require('mongoose');
var dotenv = require('dotenv');

// Load envirorment variables
dotenv.load();

// Connect to MongoDB
console.log(process.env.MONGODB)
mongoose.connect(process.env.MONGODB, {
    useMongoClient: true
});
mongoose.connection.on('error', function() {
    console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
    process.exit(1);
});

// schemas
var Product = require('./models/Product');

function getAllTags() {
    var allTags = [];
    Product.Product.find({}, function(err, products) {
        if (err) throw err;
        products.forEach(function(product) {
        	var tags = product.tags
        	tags.forEach(function(tag) {
        		if(allTags.indexOf(tag) == -1) allTags.push(tag);
        	});
        });
        
    });
    return allTags;
}

function getAllProducts() {
    Product.Product.find({}, function(err, products) {
        if (err) throw err;
        console.log(products);
        return products;
    });
}

module.exports = {
    getAllTags: getAllTags,
    getAllProducts: getAllProducts
}
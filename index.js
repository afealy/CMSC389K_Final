var express = require('express');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var dotenv = require('dotenv');
var dataUtil = require("./data-util");
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var _ = require("underscore");
var moment = require('moment');

// schemas
var Product = require('./models/Product');

var portNum = 8000;

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.use('/public', express.static('public'));

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

/* Add whatever endpoints you need! Remember that your API endpoints must
 * have '/api' prepended to them. Please remember that you need at least 5
 * endpoints for the API, and 5 others.
 */

app.get('/',function(req,res){
	var tags = dataUtil.getAllTags();
    var products = dataUtil.getAllProducts();
    console.log(tags);
    res.render('home', {
        data: products,
        tags: tags,
    });
})

// GET all products endpoint
app.get("/products", function(req, res) {
    // Get all products
    Product.Product.find({}, function(err, products) {
        if (err) throw err;
        res.send(products);
    });
});

// POST product endpoint
app.post('/products', function(req, res) {
    var body = req.body;
    body.tags = body.tags.split(" ");

    // post new product
    var product = new Product.Product({
        name: body.name,
        price: body.price,
        condition: body.condition,
        description: body.description,
        tags: [],
        reviews: []
    });

    product.tags = product.tags.concat(body.tags);

    // Save product to database
    product.save(function(err) {
        if (err) throw err;
        return res.send('Successfully posted product.');
    });
});

app.get('/tag/:tag', function(req, res) {
    
});

// Search endpoint
app.get('/search',function(req,res){
	
});

http.listen(portNum, function() {
    console.log('Listening on port '+portNum);
});

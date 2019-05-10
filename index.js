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

//Creating session
var cookieParser = require('cookie-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

// schemas
var Product = require('./models/Product');
var User = require('./models/User');

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
var db = mongoose.connection;

app.use(cookieParser());
app.use(session({
    secret: 'my-secret',
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: db })
}));

/* Add whatever endpoints you need! Remember that your API endpoints must
 * have '/api' prepended to them. Please remember that you need at least 5
 * endpoints for the API, and 5 others.
 */

app.get('/',function(req,res){
	var tags = dataUtil.getAllTags();
    console.log(tags);
    Product.Product.find({}, function(err, products) {
        if (err) throw err;
        res.render('home', {
            data: products,
            tags: tags
        });
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
        res.redirect("/products/"+product.id);
    });
});

app.get('/products/:id', function(req, res) {
    Product.Product.findOne({ _id: req.params.id }, function(err, product) {
        if (err) throw err;
        if (!product) return res.send('No product found with that ID.');
        res.render('product', {
            product: product,
            review: product.reviews
        })
    });
});

app.get("/products/:id/reviewForm", function(req, res) {
    Product.Product.findOne({ _id: req.params.id }, function(err, product) {
        if (err) throw err;
        if (!product) return res.send('No product found with that ID.');
        res.render('reviewForm', {
            product: product
        })
    });
});

app.post('/products/:id/postReview', function(req, res) {
    // Add a review
    Product.Product.findOne({ _id: req.params.id }, function(err, product) {
        if (err) throw err;
        if (!product) return res.send('No product found with that ID.');
        product.reviews = product.reviews.concat({
            title: req.body.title,
            comment: req.body.comment,
            rating: parseFloat(req.body.rating),
            author: req.body.author
        });

        // Save review
        product.save(function(err) {
            if (err) throw err;
        });
    });
    res.redirect("/products/"+req.params.id);
});

app.get("/productForm", function(req, res) {
    res.render('productForm');
});

app.get("/reviewForm", function(req, res) {
    res.render('reviewForm');
});

app.get('/tag/:tag', function(req, res) {
    var tags = dataUtil.getAllTags();
    var tag = req.params.tag;
    var posts = [];
    Product.Product.find({}, function(err, products) {
        if (err) throw err;
        products.forEach(function(product) {
            if (product.tags.indexOf(tag) > -1) {
                // console.log(product);
                posts.push(product);
            }
        });
        console.log(posts);
        res.render('home', {
            tag: tag,
            data: posts,
            tags: tags
        });
    });
});

// Search endpoint
app.get('/search',function(req,res){
	
});

http.listen(portNum, function() {
    console.log('Listening on port '+portNum);
});

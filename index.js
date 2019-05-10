var express = require('express');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var dotenv = require('dotenv');
var dataUtil = require("./data-util");
var userUtil = require("./user-util");
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
var conn = mongoose.connect(process.env.MONGODB, {
    useMongoClient: true
});
mongoose.connection.on('error', function() {
    console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
    process.exit(1);
});

var db = conn;

app.use(cookieParser());
app.use(session({
    secret: 'my-secret',
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: db })
}));

var sess;

app.get('/',function(req,res){
    var body = req.body;
    sess = req.session;
    if(sess.username) {
    	var tags = dataUtil.getAllTags();
        Product.Product.find({}, function(err, products) {
            if (err) throw err;
            res.render('home', {
                sess_user: sess.username,
                data: products,
                tags: tags
            });
        });
    } else {
        res.redirect("/login");
    }
})

app.get('/login', function(req,res) {
    res.render('loginForm');
})

app.post('/login', function(req,res) {
    sess = req.session;
    var body = req.body;
    User.User.findOne({ username: body.username, password: body.password }, function(err, name) {
        if (!name) { return res.redirect("/register"); }
        sess.username = name.username;
        res.redirect("/");
    });
})

app.get('/logout', function(req,res) {
    req.session.destroy((err) => {
        if(err) {
            return console.log(err);
        }
        res.redirect('/');
    });
})

app.get('/register', function(req,res) {
    res.render('registerForm');
})

app.post('/register', function(req,res) {
    var body = req.body;
    sess = req.session;
    if(verifyRegistration(body.password,body.confirm_password)) {
        User.User.findOne({ username: body.username }, function(err, name) {
        if (err) throw err;
        if (!name) {
            var user = new User.User({
                username: body.username,
                contact: body.contact,
                password: body.password
            });

            // Save user to database
            user.save(function(err) {
                if (err) throw err;
                res.redirect("/");
            });
        }
    });
    }
})

app.get('/user/:name', function(req,res) {
    sess = req.session;
    User.User.findOne({ username: req.params.name }, function(err, user) {
        if (err) throw err;
        if (!user) {
            return res.send('No user found.')
        }
        res.render('profile', {
            sess_user: sess.username,
            user: user
        })
    })
    
})

app.delete('/user/:name/delete', function(req,res) {
    User.User.findOne({ username: req.params.name }, function(err, user) {
        User.User.findByIdAndRemove(user._id, function(err, user2) {
            if (err) throw err;
            if (!user) {
                return res.send('No user found.')
            }
            res.redirect('/');
        })
    })
})

// GET all products endpoint
app.get("/products", function(req, res) {
    sess = req.session;
    // Get all products
    Product.Product.find({}, function(err, products) {
        if (err) throw err;
        res.send(products);
    });
});

// POST product endpoint
app.post('/products', function(req, res) {
    sess = req.session;
    var body = req.body;
    body.tags = body.tags.split(" ");

    // post new product
    var product = new Product.Product({
        name: body.name,
        price: body.price,
        condition: body.condition,
        description: body.description,
        tags: [],
        reviews: [],
        poster: sess.username
    });

    product.tags = product.tags.concat(body.tags);

    // Save product to database
    product.save(function(err) {
        if (err) throw err;
        res.redirect("/products/"+product.id);
    });
});

app.get('/products/:id', function(req, res) {
    sess = req.session;
    Product.Product.findOne({ _id: req.params.id }, function(err, product) {
        if (err) throw err;
        if (!product) return res.send('No product found with that ID.');
        res.render('product', {
            sess_user: sess.username,
            product: product,
            review: product.reviews
        })
    });
});

app.get('/products/:id/delete', function(req, res) {
    Product.Product.findByIdAndRemove(req.params.id, function(err, product) {
        if (err) throw err;
        if (!product) {
            return res.send('No product found with given ID.')
        }
        res.send('Product deleted!');
    })
});

app.get("/products/:id/reviewForm", function(req, res) {
    sess = req.session;
    Product.Product.findOne({ _id: req.params.id }, function(err, product) {
        if (err) throw err;
        if (!product) return res.send('No product found with that ID.');
        res.render('reviewForm', {
            sess_user: sess.username,
            product: product
        })
    });
});

app.post('/products/:id/postReview', function(req, res) {
    sess = req.session;
    // Add a review
    Product.Product.findOne({ _id: req.params.id }, function(err, product) {
        if (err) throw err;
        if (!product) return res.send('No product found with that ID.');
        product.reviews = product.reviews.concat({
            title: req.body.title,
            comment: req.body.comment,
            rating: parseFloat(req.body.rating),
            author: sess.username
        });

        // Save review
        product.save(function(err) {
            if (err) throw err;
        });
    });
    res.redirect("/products/"+req.params.id);
});

app.get("/productForm", function(req, res) {
    sess = req.session;
    res.render('productForm');
});

app.get("/reviewForm", function(req, res) {
    sess = req.session;
    res.render('reviewForm');
});

app.get('/tag/:tag', function(req, res) {
    sess = req.session;
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
            sess_user: sess.username,
            tag: tag,
            data: posts,
            tags: tags
        });
    });
});


app.get('/about',function(req,res){
    sess = req.session;
	res.render('about', {
        sess_user: sess.username
    });
});

http.listen(portNum, function() {
    console.log('Listening on port '+portNum);
});

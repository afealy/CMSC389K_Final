var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var exphbs = require('express-handlebars');
var dataUtil = require("./data-util");
var app = express();
var _ = require("underscore");
var moment = require('moment');

var portNum = 8000;

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.use('/public', express.static('public'));

/* Add whatever endpoints you need! Remember that your API endpoints must
 * have '/api' prepended to them. Please remember that you need at least 5
 * endpoints for the API, and 5 others.
 */

var _DATA = dataUtil.loadData().restaurants;

app.get('/',function(req,res){
	var tags = dataUtil.getAllTags(_DATA);
    var brands = dataUtil.getAllBrands(_DATA);
    res.render('home', {
        data: _DATA,
        tags: tags,
        brands: brands
    });
})

app.get("/create", function(req, res) {
    res.render('createRestaurant');
});

app.post('/create', function(req, res) {
    var body = req.body;

    body.tags = body.tags.split(" ");
    body.reviews = [];
    body.rating = "0";

    // Save new blog post
    _DATA.push(req.body);
    dataUtil.saveData(_DATA);
    res.redirect("/");
});

app.get("/restaurant/:name/create", function(req, res) {
    res.render('create', {
    	restaurant: req.params.name
    });
});

app.post('/restaurant/:name/create', function(req, res) {
	var _rest = req.params.name;
    var restIndex =  _.findWhere(_DATA, { name: _rest });
    var body = req.body;

    var _DATA_REST = restIndex.reviews;
    // Add time and preview
    body.time = moment().format('MMMM Do YYYY, h:mm a');

    // Save new blog post
    _DATA_REST.push(req.body);
    dataUtil.saveData(_DATA);
    res.redirect("/restaurant/"+_rest);
});

app.get('/restaurant/:name', function(req, res) {
    var _rest = req.params.name;
    var _reviews = req;
    console.log(_rest);
    console.log(_reviews);
    
    var restaurant = _.findWhere(_DATA, { name: _rest });
    console.log(restaurant);
    if (!restaurant) return res.render('404');
    res.render('restaurant', {
    	restaurant: _rest,
    	review: restaurant.reviews
    });
});

app.get('/tag/:tag', function(req, res) {
    var tags = dataUtil.getAllTags(_DATA);
    var tag = req.params.tag;
    var posts = [];
    _DATA.forEach(function(post) {
        if (post.tags.includes(tag)) {
            posts.push(post);
        }
    });
    res.render('home', {
        tag: tag,
        data: posts,
        tags: tags
    });
});

app.get('/search',function(req,res){
	var key = req.query.key;
	var matches = _.where(_DATA, {name: key})
	var data=[];
	for(i=0;i<matches.length;i++) {
		data.push(rows[i].first_name);
	}
	res.end(JSON.stringify(data));
});

app.listen(portNum, function() {
    console.log('Listening on port '+portNum);
});

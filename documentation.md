# Yard sale

---

Name: Anthony Fealy and Frida Palencia 

Date: April 28nd, 2019

Project Topic: Buying and selling stuff that is no longer needed

URL: http://103.283.293.13:3000/
 ---

### 1. Data Format and Storage

Data point fields:
1. Review
- `Field 1`: Title           `Type: String`
- `Field 2`: Comment         `Type: String`
- `Field 3`: Rating          `Type: Number`
- `Field 4`: Author          `Type: String`

2. Products
- `Field 1`: Name            `Type: String`
- `Field 2`: Price           `Type: Int`
- `Field 3`: Condition       `Type: String`
- `Field 4`: Description     `Type: String`
- `Field 3`: Tags            `Type: [String]`
- `Field 4`: Reviews         `Type: [reviewSchema]`
- `Field 5`: Poster          `Type: String`

3. User
- `Field 1`: Username        `Type: String`
- `Field 2`: Password        `Type: String`
- `Field 3`: Contact         `Type: String`


Schema: 
```javascript
{
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


var userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});


}
```

### 2. Add New Data

1. Products

HTML form route: `/productForm`
POST endpoint route: `/products`
DELETE endpoint route: `/products/:id/delete`
example DELETE endpoint route: `/products/5cd5fd34fc5635a9a690813c/delete`

2. Reviews

HTML form route: `/products/:id/reviewForm`
POST endpoint route: `/products/:id/postReview`

3. Users

HTML form route: `/register`
POST endpoint route: `/register`
DELETE endpoint route: `/users/:username/delete`
example DELETE endpoint route: `/users/tony/delete`



Example Node.js POST request to endpoint: 
```javascript
var request = require("request");

var options = { 
    method: 'POST',
    url: 'http://localhost:8000/productForm',
    headers: { 
        'content-type': 'application/x-www-form-urlencoded' 
    },
    form: { 
        name: 'Cupcake', 
        price: 10,
        condition: "eaten",
        description: "A very good cupcake"
        tags: ["chocolate", "icing", "sprinkles"],
        poster: session user
    } 
};

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});
```

### 3. View Data

GET endpoint route: `/products`
GET endpoint route: `/users`

### 4. Navigation Pages

Navigation Filters
1. Review Form -> `/reviewForm`
2. Create Product -> `/productForm`
3. Tag -> `/tag/:tag`
4. List of products -> `/`
5. Profile -> `/user/:username`
6. about -> `/about`
7. login -> `/login`
8. register -> `/register`

### 5. npm packages

1. cookie-parser
2. express-session
3. connect-mongo
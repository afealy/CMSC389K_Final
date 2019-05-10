# Yard sale

---

Name: Frida Palencia and Anthony Fealy

Date: April 28nd, 2019

Project Topic: Buying and selling stuff that is no longer needed

URL: http://103.283.293.13:3000/
 ---

### 1. Data Format and Storage

Data point fields:
- `Field 1`: Title               `Type: String`
- `Field 2`: Comment              `Type: String`
- `Field 3`: Rating            `Type: Number`
- `Field 4`: Author              `Type: String'

- `Field 1`: Name               `Type: String`
- `Field 2`: Price              `Type: Int`
- `Field 3`: Condition          `Type: String`
- `Field 4`: Description             `Type: String`
- `Field 3`: Tags         `Type: [String]`
- `Field 4`: Reviews              `Type: [reviewSchema]`


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
    reviews: [reviewSchema]
});


var userSchema = new mongoose.Schema({

});


}
```

### 2. Add New Data

Products

HTML form route: `/productForm`
POST endpoint route: `/products`

Reviews

HTML form route: `/products/:id/reviewForm`
POST endpoint route: `/products/:id/postReview`


Example Node.js POST request to endpoint: 
```javascript
var request = require("request");

var options = { 
    method: 'POST',
    url: 'http://localhost:8000/products',
    headers: { 
        'content-type': 'application/x-www-form-urlencoded' 
    },
    form: { 
        name: 'Cupcake', 
        breed: 'German Shepherd',
        image: "http://i.imgur.com/iGLcfkN.jpg",
        age: 6
        characteristics: ["Brown", "Black", "Sleepy", "Lazy"]
    } 
};

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});
```

### 3. View Data

GET endpoint route: `/products`


### 4. Navigation Pages

Navigation Filters
1. Review Form -> `/reviewForm`
2. Create Product -> `/productForm`
3. Tag -> `/tag/:tag`
4. List of products -> `/products`
5. Profile -> `/profile:id`
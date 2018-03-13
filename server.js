// Require the Express Module
var express = require('express');

// Require the Mongoose Module
var mongoose = require('mongoose');

// Create an Express App
var app = express();

// Require body-parser (to receive post data from clients)
var bodyParser = require('body-parser');

// Integrate body-parser with our App
app.use(bodyParser.urlencoded({ extended: true }));

// Require path
var path = require('path');

// Setting our Static Folder Directory
app.use(express.static(path.join(__dirname, './static')));

// Setting our Views Folder Directory
app.set('views', path.join(__dirname, './views'));

// Setting our View Engine set to EJS
app.set('view engine', 'ejs');

mongoose.connect('mongodb://localhost/bird_dashboard');

var UserSchema = new mongoose.Schema({
    name:  { type: String, required: true, minlength: 3},
    breed: { type: String, required: true, minlength: 3 }
}, {timestamps: true });

mongoose.model('Bird', UserSchema);

var Bird = mongoose.model('Bird');

// Routes
// Root Request
app.get('/', function(req, res){
    Bird.find({}, function(err, birds) {
        if(err) {
            console.log(err)
            console.log('something went wrong');
        } else { // else console.log that we did well and then redirect to the root route
            res.render('index', { birds: birds });
        }
    });
});

app.get('/birds/new', function(req, res){
    res.render('new');
});

// Should be the action attribute for the form in the above route (GET '/birds/new').
app.post('/birds', function(req, res) {
    console.log(req.body)
    var bird = new Bird({name: req.body.name, breed: req.body.breed});

    bird.save(function(err) {
        // if there is an error console.log that something went wrong!
        if(err) {
            console.log('something went wrong');
            res.render('new', {errors: bird.errors, name: req.body.name, breed: req.body.breed})
        } else { // else console.log that we did well and then redirect to the root route
            console.log('successfully added a new birds!');
            res.redirect('/');
        }
    });
});

app.get('/birds/destroy/:id', function(req, res){
    Bird.remove({ _id: req.params.id }, function(err) {
        if(err){
            console.log('something went wrong');
            message.type = 'notification!';
        }else{
            console.log('successfully deleted bird!');
            res.redirect('/');
        }
    });
});

app.get('/birds/edit/:id', function(req, res){
    Bird.findById(req.params.id, function(err, bird) {
        if(err) {
            console.log(err)
            console.log('something went wrong');
        } else { // else console.log that we did well and then redirect to the root route
            // console.log(bird)
            res.render('edit', bird);
        }
    });
});

app.post('/birds/:id', function(req, res){
    var query = {'_id': req.params.id};
    Bird.findOneAndUpdate(query, { name: req.body.name, breed: req.body.breed }, {upsert:true, new: true}, function(err, bird){
        if(err) {
            console.log(err)
            console.log('something went wrong');
        } else { // else console.log that we did well and then redirect to the root route
            console.log(bird)
            bird.updated = true;
            //res.render('info', bird);
            res.redirect('/birds/'+bird._id);
        }
    });
});

app.get('/birds/:id', function(req, res){
    Bird.findById(req.params.id, function(err, bird) {
        if(err) {
            console.log(err)
            console.log('something went wrong');
        } else { // else console.log that we did well and then redirect to the root route
            // console.log(bird)
            res.render('info', bird);
        }
    });
});

// Setting our Server to Listen on Port: 8000
app.listen(8000, function() {
    console.log("listening on port 8000");
});
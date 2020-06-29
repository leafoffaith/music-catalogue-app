const express            = require('express'),
      app                = express(),
      mongoose           = require('mongoose'),
      bodyParser         = require('body-parser')

//APP CONFIG          
mongoose.connect('mongodb://localhost:27017/music_cata_app', {useNewUrlParser: true, useUnifiedTopology: true});
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));


//MODEL CONFIG
let cataSchema = new mongoose.Schema({
    title: String,
    artist: String,
    body: String,
});

let Catalog = mongoose.model('Catalog', cataSchema);

// let George = new Catalog ({
//     title: "All things must pass",
//     artist: "George Harrison",
//     body: "This is an album"
// });
// George.save();


//ROUTES
app.get('/', (req, res) => {
    res.redirect('/albums');
});

app.get('/albums', (req, res) => {
        Catalog.find({}, function(err, catalogs){
            if(err){
                console.log("ERROR!");
            } else {
               res.render("index", {catalogs: catalogs}); 
            }
        });
}); 

//NEW ALBUM
app.get('/albums/new', (req, res) => {
    res.render("new");
});

//POST ROUTE
app.post('/albums', (req, res) =>  {
    console.log(req.body);
    Catalog.create(req.body.catalog, (err, newCatlog) => {
        if(err){
            res.render('/albums/new');
        }
        else{
            res.redirect('/albums');
        }
    });
});

//SHOW
app.get('albums/:id', (req, res) =>{
    Catalog.findById(req.params.id, (err, foundCatalog) => {
        if(err){
            res.redirect('/albums');
        }
        else{
            res.render('show', {catalog: foundCatalog});
        }
    });
});

//PORT
const port = process.env.PORT || 3000;

app.listen(port, () =>{
    console.log(`Now listening on Port: ${port}`);
})
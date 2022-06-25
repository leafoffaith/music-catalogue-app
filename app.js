// const { authenticate } = require('passport');

const express            = require('express'),
      app                = express(),
      mongoose           = require('mongoose'),
      bodyParser         = require('body-parser'),
      expressSanitizer   = require('express-sanitizer'),
      methodOverride     = require('method-override')
    //   passport           = require('passport'),
    //   LocalSrategy       = require('passport-local'),
    //   User               = require('./models/users');

//APP CONFIG          
mongoose.connect('mongodb+srv://blunder:lololxd1@crudclust-gc08c.mongodb.net/<dbname>?retryWrites=true&w=majority', { 
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useFindAndModify: false
    }).then(() => {
        console.log('Connected to DB!')
    }).catch(err => {
        console.log('ERROR', err.message);
    })

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(express.static("public"));
app.use(methodOverride("_method"));

//PASSPORT CONFIG
// app.use(require("express-session")({
//     secret: "Nico wins cutest dog!",
//     resave: false,
//     saveUnititialized: false,
//     cookie: { secure: true }
// }));
// app.use(passport.initialize());
// app.use(passport.session());
// passport.use(new LocalSrategy(User.authenticate()));
// passport.serializeUser(User.serializeUser());
// passport.serializeUser(User.deserializeUser());

//MODEL CONFIG
let cataSchema = new mongoose.Schema({
    title: String,
    artist: String,
    body: String,
    art: String
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
app.get('/albums/new',(req, res) => {
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
app.get('/albums/:id', (req, res) =>{
    Catalog.findById(req.params.id, (err, foundCatalog) => {
        if(err){
            res.redirect('/albums');
        }
        else{
            res.render('show', {catalog: foundCatalog});
        }
    });
});

//EDIT
app.get('/albums/:id/edit', (req, res) => {
    Catalog.findById(req.params.id, (err, foundCatalog) => {
        if(err){
            res.redirect('/albums');
        }
        else{
            res.render('edit', {catalog: foundCatalog})
        }
    });
});

//UPDATE ROUTE
app.put('/albums/:id', (req, res) => {
    req.body.catalog.body = req.sanitize(req.body.catalog.body);
    console.log(req.body.catalog);
    console.log(req.params.id);
    console.log("===================")
    Catalog.findByIdAndUpdate(req.params.id, req.body.catalog, (err, updated) => {
        if(err){
            console.log(err);
            console.log("===============");
            res.redirect('/albums');
        }
        else{
            res.redirect("/albums/"+ req.params.id);
        }
    });
});

//DELETE ROUTE
app.delete('/albums/:id' , (req, res) => {
    Catalog.findByIdAndRemove(req.params.id, (err, removed) => {
        if(err){
            console.log(err);
            console.log(req.params.body);
            console.log("==============");
            res.redirect('/albums');
        }
        else{
            res.redirect('/albums');
        }
    });
});

//===========
//AUTH ROUTES
//===========

// //Show register form
// app.get('/register',(req, res) => {
//     res.render('register');
// })

// //SIGN UP
// app.post('/register', (req, res) => {
//     let newUser = new User({username: req.body.username});
//     User.register(newUser, req.body.password, (err, user) => {
//         if(err){
//             console.log(err);
//             return res.redirect("register")
//         }
//         passport.authenticate("local")(req, res, () => {
//             res.redirect('/albums')
//         })
//     })
   
// });

// //SHOW LOGIN
// app.get("/login", (req, res) => {
//     res.render('login')
// })
// //handling login logic
// app.post('/login', passport.authenticate("local", {
//     successRedirect: "/albums",
//     failureRedirect: "/login"
// }), (req, res) => {    
// })

// //LOGOUT ROUTE
// app.get("/logout", (req, res) => {
//     req.logout();
//     res.redirect("/albums")
// })

// function isLoggedIn(req, res, next){
//     if(req.isAuthenticated()){
//         return next();
//     }
//     res.redirect("/login")
// }

//PORT
const port = process.env.PORT || 3000;

app.listen(port, () =>{
    console.log(`Now listening on Port: ${port}`);
})

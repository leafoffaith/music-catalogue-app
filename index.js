    // const { authenticate } = require('passport');

    const { request, response, application } = require('express');
    require('dotenv').config();
    const express = require('express'),
        app = express(),
        mongoose = require('mongoose'),
        bodyParser = require('body-parser'),
        expressSanitizer = require('express-sanitizer'),
        methodOverride = require('method-override'),
        queryString = require('query-string'),
        axios = require('axios')
    
    //FOR SPOTIFY
    const CLIENT_ID = process.env.CLIENT_ID;
    const CLIENT_SECRET = process.env.CLIENT_SECRET;
    const REDIRECT_URI = process.env.REDIRECT_URI;
    const FRONTEND_URI = process.env.FRONTEND_URI;
    const PORT = process.env.PORT || 8888;

    const path = require('path');

    
    // mongo auth stored in client/src/env file
    //APP CONFIG          
    mongoose.connect(process.env.MONGO_AUTH, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    }).then(() => {
        console.log('Connected to DB!')
    }).catch(err => {
        console.log('ERROR', err.message);
    })

    app.set('view engine', 'ejs');
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(expressSanitizer());
    app.use(express.static("public"));
    app.use(methodOverride("_method"));

    //===================================================================================

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

    // //MODEL CONFIG
    // let cataSchema = new mongoose.Schema({
    //     title: String,
    //     artist: String,
    //     body: String,
    //     art: String
    // });

    // let Catalog = mongoose.model('Catalog', cataSchema);

    //
    /**
     * @param {number} length The length of the string
     * @return {string}
     */
    // const characters = 

    const generateRandomString = length => {
        let text = '';
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    };

    const stateKey = 'spotify_auth_state'

    //ROUTES
    app.get('/', (req, res) => {
        res.redirect('/login');
        // res.send('hello')
    });


    app.get('/login', (req, res) => {

        const state = generateRandomString(16);
        const scope = 'user-read-private user-read-email user-top-read';

        res.cookie(stateKey, state)
        queryParams = queryString.stringify({
            client_id: CLIENT_ID,
            response_type: 'code',
            redirect_uri: REDIRECT_URI,
            state: state,
            scope: scope
        })

        res.redirect(`https://accounts.spotify.com/authorize?${queryParams}`)

    })

    app.get('/callback', (req, res) => {
        const code = req.query.code || null;
        // const state = req.query.state || null;
        // const storedState = req.cookies ? req.cookies[stateKey] : null;

        // console.log(code)
        axios({
                method: 'post',
                url: 'https://accounts.spotify.com/api/token',
                data: queryString.stringify({
                    grant_type: 'authorization_code',
                    code: code,
                    redirect_uri: REDIRECT_URI
                }),
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Basic ' + (new Buffer(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'))
                },
                json: true
            })
            .then(response => {
                if (response.status === 200) {
                    // console.log(response)
                    const { access_token, refresh_token, expires_in } = response.data;

                    const queryParams = queryString.stringify({
                        access_token,
                        refresh_token,
                        expires_in
                    })

                    console.log(access_token)
                    console.log("==================")
                    console.log(refresh_token)
                    console.log("==================")
                    
                    // res.write("hellooo")
                    //rerdirect to react app
                    // res.redirect(`http://localhost:3000/?${queryParams}`)
                    res.redirect(`${FRONTEND_URI}/?${queryParams}`);
                
                } else {

                    res.redirect(`/?${queryString.string({ error: 'invalid_token' })}`)

                    // res.send(response) 
                }
            })
            .catch(error => {
                // res.send(err)
                if (error.response) {
                    console.log(error.response.data)
                    res.send(error)
                }
            });

    })

    //REFRESH TOKEN
    app.get('/refresh_token', (req, res) => {
        const { refresh_token } = req.query;

        axios({
            method: 'post',
            url: 'https://accounts.spotify.com/api/token',
            data: queryString.stringify({
                grant_type: 'refresh_token',
                code: refresh_token,
                // redirect_uri: REDIRECT_URI
            }),
            headers: {
                'Authorization': 'Basic ' + (new Buffer(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'))
            },
            json: true
        })
    })


    app.get('/trending', (req, res) => {
            console.log('you have reached the trending page')
            res.send("THIS IS THE TRENDING PAGE YAY!");
        })

    app.get('/albums', (req, res) => {
        Catalog.find({}, function(err, catalogs) {
            if (err) {
                console.log("ERROR!");
            } else {
                res.render("index", { catalogs: catalogs });
            }
        });
    });

    //NEW ALBUM
    app.get('/albums/new', (req, res) => {
        res.render("new");
    });

    //POST ROUTE
    app.post('/albums', (req, res) => {
        // console.log(req.body);
        const item = new Catalog({
                title: req.body.title,
                artist: req.body.artist,
                body: req.body.postBody,
                art: req.body.art
            })
        try {
            console.log(item)
            item.save()
            res.redirect('/')
        } catch (err) {
            console.log(item)
            if (err) console.log(err)
            res.redirect('/')
        }
    });

    //SHOW
    app.get('/albums/:id', (req, res) => {
        Catalog.findById(req.params.id, (err, foundCatalog) => {
            if (err) {
                res.redirect('/albums');
            } else {
                res.render('show', { catalog: foundCatalog });
            }
        });
    });

    //EDIT
    app.get('/albums/:id/edit', (req, res) => {
        Catalog.findById(req.params.id, (err, foundCatalog) => {
            if (err) {
                res.redirect('/albums');
            } else {
                res.render('edit', { catalog: foundCatalog })
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
            if (err) {
                console.log(err);
                console.log("===============");
                res.redirect('/albums');
            } else {
                res.redirect("/albums/" + req.params.id);
            }
        });
    });

    //DELETE ROUTE
    app.delete('/albums/:id', (req, res) => {
        Catalog.findByIdAndRemove(req.params.id, (err, removed) => {
            if (err) {
                console.log(err);
                console.log(req.params.body);
                console.log("==============");
                res.redirect('/albums');
            } else {
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
    const port = 8888;

    app.listen(port, () => {
        console.log(`Now listening on Port: ${port}`);
    })

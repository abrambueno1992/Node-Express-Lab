// import your node modules
const express = require('express');
// const bodyParser = require('body-parser');
const helmet = require('helmet'); // 1 yarn add helment || npm i helmet // 2

const db = require('./data/db.js');

const server = express();
server.use(express.json());
server.use(helmet()); // 3

// server.use(bodyParser.json());


// GET GET

server.get('/',(req,res) => {
    res.send('Api is running');
});

server.get('/api/posts',(req,res) => {
   
    db.find().then(posts => {
        res.json(posts);
    }).catch(err => {
        //do something with the error
        res.status(500).json({error: "The posts information could not be retrieved." });
    })
    //return the posts
});

//POST POST

server.post('/api/posts/', (req,res) => {
    // const post = req.params.post;
    const post = req.body;
   
    db.insert(post).then(posts => {
        if (posts.title === "" || posts.content === "") {
            res.status(400).json({errorMessage: "Please provide title and contents for the post."});
        } else {
            res.status(201).json(posts);

        }
        
    }).catch(err => {
        res.status(500).json({error: "There was an error while saving the post to the database"});
    })
    
});

//api/posts/2
// GET:ID  GET:ID
server.get('/api/posts/:id',(req,res) => {

    const id = req.params.id;
    db.findById(id).then(posts => {
        if (posts[0].id === undefined) {
            res.status(404).json({message: "The post with the specified ID does not exist." });
        } else {
            res.json(posts[0]);

        }
    }).catch(err => {
        res.status(500).json({error: "The post information could not be retrieved."});

    })
});


// PUT PUT
server.put('/api/posts/:id', (req,res) => {
    const id = req.params.id;
    const post = req.body;
    console.log("id: ", id);
    console.log('post: ', post);
    db.update(id, post).then(posts => {
        if (id === undefined) {
            res.status(404).json({message: "The post with the specified ID does not exist." });
        } else if (posts.title === "" || posts.content === "") {
            res.status(400).json({ errorMessage: "Please provide title and contents for the post."})
        } else {
            res.status(200).json(posts);

        }
    }).catch(err => {
        //do something with the error
        res.status(500).json({error: "The post information could not be modified." });

    })
});



server.delete('/api/posts/:id', (req,res) => {
    // const {id} = req.query;
    console.log('req.body: ', req.body);

    // const title = req.body.title;
    const id = req.params.id;
    let user;
    
    db
        .findById(id)
        .then(foundUser => {
            user = { ...foundUser[0] };
        })
            db.remove(id).then(posts => {
        if (user.id === undefined) {
            res.status(404).json({message: "The post with the specified ID does not exist."});
        } else {
            console.log('user: ', user);
            res.json(user);

        };
    }).catch(err => {
        // res.status(500).json({error: "The post could not be removed" });

    })
});

server.listen(5000, () => console.log('\n== API Running on port 5000 ==\n'))
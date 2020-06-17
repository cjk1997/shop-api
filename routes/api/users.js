const express = require('express');
const Router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { 
    getUserByValue,
    registerUser,
    getWishlist,
    updateWishlist,
    getCart,
    updateCart,
} = require('../../data/users');

const salt = process.env.SALT;
const privateKey = process.env.PRIVATE_KEY;

Router.post('/login', async function(req, res) {
    try {
        const body = req.body;
        const user = await getUserByValue('email', body.email);
        if (user.length === 0) {
            res.status(401).send("Login Failed");
            console.log("That user does not exist.");
        } else if (user.length > 1) {
            res.status(500).send("Login Failed");
            console.log("That user exists more than once.");
        } else {
            bcrypt.compare(body.password, user[0].password, function(err, result) {
                if (err) throw(err);
                if (!result) {
                    res.status(401).send("Login Failed");
                    console.log("Password is incorrect.")
                } else {
                    jwt.sign({ _id: user[0]._id },
                        privateKey,
                        { algorithm: 'HS512' },
                        function(err, token) {
                            if (err) throw(err);
                            console.log(body.email, token);
                            res.set('authentication', token);
                            delete user[0].password;
                            // console.log("user[0]", user[0])
                            // res.set('user', JSON.stringify(user[0]));
                            console.log("user[0]", user[0])
                            res.set('Access-Control-Expose-Headers', 'authentication, admin, user');
                            if (body.email === 'admin@admin.com') res.set('admin', 'admin');
                            res.send(user[0]);
                        }
                    );
                };
            });
        };
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal server issues, check logs.");
    };
});

Router.post('/register', function(req, res) {
    try {
        const saltRounds = +salt;
        const body = req.body;
        const plaintextPassword = body.password;
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if (err) throw(err);
            bcrypt.hash(plaintextPassword, salt, async function(err, hash) {
                if (err) throw(err);
                body.password = hash;
                const user = await registerUser(req.body);
                console.log("user in Register", user)
                jwt.sign({ _id: user._id },
                    privateKey,
                    { algorithm: 'HS512' },
                    function(err, token) {
                        if (err) throw(err);
                        console.log(body.email, token);
                        res.set('authentication', token);
                        delete user.password;
                        res.set('Access-Control-Expose-Headers', 'authentication, admin, user');
                        res.send(user);
                    }
                );
            });
        });
    } catch {
        console.log(err);
        res.status(500).send("Internal server issues, check logs.");
    };
});

Router.get('/wishlist/:id', async function(req, res) {
    try {
        const data = await getWishlist(req.params.id);
        if (data[0].cart) {
            const userWishlist = data[0].wishlist;
            res.send(userWishlist);
        };
    } catch {
        console.log(err);
        res.status(500).send("Internal server issues, check logs.");
    };
});

Router.patch('/wishlist/update/:id', async function(req, res) {
    try {
        const data = await updateWishlist(req.params.id, req.body);
        res.send(data);
    } catch {
        console.log(err);
        res.status(500).send("Internal server issues, check logs.");
    };
});

Router.get('/cart/:id', async function(req, res) {
    try {
        const data = await getCart(req.params.id);
        if (data[0].cart) {
            const userCart = data[0].cart;
            res.send(userCart);
        };
    } catch {
        console.log(err);
        res.status(500).send("Internal server issues, check logs.");
    };
});

Router.patch('/cart/update/:id', async function(req, res) {
    try {
        const data = await updateCart(req.params.id, req.body);
        // console.log("data inside cart router", data)
        res.send(data);
    } catch {
        console.log(err);
        res.status(500).send("Internal server issues, check logs.");
    };
});

module.exports = Router;
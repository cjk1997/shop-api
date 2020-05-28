const express = require('express');
const Router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { 
    getUserByValue,
    registerUser,
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
                            res.set('authentication', token);
                            res.send();
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
                const data = await registerUser(req.body);
                res.send(data);
            });
        });
    } catch {
        console.log(err);
        res.status(500).send("Internal server issues, check logs.");
    };
});

module.exports = Router;
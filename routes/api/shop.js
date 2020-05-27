const express = require('express');
const Router = express.Router();
const {
    getInventory,
} = require('../../data/shop');

Router.get('/', async function(req, res, next) {
    try {
        const data = await getInventory();
        res.send(data);
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal server issues, check logs.");
    };
});

module.exports = Router;
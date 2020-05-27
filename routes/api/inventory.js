const express = require('express');
const Router = express.Router();
const {
    getInventory,
    updateInventoryItem,
    updateQuantity,
} = require('../../data/inventory');

Router.get('/', async function(req, res, next) {
    try {
        const data = await getInventory();
        res.send(data);
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal server issues, check logs.");
    };
});

Router.put('/:id', async function(req, res, next) {
    try {
        const data = await updateInventoryItem(req.params.id, req.body);
        res.send(data);
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal server issues, check logs.")
    }
})

Router.patch('/quantity/:id', async function(req, res, next) {
    try {
        const data = await updateQuantity(req.params.id, req.body);
        res.send(data);
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal server issues, check logs.");
    };
});

module.exports = Router;
const express = require('express');
const Router = express.Router();
const {
    getInventory,
    getItem,
    addInventoryItem,
    updateInventoryItem,
    updateQuantity,
    deleteInventoryItem
} = require('../../data/inventory');

Router.get('/:id', async function(req, res, next) {
    if (!req.params.id) {
        next('route');
    }
    try {
        const data = await getItem(req.params.id);
        res.send(data);
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal server issues, check logs.");
    };
});

Router.get('/', async function(req, res, next) {
    try {
        const data = await getInventory();
        res.send(data);
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal server issues, check logs.");
    };
});

Router.post('/', async function(req, res, next) {
    try {
        const data = await addInventoryItem();
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
    };
});

Router.patch('/quantity/:id', async function(req, res, next) {
    try {
        const data = await updateQuantity(req.params.id, req.body);
        res.send(data);
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal server issues, check logs.");
    };
});

Router.delete('/:id', async function(req, res, next) {
    try {
        const data = await deleteInventoryItem(req.params.id);
        res.send(data);
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal server issues, check logs.");
    };
});

module.exports = Router;
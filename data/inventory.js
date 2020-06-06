const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

const url = process.env.DB_URL;

const dbName = 'shop';
const inventoryCol = 'inventory';

const settings = { useUnifiedTopology : true };

const getInventory = () => {
    const iou = new Promise((resolve, reject) => {
        MongoClient.connect(url, settings, function(err, client) {
            if (err) {
                reject(err);
            } else {
                console.log("Connected to server to retrieve inventory.");
                const db = client.db(dbName);
                const collection = db.collection(inventoryCol);
                collection.find({}).toArray(function(err, result) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                        client.close();
                    };
                });
            };
        });
    });
    return iou;
};

const getItem = (id) => {
    const iou = new Promise((resolve, reject) => {
        MongoClient.connect(url, settings, function(err, client) {
            if (err) {
                reject(err);
            } else {
                console.log("Connected to server to retrieve item.");
                const db = client.db(dbName);
                const collection = db.collection(inventoryCol);
                collection.find(ObjectID(id)).toArray(function(err, result) {
                    if (err) {
                        reject(err);
                    } else {
                        console.log(result);
                        resolve(result);
                        client.close();
                    };
                });
            };
        });
    });
    return iou;
};

const addInventoryItem = (inventoryItem) => {
    const iou = new Promise((resolve, reject) => {
        MongoClient.connect(url, settings, function(err, client) {
            if (err) {
                reject(err);
            } else {
                console.log("Connected to server to add inventory item.");
                const db = client.db(dbName);
                const collection = db.collection(inventoryCol);
                collection.insertOne(inventoryItem, function(err, result) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result.ops[0]);
                        client.close();
                    };
                });
            };
        });
    });
    return iou;
};

const updateInventoryItem = (id, inventoryItem) => {
    const iou = new Promise((resolve, reject) => {
        MongoClient.connect(url, settings, function(err, client) {
            if (err) {
                reject(err);
            } else {
                console.log("Connected to server to updated inventory item.");
                const db = client.db(dbName);
                const collection = db.collection(inventoryCol);
                collection.replaceOne({ _id: ObjectID(id) },
                inventoryItem,
                { upsert: true },
                (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve({ updatedID: _id });
                        client.close();
                    };
                });
            };
        });
    });
    return iou;
};

const updateQuantity = (id, newQuantity) => {
    const iou = new Promise((resolve, reject) => {
        MongoClient.connect(url, settings, function(err, client) {
            if (err) {
                reject(err);
            } else {
                console.log("Connected to server to update item quantity.")
                const db = client.db(dbName);
                const collection = db.collection(inventoryCol);
                collection.updateOne({ _id: ObjectID(id)},
                { $set: { quantity: newQuantity } },
                function(err, result) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                        client.close();
                    };
                });
            };
        });
    });
    return iou;
};

const deleteInventoryItem = (id) => {
    const iou = new Promise((resolve, reject) => {
        MongoClient.connect(url, settings, function(err, client) {
            if (err) {
                reject(err);
            } else {
                console.log("Connect to server to delete inventory item.");
                const db = client.db(dbName);
                const collection = db.collection(inventoryCol);
                collection.deleteOne({ _id : ObjectID(id) }, function(err, result) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve({ deletedID: id });
                        client.close();
                    };
                });
            };
        });
    });
    return iou;
};

module.exports = {
    getInventory,
    getItem,
    addInventoryItem,
    updateInventoryItem,
    updateQuantity,
    deleteInventoryItem
};
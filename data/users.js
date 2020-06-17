const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

const url = process.env.DB_URL;

const dbName = 'shop';
const usersCol = 'users';

const settings = { useUnifiedTopology: true };

const getUserByValue = (key, value) => {
    const iou = new Promise((resolve, reject) => {
        MongoClient.connect(url, settings, function(err, client) {
            if (err) {
                reject(err);
            } else {
                console.log("Connected to server to get user.");
                const db = client.db(dbName);
                const collection = db.collection(usersCol);
                collection.find({ [key]: value }).toArray(function(err, result) {
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

const registerUser = (user) => {
    const iou = new Promise((resolve, reject) => {
        MongoClient.connect(url, settings, function(err, client) {
            if (err) {
                reject(err);
            } else {
                console.log("Connected to server to add user.");
                const db = client.db(dbName);
                const collection = db.collection(usersCol);
                collection.insertOne(user, (err, result) => {
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

const getWishlist = (id) => {
    const iou = new Promise((resolve, reject) => {
        MongoClient.connect(url, settings, function(err, client) {
            if (err) {
                reject(err);
            } else {
                console.log("Connected to server to get wishlist.");
                const db = client.db(dbName);
                const collection = db.collection(usersCol);
                collection.find({ _id: ObjectID(id) }).toArray(function(err, result) {
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

const updateWishlist = (id, wishlistItems) => {
    const iou = new Promise((resolve, reject) => {
        MongoClient.connect(url, settings, function(err, client) {
            if (err) {
                reject(err);
            } else {
                console.log("Connected to server to update wishlist.")
                const db = client.db(dbName);
                const collection = db.collection(usersCol);
                collection.updateOne({ _id : ObjectID(id)}, 
                { $set: { wishlist: wishlistItems } },
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

const getCart = (id) => {
    const iou = new Promise((resolve, reject) => {
        MongoClient.connect(url, settings, function(err, client) {
            if (err) {
                reject(err);
            } else {
                const db = client.db(dbName);
                const collection = db.collection(usersCol);
                collection.find({ _id: ObjectID(id) }).toArray(function(err, result) {
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

const updateCart = (id, cartItems) => {
    const iou = new Promise((resolve, reject) => {
        MongoClient.connect(url, settings, function(err, client) {
            if (err) {
                reject(err);
            } else {
                console.log("Connected to server to update cart.")
                const db = client.db(dbName);
                const collection = db.collection(usersCol);
                collection.updateOne({ _id : ObjectID(id)}, 
                { $set: { cart : cartItems } },
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

module.exports = {
    getUserByValue,
    registerUser,
    getWishlist,
    updateWishlist,
    getCart,
    updateCart,
};
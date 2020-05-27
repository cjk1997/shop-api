const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

const url = process.env.DB_URL;

dbName = 'shop';
inventoryCol = 'inventory';

const settings = { useUnifiedTopology : true };

const getInventory = () => {
    const iou = new Promise((resolve, reject) => {
        MongoClient.connect(url, settings, async function(err, client) {
            if (err) {
                reject(err);
            } else {
                console.log("Connected to server to retreive inventory.");
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

module.exports = {
    getInventory,
};
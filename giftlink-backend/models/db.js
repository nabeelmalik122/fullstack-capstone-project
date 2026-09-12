// db.js
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;

// MongoDB connection URL with authentication options to be changed later
let url = `${process.env.MONGO_URL}`;

let dbInstance = null;
const dbName = "giftdb";

async function connectToDatabase() {
    if (dbInstance != null) {
        return dbInstance;
    }

    const client = new MongoClient(url);      

    try {
        await client.connect();
        console.log("Connected successfully to database server");
        dbInstance = client.db(dbName);
        return dbInstance;
    } catch (e) {
        console.error("Failed to connect to MongoDB", e);
        throw e;
    }
}

module.exports = connectToDatabase;

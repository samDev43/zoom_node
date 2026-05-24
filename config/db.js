// const mongoose = require("mongoose");
// const envObj = require("./env");
// const express = require("express");

// const app = express();

// const connectDB = async () => {    
//     console.log(envObj.PORT);
    
//     try {   
//         const conn = await mongoose.connect(envObj.MONGODBURL);
//         console.log(`MongoDB Connected: ${conn.connection.host}`);
//     }catch (error){
//         console.log("Error connecting to database: ", error);   
//     }
// }

// module.exports = connectDB;

const mongoose = require("mongoose");
const envObj = require("./env");

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(envObj.MONGODBURL).then((mongoose) => {
            return mongoose;
        });
    }

    cached.conn = await cached.promise;
    return cached.conn;
}

module.exports = connectDB;
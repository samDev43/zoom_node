
const dotenv = require("dotenv");
dotenv.config();

const envObj = {
    MONGODBURL: process.env.MONGODB_URL,
    SECRET_KEY: process.env.SECRET_KEY,
    PORT: process.env.PORT,
}

module.exports = envObj;




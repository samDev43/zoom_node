const cors = require('cors');
const express = require('express');
const app = express();
const connectDB = require('./config/db')
const signupRoute = require("./route/authRoute");
const actionRoute = require("./route/actionauth");
const envObj = require("./config/env");

app.use(express.json());
app.use(cors(
    {
        origin: [
            "http://localhost:5173",
            "https://zoom-react-three.vercel.app"
        ],
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true
    }
));

app.use('/api/auth/action', actionRoute);
app.use('/api/auth', signupRoute);
connectDB();

module.exports = app;


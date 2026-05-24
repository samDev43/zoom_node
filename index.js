const cor = require('cors');
const express = require('express');
const app = express();
const connectDB = require('./config/db')
const signupRoute = require("./route/authRoute");
const actionRoute = require("./route/actionauth");
const envObj = require("./config/env");

app.use(express.json());
app.use(cor(
    {
        origin: "http://localhost:5173",
        methods: ["GET,POST,PUT, DELETE"],
        credentials: true
    }
));

app.use('/api/auth/action', actionRoute);
app.use('/api/auth', signupRoute);
connectDB();
app.listen(envObj.PORT, () => {
    console.log(`Server is running on port ${envObj.PORT}`);
});



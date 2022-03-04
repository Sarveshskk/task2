require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/users");
const registerRoute = require("./routes/usersRoute");

try {
    mongoose.connect("mongodb://localhost:27017/users");
    console.log("connected to db");
} catch (error) {
    handleError(error);
}
process.on('unhandledRejection', error => {
    console.log('unhandledRejection', error.message);
});

const app = express();
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/user", registerRoute);

app.listen(3000, () => {
    console.log("server running...")
});

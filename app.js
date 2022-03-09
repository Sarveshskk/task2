require("dotenv").config();
const dbConnect = require("./controller/network")
const express = require("express");
const registerRoute = require("./routes/usersRoute");
const session = require('express-session');
const passport = require('passport');
const strategy = require("./middleware/passport-auth");

dbConnect();
const app = express();
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/user", registerRoute);
app.use(session({ 
    secret: 'this is secret', 
    resave: false, 
    saveUninitialized: false 
}));
app.use(passport.initialize());
app.use(passport.session());
strategy();

app.listen(3000, () => {
    console.log("server running...")
});

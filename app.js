require("dotenv").config();
const dbConnect = require("./db")
const express = require("express");
const route = require("./routes");
const session = require('express-session');
const passport = require('passport');
const passportStrategy = require("./middleware/passport-auth");

dbConnect();
const app = express();
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/user", route.userRoute);
app.use("/address", route.addressRoute);
passportStrategy(passport);
app.use(session({ 
    secret: 'this is secret', 
    resave: false, 
    saveUninitialized: false 
}));
app.use(passport.initialize());
app.use(passport.session());


app.listen(3000, () => {
    console.log("server running...")
});
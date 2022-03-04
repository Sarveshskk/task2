require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const md5 = require("md5");
const User = require("./models/users");
var jwt = require('jsonwebtoken');

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
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.post("/user/register", (req, res) => {
    try {
        if (req.body.password == req.body.cnfpassword) {
            const user = new User({
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                email: req.body.email,
                username: req.body.username,
                password: md5(req.body.password),
            })
            user.save();
            res.send("user created");
        } else {
            res.send("user not created");
        }
    }
    catch (e) {
        console.log(e);
    }

});
app.post("/user/login", (req, res) => {
    let username = req.body.username
    let password = md5(req.body.password)

    User.findOne({ username: username }, (err, foundUser) => {
        if (err) {
            console.log(err);
        } else {
            if (foundUser) {
                if (foundUser.password === password) {
                    const token = jwt.sign(
                        { id: foundUser._id },
                        process.env.TOKEN_KEY,
                        {
                            expiresIn: 60000,
                        }
                    );
                    res.status(200).send({ jwtoken: token });
                }
            } else {
                res.status(500).send("user not found");
            }
        }
    })
});
app.get("/user/get", (req, res) => {
    let token = req.headers['jwtoken'];
    const user = jwt.verify(token, process.env.TOKEN_KEY);
    res.send(user);

});
app.get("/user/list/:page", async (req, res) => {
    try {
        let page = req.params["page"];
        let size = 10;
        let skipPage = (page - 1) * size;
        // console.log(skipPage);
        const result = await User.find().sort().skip(skipPage).limit(size);
        res.send(result);
    }
    catch (error) {
        res.sendStatus(500);
    }
});
app.put("/user/delete", (req, res) => {
    let token = req.headers['jwtoken'];
    const user = jwt.verify(token, process.env.TOKEN_KEY);
    User.findOneAndDelete({ _id: user["id"] }, (err) => {
        if (err) {
            console.log(err);
        } else {
            res.send("user deleted");
        }
    });

})
app.listen(3000, () => {
    console.log("server running...")
});

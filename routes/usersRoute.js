const express = require("express");
const User = require("../models/users");
const md5 = require("md5");
const jwt = require('jsonwebtoken');
const verifyToken = require("../middleware/auth");
let router = express.Router(),
    {
        register,
        login
    } = require("../controller/controller");

router.post("/register", register);
router.post("/login", login);

router.get("/get", verifyToken, (req, res,) => {
    let user = req.user;
    console.log(user);
    if (user == null) {
        res.status(403)
            .send({
                message: "Invalid JWT token"
            });
    }
    else {
        res.send(user.id);
    }
});
router.delete("/delete", verifyToken, (req, res) => {
    let user = req.user;
    if (user == null) {
        res.status(403)
            .send({
                message: "Invalid token"
            });
    }
    else {
        User.findOneAndDelete({ _id: user["id"] }, (err) => {
            if (err) {
                console.log(err);
            } else {
                res.send("user deleted");
            }
        });
    }
});

router.get("/list/:page", async (req, res) => {
    try {
        let page = req.params["page"];
        let size = 10;
        let skipPage = (page - 1) * size;
        const result = await User.find().sort().skip(skipPage).limit(size);
        res.send(result);
    }
    catch (error) {
        handleError(error);
    }
    process.on('unhandledRejection', error => {
        console.log('unhandledRejection', error.message);
    });
});

router.post("/address", (req, res) => {
    try {
        if (req.body.password == req.body.cnfpassword) {
            const user = new User({
                user_id: req.body.user_id,
                address: req.body.address,
                city: req.body.city,
                state: req.body.state,
                pin_code: req.body.pin_code,
                phone_no: req.body.phone_no
            })
            user.save();
            res.send("user created");
        } else {
            res.send("user not created");
        }
    }
    catch (error) {
        handleError(error);
    }
    process.on('unhandledRejection', error => {
        console.log('unhandledRejection', error.message);
    });

});

module.exports = router;

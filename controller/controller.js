const express = require("express");
const router = express.Router();
const User = require("../models/users");
const md5 = require("md5");
const jwt = require('jsonwebtoken');


exports.register = (req, res) => {
    try {
        if (req.body.password == req.body.cnfpassword) {
            const user = new User({
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                email: req.body.email,
                username: req.body.username,
                password: md5(req.body.password),
            });
            user.save((err, user) => {
                if (err) {
                    res.status(500)
                        .send({
                            message: err
                        });
                    return;
                } else {
                    res.status(200)
                        .send({
                            message: "User Registered successfully"
                        });
                }
            });
        }
    }
    catch (error) {
        handleError(error);
      }
      process.on('unhandledRejection', error => {
        console.log('unhandledRejection', error.message);
      });
};

exports.login = (req, res) => {
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
                res.status(500).send("User not regestered.");
            }
        }
    })
};
const express = require("express");
const router = express.Router();
const User = require("../models/users");
const md5 = require("md5");
const jwt = require('jsonwebtoken');
// const Token = require("../models/token");
const Address = require("../models/address");
require("dotenv").config();


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
                // manually token created
                // const tokenData = md5(new Date())
                // const token = new Token({
                //     user_id: foundUser._id,
                //     access_token: tokenData,
                // });
                // token.save();
                // JWT token
                    const token = jwt.sign(
                        { id: foundUser._id },
                        process.env.TOKEN_KEY,
                        {
                            expiresIn: 60000,
                        }
                    );
                    res.status(200).send({ jwttoken: token });
                } else {
                    res.status(500).send("User password incorrect.");
                }
            } else {
                res.status(500).send("User not regestered.");
            }
        }
    })
};

exports.deleteUser = (req, res) => {
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
                res.send("user deleted successfully");
            }
        });
    }
};

exports.pagination = async (req, res) => {
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
};
exports.address = (req, res) => {
    try {
        let user = req.user;
        const address = new Address({
            user_id: req.body.user_id,
            address: req.body.address,
            city: req.body.city,
            state: req.body.state,
            pin_code: req.body.pin_code,
            phone_no: req.body.phone_no
        })
        address.save();
        let user_id = user["id"];
        User.findByIdAndUpdate(user_id, { $push: { address: address } }, (err, docs) => {
            if (err) {
                console.log(err)
            }
            else {
                res.send("user address updated")
            }
        });
    }
    catch (error) {
        handleError(error);
    }
    process.on('unhandledRejection', error => {
        console.log('unhandledRejection', error.message)
    });
}

exports.getData = (req, res) => {
    let user_id = req.params["id"];
    if (user_id == null) {
        res.status(403)
            .send({
                message: "Invalid token"
            });
    }
    else {
        User.find({_id:user_id}).populate("address").then(user => {
            res.json(user);
    })
}
}
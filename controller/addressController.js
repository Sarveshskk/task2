const express = require("express");
const router = express.Router();
const User = require("../models/users");
const md5 = require("md5");
const jwt = require('jsonwebtoken');
const Address = require("../models/address");
require("dotenv").config();

exports.address = async (req, res) => {
    try {
        console.log("hello");
        let user = req.user;
        const address = await new Address({
            user_id: req.body.user_id,
            address: req.body.address,
            city: req.body.city,
            state: req.body.state,
            pin_code: req.body.pin_code,
            phone_no: req.body.phone_no
        })
        address.save();
        let user_id = user["id"];
        await User.findByIdAndUpdate(user_id, { $push: { address: address } })
        res.send("user address updated");
    }
    catch (error) {
        handleError(error);
    }
    process.on('unhandledRejection', error => {
        console.log('unhandledRejection', error.message)
    });
}

exports.deleteAddress = async (req, res) => {
    try {
        let user = req.user;
        // console.log(user);
        if (user == null) {
            res.status(403)
                .send({
                    message: "Invalid token"
                });
        }
        else {
            let foundUser = await User.findOne({ _id: user["id"] })
            let addressIds = foundUser.address.map((c) => c._id);
            let userAddress = await Address.deleteMany({
                _id: {
                    $in: addressIds,
                }
            });
            if(!userAddress){
                res.send("address of the user data not deleted")
            }else{
                res.send("address of the user deleted successfully");
            }      
        }
    } catch (error) {
        handleError(error);
    }
    process.on('unhandledRejection', error => {
        console.log('unhandledRejection', error.message);
    });
};
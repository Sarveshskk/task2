const mongoose = require("mongoose");

const dbConnect = (req, res,next) => {
    try {
        mongoose.connect("mongodb://localhost:27017/users");
        console.log("connected to db");
    } catch (error) {
        handleError(error);
    }
    process.on('unhandledRejection', error => {
        console.log('unhandledRejection', error.message);
    });
};
module.exports = dbConnect;

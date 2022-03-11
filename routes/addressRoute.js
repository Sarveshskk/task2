const express = require("express");
const verifyToken = require("../middleware/verifyToken");

let addressRoute = express.Router(),
{
    address,
    deleteAddress
} = require("../controller/addressController");

addressRoute.post("/address",verifyToken, address);
addressRoute.delete("/address", verifyToken,deleteAddress);

module.exports = addressRoute;
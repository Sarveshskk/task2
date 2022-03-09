const express = require("express");
const passport = require("passport")
const verifyToken = require("../middleware/verifyToken");
const resetToken = require("../middleware/resetToken");

let router = express.Router(),
    {
        register,
        login,
        deleteUser,
        getData,
        pagination,
        address,
        deleteAddress,
        forgotPassword,
        resetPassword,
        imgUpload
    } = require("../controller/userController");

router.post("/register", register);
router.post("/login", login);
router.get("/get/:id", verifyToken, getData);
router.delete("/delete", verifyToken, deleteUser);
router.get("/list/:page",verifyToken, pagination);
router.post("/address",verifyToken, address);
router.delete("/address", verifyToken,deleteAddress);
router.post("/forgot-password", verifyToken,forgotPassword);
router.post("/verify-reset-password/:password-reset-token", resetToken,resetPassword);
router.delete("/profile-image", verifyToken, imgUpload);


module.exports = router;

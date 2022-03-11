const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const multerUploads = require("../middleware/multer")
const { registerValidateRules, registerValidate } = require("../Validator/registerValidator");
const {loginValidateRules,loginValidate} = require("../Validator/loginValidator");
const {resetPasswordValidateRules,resetPasswordValidate} = require("../Validator/resetPasswordValidate");

let router = express.Router(),
    {
        register,
        login,
        deleteUser,
        getData,
        pagination,
        forgotPassword,
        resetPassword,
        imgUpload
    } = require("../controller/userController");
router.post("/register",registerValidateRules(),registerValidate, register);
router.post("/login",loginValidateRules(),loginValidate, login);
router.get("/get/:id", verifyToken, getData);
router.delete("/delete", verifyToken, deleteUser);
router.get("/list/:page",verifyToken, pagination);
router.post("/forgot-password", forgotPassword);
router.post("/verifyResetPassword/:token",resetPasswordValidateRules(),resetPasswordValidate,resetPassword);
router.post("/profile-image", verifyToken,multerUploads.single("image"), imgUpload);

module.exports = router;

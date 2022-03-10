const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const multerUploads = require("../middleware/multer")

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
router.post("/verifyResetPassword/:token",resetPassword);
router.post("/profile-image", verifyToken,multerUploads.single("image"), imgUpload);

module.exports = router;

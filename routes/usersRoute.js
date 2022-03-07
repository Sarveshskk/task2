const express = require("express");

const verifyToken = require("../middleware/userAuth");
let router = express.Router(),
    {
        register,
        login,
        deleteUser,
        getData,
        pagination,
        address,
    } = require("../controller/userController");

router.post("/register", register);
router.post("/login", login);
router.get("/get/:id", verifyToken, getData);
router.delete("/delete", verifyToken, deleteUser);
router.get("/list/:page",verifyToken, pagination);
router.post("/address",verifyToken, address);

module.exports = router;

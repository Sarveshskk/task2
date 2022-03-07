require("dotenv").config();
const dbConnect = require("./controller/network")
const express = require("express");
const registerRoute = require("./routes/usersRoute");

dbConnect();
const app = express();
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/user", registerRoute);

app.listen(3000, () => {
    console.log("server running...")
});

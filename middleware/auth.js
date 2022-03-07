// const jwt = require("jsonwebtoken");
const User = require("../models/users");
const Token = require("../models/token");
// require("dotenv").config();
// const verifyToken = (req, res,next) => {
//     let token = req.headers['jwtoken'];
//     if (token == null) return res.sendStatus(401)
//     const user = jwt.verify(token, process.env.TOKEN_KEY);
//         req.user = user;
//         next();
// };
const verifyToken = (req, res,next) => {
    let token_id = req.headers['token'];
    Token.findOne({ _id:token_id }, (err, foundToken) => {
        if (err) {
            console.log(err);
        } else {
            if (foundToken) {
                User.findOne({_id:foundToken.user_id},(err, foundUser) => {
                    if (err) {
                        console.log(err);
                    }else{
                        if(foundUser){
                            req.user = foundUser;
                            next();
                        }else{
                            res.status(500).send("unauthorised user");
                        }
                    }
                });

            }else{
                res.status(500).send("unauthorised token");
            }
        }
   
});
};


module.exports = verifyToken;
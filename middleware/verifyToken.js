const jwt = require("jsonwebtoken");
const User = require("../models/users");
// const Token = require("../models/token");
require("dotenv").config();
const verifyToken = (req, res,next) => {
    let token = req.headers['jwttoken'];
    if (token == null) return res.sendStatus(401)
    const user = jwt.verify(token, process.env.TOKEN_KEY);
        User.findOne({
            _id: user["id"]
          })
          .exec((err, user) => {
            if (err) {
              res.status(500)
                .send({
                  message: err
                });
            } else {
              req.user = user;
              next();
            }
          })
      
};
module.exports = verifyToken;



// manually token verify
// const verifyToken = (req, res,next) => {
//     let token_id = req.headers['token'];
//     Token.findOne({ _id:token_id }, (err, foundToken) => {
//         if (err) {
//             console.log(err);
//         } else {
//             if (foundToken) {
//                 User.findOne({_id:foundToken.user_id},(err, foundUser) => {
//                     if (err) {
//                         console.log(err);
//                     }else{
//                         if(foundUser){
//                             req.user = foundUser;
//                             next();
//                         }else{
//                             res.status(500).send("unauthorised user");
//                         }
//                     }
//                 });

//             }else{
//                 res.status(500).send("unauthorised token");
//             }
//         }
   
// });
// };



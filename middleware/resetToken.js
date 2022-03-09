const jwt = require("jsonwebtoken");
const User = require("../models/users");
require("dotenv").config();


const resetToken = (req, res,next) => {
    let resetToken = req.headers['pswdresettoken'];
    if (resetToken == null){ 
        return res.sendStatus(401)
    }
    const user = jwt.verify(resetToken, process.env.TOKEN_KEY);
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
module.exports = resetToken;
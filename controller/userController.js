const express = require("express");
const router = express.Router();
const User = require("../models/users");
const md5 = require("md5");
const jwt = require('jsonwebtoken');
const Address = require("../models/address");
const passport = require("passport");
const sgMail = require('@sendgrid/mail');
require("dotenv").config();


exports.register = async (req, res) => {
    try {
        if (req.body.password == req.body.cnfpassword) {
            const user = await new User({
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                email: req.body.email,
                username: req.body.username,
                password: md5(req.body.password),
            });
            user.save((err, user) => {
                if (err) {
                    res.status(500)
                        .send({
                            message: err
                        });
                    return;
                } else {
                    const token = jwt.sign(
                        { id: user._id },
                        process.env.TOKEN_KEY,
                        {
                            expiresIn: 60000,
                        }
                    );
                    res.status(200).send({ jwttoken: token });
                    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                    const msg = {
                        to: 'sarvesh@excellencetechnologies.in',
                        from: 'sarvesh@excellencetechnologies.in',
                        subject: 'User Regestered',
                        text: 'you are successfully regestered',
                        html: '<strong>Congratulations!</strong>',
                    };
                    (async () => {
                        try {
                            await sgMail.send(msg);
                        } catch (error) {
                            console.error(error);

                            if (error.response) {
                                console.error(error.response.body)
                            }
                        }
                    })();
                }
            });
        } else {
            res.send("password and confirm password must be match");
        }
    }
    catch (error) {
        handleError(error);
    }
    process.on('unhandledRejection', error => {
        console.log('unhandledRejection', error.message);
    });
};
exports.login = (req, res) => {
    passport.authenticate('local', { failureRedirect: '/user/login' }),
        function (req, res) {
            res.redirect('/user/list/2');
        }
}
exports.deleteUser = async (req, res) => {
    try {
        let user = req.user;
        if (user == null) {
            res.status(403)
                .send({
                    message: "Invalid token"
                });
        }
        else {
            await User.findOneAndDelete({ _id: user["id"] })
            res.send("user deleted successfully");
        }
    } catch (error) {
        handleError(error);
    }
    process.on('unhandledRejection', error => {
        console.log('unhandledRejection', error.message);
    });
};

exports.pagination = async (req, res) => {
    try {
        let page = req.params["page"];
        let size = 10;
        let skipPage = (page - 1) * size;
        const result = await User.find().sort().skip(skipPage).limit(size);
        res.send(result);
    }
    catch (error) {
        handleError(error);
    }
    process.on('unhandledRejection', error => {
        console.log('unhandledRejection', error.message);
    });
};


exports.getData = async (req, res) => {
    try {
        let user_id = req.params["id"];
        if (user_id == null) {
            res.status(403)
                .send({
                    message: "Invalid token"
                });
        }
        else {
            await User.find({ _id: user_id }).populate("address").then(user => {
                res.json(user);
            })
        }
    }
    catch (error) {
        handleError(error);
    }
    process.on('unhandledRejection', error => {
        console.log('unhandledRejection', error.message);
    });
};

exports.forgotPassword = (req, res) => {
    try {
        let user = req.user;
        if (user == null) {
            res.status(403)
                .send({
                    message: "Invalid token"
                });
        }
        else {
            const pswdResetToken = jwt.sign(
                { id: user["id"] },
                process.env.TOKEN_KEY,
                {
                    expiresIn: "10m",
                }
            );
            sgMail.setApiKey(process.env.SENDGRID_API_KEY);
            const msg = {
                to: 'sarvesh@excellencetechnologies.in',
                from: 'sarvesh@excellencetechnologies.in',
                subject: 'Reset password',
                text: 'please follow this link to reset password',
                html: `'please follow this link to reset password---<strong>http://localhost:3000/user/verifyResetPassword/${pswdResetToken}</strong>`,
                
            };
            (async () => {
                try {
                    await sgMail.send(msg);
                } catch (error) {
                    console.error(error);

                    if (error.response) {
                        console.error(error.response.body)
                    }
                }
            })();
            res.status(200).send({ pswdresettoken: pswdResetToken });
        }
    } catch (error) {
        handleError(error);
    }
    process.on('unhandledRejection', error => {
        console.log('unhandledRejection', error.message);
    });
};

exports.resetPassword = async (req, res) => {
    try {
        let resetToken = req.params['token'];
        if (resetToken == null) {
            return res.sendStatus(401)
        }
        const user = jwt.verify(resetToken, process.env.TOKEN_KEY);
        let userData = User.findOne({_id: user["id"]})
        if(!userData){
            res.status(500).send("invalid token")
        }
        if (req.body.password == req.body.cnfpassword) {
            let password = md5(req.body.password);
            await User.findByIdAndUpdate({ _id: user["id"] }, { password: password })
            res.send("update password successfull")
        } else {
            res.send("please type password carefully")
        }
    } catch (error) {
        handleError(error);
    }
    process.on('unhandledRejection', error => {
        console.log('unhandledRejection', error.message);
    });
};

exports.imgUpload = (req, res) => {
    try {
        let user = req.user;
        if (user == null) {
            res.status(403)
                .send({
                    message: "Invalid token"
                });
        }
        else {
            if (!req.file) {
                res.send({
                    message: "image not upload"
                })
            }
            res.send("image uploaded successfully")
        }
    } catch (error) {
        handleError(error);
    }
    process.on('unhandledRejection', error => {
        console.log('unhandledRejection', error.message);
    });

};



// exports.login = async (req, res) => {
//     try {
//         let username = req.body.username
//         let password = md5(req.body.password)
//         let foundUser = await User.findOne({ username: username })
//         if (foundUser) {
//             if (foundUser.password === password) {
//                 // manually token created
//                 // const tokenData = md5(new Date())
//                 // const token = new Token({
//                 //     user_id: foundUser._id,
//                 //     access_token: tokenData,
//                 // });
//                 // token.save();
//                 // JWT token
//                 const token = jwt.sign(
//                     { id: foundUser._id },
//                     process.env.TOKEN_KEY,
//                     {
//                         expiresIn: 60000,
//                     }
//                 );
//                 res.status(200).send({ jwttoken: token });
//             } else {
//                 res.status(500).send("User password incorrect.");
//             }
//         } else {
//             res.status(500).send("User not regestered.");
//         }
//     } catch (error) {
//         handleError(error);
//     }
//     process.on('unhandledRejection', error => {
//         console.log('unhandledRejection', error.message);
//     });
// };
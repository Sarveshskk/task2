const express = require("express")
const passport = require("passport");
const User = require("../models/users");
const LocalStrategy = require('passport-local').Strategy;
const strategy =  () => {
      passport.use( new LocalStrategy( async (username, password, done)=> {
        console.log("hello");
            let user = await User.find({ username: username })
              if (!user) { 
                return done(null, false);
               }
              if (!user.password == password) { 
                return done(null, false); 
              }
              return done(null, user);
          }
        ));
        passport.serializeUser((user,done)=>{
          if(user){
             return done(null, user.id);
          }
          return done(null, false);
        })
        passport.deserializeUser((id ,done)=>{
          User.findById(id, (err,user=>{
            if(err){
              return done(null, false);
            }
            return done(null, user);
          }))
        })
};
module.exports = strategy;
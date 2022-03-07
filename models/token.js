const mongoose = require("mongoose");
const tokenSchema = new mongoose.Schema({
    user_id : String,
    access_token:String,
    expiry:{
      type:Date,
      default: Date.now,
      expire: 3600
    }
  }
);
module.exports = mongoose.model('Token', tokenSchema);

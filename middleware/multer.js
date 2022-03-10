const multer = require("multer");
const {CloudinaryStorage}  = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
const cloudinaryConfig = require("../config/cloudinaryConfig")


cloudinaryConfig();
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: "image",
    },
  });
// const fileFilterr = (req,file,callback)=>{
//     console.log(file.mimetype);
//     if(file.mimetype == "image/jpeg" || file.mimetype == "image/png" ){
//         return callback(null, true)
//     }else{
//          return callback({message:"unsupported file format"}, false)
//     }
// }
const multerUpload = multer({
    storage: storage,
    // fileFilter:
})
module.exports = multerUpload;
const cloudinary = require('cloudinary').v2;
//require("dotenv").config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadFile = async(filePath)=>{
    try{
       const result=cloudinary.uploader.upload(filePath);
       console.log(result);
       return result;
    }catch(e){
        console.log(e);
    }
}

module.exports = { uploadFile };
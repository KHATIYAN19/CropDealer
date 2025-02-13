const mongoose=require("mongoose");
const otpSchema=new mongoose.Schema({  
    email: { 
        type: String,
         required: true
   },
    otp: {
         type: String,
          required: true 
    },
    createdAt: {
         type: Date, 
         required: true
     },
    expiresAt: { 
        type: Date,
         required: true 
    },
},{timeStams:true});
module.exports=mongoose.model("Otp",otpSchema);
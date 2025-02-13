const mongoose=require("mongoose");
const requestSchema=new mongoose.Schema({
    message:{
        type:String,
        required:true
    },
    quantity:{
        type:Number,
        required:true
    },
    price:{
        type:Number,
        required:true,
    },
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User' ,
        required:true
    },
    status:{
        type:String,
        enum:['accept','reject','pending'],
        default:'pending'
    },
    statusChangeDate:{
         type:Date
    }
},{timeStams:true});
module.exports=mongoose.model("Request",requestSchema);                                              
const mongoose=require("mongoose");
const productSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
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
    image:{
        type:String,
        required:true,
    },
    pincode:{
        type:String,
        required:true,
    },
    location:{
        required:true,
        type:String
    },
    state:{
        required:true,
        type:String
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User' ,
        required:true
    },
    comments:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Comment' 
    }]
},{timestamps:true});
module.exports=mongoose.model("Product",productSchema);                                              
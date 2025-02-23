const mongoose=require("mongoose");
const orderSchema=new mongoose.Schema({  
    price: { 
        type: String,
         required: true
    },
    quantity: {
         type: String,
          required: true 
    },
    user: { 
             type:mongoose.Schema.Types.ObjectId,
             ref:'User' ,
             reuired:true
    },
    order_id:{
        type:String,
         required:true,
         unique:true
    },
    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Product' ,
        reuired:true
    },
    status:{
        type:String,
        enum:["Completed","Canceled","Pending"],
        default:"Pending"
    }
},{timestamps:true});
module.exports=mongoose.model("Order",orderSchema);
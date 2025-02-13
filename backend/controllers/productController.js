const Product=require("../models/productModel")
const User=require("../models/userModel");
const upload =require("../utils/cloudinary")

exports.create=async(req,res)=>{
     try{
        const user_id=req.user.id;
        const {name,description,quantity,price,location,pincode,state}=req.body;
        if(!name||!description||!quantity||!price||!pincode||!location||!state){
            return res.status(400).json({
                message:"All feild Required",
                success:false,
              })
        }
        if (!req.file) {
          return res.status(400).send({ message: 'Item image is required' });
        }
        const user=await User.findOne({_id:user_id});
        if(!user){
            return res.status(400).json({
                message:"No user found",
                success:false,
              })
        }
        const result = await upload.uploadFile(req.file.path);
        image=result.secure_url
        const product=await Product.create({
            name,
            quantity,
            description,
            price,
            owner:user_id,
            location,
            pincode,
            state,
            image
        })
        return res.status(200).json({
            message:"Product created",
            success:true,
            product:product
          })
     }catch(e){
          return res.status(400).json({
            message:"Something went wrong",
            success:false,
            error:e
          })
     }
}

exports.update=async(req,res)=>{
  console.log(req.body)
    try{
       const user_id=req.user.id;
       const product_id=req.params.id;
       const {name,description,quantity,price,location,pincode,state}=req.body;
       if(!name||!description||!quantity||!price||!location||!pincode||!state){
           return res.status(400).json({
               message:"All feild Required",
               success:false,
             })
       }
       const user=await User.findOne({_id:user_id});
       if(!user){
           return res.status(400).json({
               message:"No user found",
               success:false,
             })
       }
       const product=await Product.findOne({_id:product_id});
       if(!product){
        return res.status(400).json({
            message:"No Product found",
            success:false,
          })
      }
      if(product.owner.toString()!==user_id){
            return res.status(400).json({
                message:"You are not authorized for this",
                success:false,
              })
      }
      product.name=name;
      product.price=price;
      product.description=description;
      product.quantity=quantity;
      product.location=location;
      product.pincode=pincode;
      product.state=state;
      await product.save();
       return res.status(200).json({
           message:"Product Updated",
           success:true,
           product:product
         })
    }catch(e){
         return res.status(400).json({
           message:"Something went wrong",
           success:false,
           error:e.message
         })
    }
}

exports.deleteProduct=async(req,res)=>{
    try{
       const user_id=req.user.id;
       const product_id=req.params.id;
       const user=await User.findOne({_id:user_id});
       if(!user){
           return res.status(400).json({
               message:"No user found",
               success:false,
             })
       }
       const product=await Product.findOne({_id:product_id});
       if(!product){
        return res.status(400).json({
            message:"No Product found",
            success:false,
          })
      }
      if(product.owner.toString()!==user_id){
            return res.status(400).json({
                message:"You are not authorized for this",
                success:false,
              })
      }
      await Product.findByIdAndDelete({_id:product_id});
           return res.status(200).json({
           message:"Product Deleted",
           success:true,
       })
    }catch(e){
         return res.status(400).json({
           message:"Something went wrong",
           success:false,
           error:e.message
         })
    }
}

exports.getAllProduct=async(req,res)=>{
    try{
       const products=await Product.find({});
       if(products.length==0){
        return res.status(200).json({
            message:"No Product Available",
            success:true,
          })
      }
      
       return res.status(200).json({
           message:"Product Fetched",
           success:true,
           products:products
         })
    }catch(e){
         return res.status(400).json({
           message:"Something went wrong",
           success:false,
           error:e.message
         })
    }
}


exports.getProductById=async(req,res)=>{
    try{
       const product_id=req.params.id;
       const products=await Product.find({_id:product_id});
       if(products.length==0){
        return res.status(400).json({
            message:"No Product Available",
            success:false,
          })
      }
       return res.status(200).json({
           message:"Products Fetched",
           success:true,
           products:products
         })
    }catch(e){
         return res.status(400).json({
           message:"Something went wrong",
           success:false,
           error:e.message
         })
    }
}

exports.getownProduct=async(req,res)=>{
  try {
    const user_id = req.user.id;
    const user = await User.findById(user_id);
    if (!user) {
        return res.status(400).json({ message: "No user found", success: false });
    }

    const products = await Product.find({ owner: user_id })  .populate({
        path: "request",
        populate: {
            path: "sender", 
            select: "name email image phone" 
        }
    })
    .lean()
    .exec();

    if (products.length === 0) {
        return res.status(200).json({ message: "No Product Available", success: true, products: [] });
    }

    const updatedProducts = products.map(product => {
        const pendingCount = product.request.filter(req => req.status === "pending").length;
        return {
            ...product,
            totalPendingRequests: pendingCount
        };
    });
    console.log(updatedProducts)
    return res.status(200).json({ message: "Products Fetched", success: true, products: updatedProducts });

} catch (e) {
  console.log(e);
    return res.status(400).json({ message: "Something went wrong", success: false, error: e.message });
}
}
exports.getProductByPin=async(req,res)=>{
  try{
     const pincode=req.params.pincode;
     if(pincode.length()!=6){
       return res.status(400).json({
        message:"Invalid Pincode",
        success:false,
      })
     }
     const products=await Product.find({pincode:pincode});
     if(products.length==0){
      return res.status(400).json({
          message:"No Product Available",
          success:true,
        })
    }
     return res.status(200).json({
         message:"Product Fetched",
         success:true,
         products:products
       })
  }catch(e){
       return res.statsus(400).json({
         message:"Something went wrong",
         success:false,
         error:e.message
       })
  }
}

exports.getProductByState=async(req,res)=>{
  try{
     const state=req.params.state;
     const products=await Product.find({state:state});
     if(products.length==0){
      return res.status(400).json({
          message:"No Product Available",
          success:true,
        })
    }
     return res.status(200).json({
         message:"Product Fetched",
         success:true,
         products:products
       })
  }catch(e){
       return res.statsus(400).json({
         message:"Something went wrong",
         success:false,
         error:e.message
       })
  }
}






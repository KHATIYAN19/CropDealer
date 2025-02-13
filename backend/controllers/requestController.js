const Product=require("../models/productModel")
const User=require("../models/userModel");
const Request=require("../models/requestModel");


exports.create=async(req,res)=>{
     try{
      console.log(req.body)
        const user_id=req.user.id;
        const product_id=req.params.id;
        const {message,quantity}=req.body;
        if(!message||!quantity){
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
        if(product.quantity<quantity){
            return res.status(400).json({
                message:"No enough quantity Available",
                success:false
            })
        }

        const price=quantity*product.price;
        const request=await Request.create({
             message,
             quantity,
             price,
             sender:user_id
        })
         product.request.push(request._id);
         await product.save();
        return res.status(200).json({
            message:"Request created",
            success:true,
            request:request
          })
     }catch(e){
          return res.status(400).json({
            message:"Something went wrong",
            success:false,
            error:e.message
          })
     }
}


exports.update=async(req,res)=>{
    try{
       const user_id=req.user.id;
       const product_id=req.params.id;
       const request_id=req.params.req_id;
       const {message,quantity}=req.body;
       if(!message||!quantity){
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
       const request=await Request.findOne({_id:request_id});
       if(!request){
           return res.status(400).json({
               message:"No Request found",
               success:false,
             })
       }
       if(request.sender.toString()!==user_id){
         return res.status(400).json({
            message:"You are not authorized ",
            success:false
         })
       }
       if(request.status!='pending'){
          return res.status(400).json({
             message:"Can't change request",
             success:false
          })
       }
       if(product.quantity<quantity){
           return res.status(400).json({
               message:"No enough quantity found",
               success:false
           })
       }
       const price=quantity*product.price;
      
       request.message=message;
       request.price=price;
       request.quantity=quantity;
       await request.save();
       return res.status(200).json({
           message:"Request Updated",
           success:true,
           request:request
         })
    }catch(e){
         return res.status(400).json({
           message:"Something went wrong",
           success:false,
           error:e.message
         })
    }
}

exports.deleteRequest=async(req,res)=>{
    try{
       const user_id=req.user.id;
       const product_id=req.params.id;
       const request_id=req.params.req_id;
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
       const request=await Request.findOne({_id:request_id});
       if(!request){
           return res.status(400).json({
               message:"No Request found",
               success:false,
             })
       }
       if(request.sender.toString()!==user_id){
        return res.status(400).json({
           message:"You are not authorized ",
           success:false
        })
      }
       if(request.status!='pending'){
          return res.status(400).json({
             message:"Can't change request",
             success:false
          })
       }
       await product.request.pop(request._id);
       await Request.findByIdAndDelete({_id:request_id});
       return res.status(200).json({
           message:"Request Deleted",
           success:true,
           request:request
         })
    }catch(e){
         return res.status(400).json({
           message:"Something went wrong",
           success:false,
           error:e.message
         })
    }
}


exports.getMyRequest=async(req,res)=>{
    try{
       const user_id=req.user.id;
       const user=await User.findOne({_id:user_id});
       if(!user){
           return res.status(400).json({
               message:"No user found",
               success:false,
             })
       }  
       const requests=Request.find({sender:user_id});
       if(requests.length==0){
        return res.status(404).json({
             message:"No Request Available",
             success:true,
             requests
        })
       }
       return res.status(200).json({
           message:"All Request Fetched",
           success:true,
           requests:requests
         })
    }catch(e){
         return res.status(400).json({
           message:"Something went wrong",
           success:false,
           error:e.message
         })
    }
}


exports.acceptRequest=async(req,res)=>{
    try{
        const user_id=req.user.id;
        const product_id=req.params.id;
        const request_id=req.params.req_id;
    
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
        const request=await Request.findOne({_id:request_id});
        if(!request){
            return res.status(400).json({
                message:"No Request found",
                success:false,
              })
        }
        if(product.owner.toString()!==user_id){
          return res.status(400).json({
             message:"You are not authorized ",
             success:false
          })
        }
        if(request.status!='pending'){
           return res.status(400).json({
              message:"Can't change request",
              success:false
           })
        }

        if(product.quantity<request.quantity){
            return res.status(400).json({
                message:"No enough quantity found",
                success:false
            })
        }
        product.quantity=product.quantity-request.quantity;
        request.status='accept';
        request.statusChangeDate=Date.now();
        await request.save();
        await product.save();
        return res.status(200).json({
            message:"Request Accepted",
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

exports.rejectRequest=async(req,res)=>{
    try{
        const user_id=req.user.id;
        const product_id=req.params.id;
        const request_id=req.params.req_id;
    
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
        const request=await Request.findOne({_id:request_id});
        if(!request){
            return res.status(400).json({
                message:"No Request found",
                success:false,
              })
        }
        if(product.owner.toString()!==user_id){
          return res.status(400).json({
             message:"You are not authorized ",
             success:false
          })
        }
        if(request.status!=='pending'){
           return res.status(400).json({
              message:"Can't change request",
              success:false
           })
        }
        request.status='reject';
        request.statusChangeDate=Date.now();
        await request.save();
        return res.status(200).json({
            message:"Request Rejected",
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


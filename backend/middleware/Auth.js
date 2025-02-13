const jwt=require("jsonwebtoken");

exports.auth=(req,res,next)=>{
     try{
         const token=req.header("Authorization")?.split(" ")[1]||req.cookies.token;
         if(!token){
              return res.status(400).json({
                      success:false,
                      message:"Token missing"
              })
         }
         try{
            const decode=jwt.verify(token,"asdfdsdfd");
            req.user=decode;
         }catch(e){
            console.log(error);
            return res.status(401).json({
                success:false,
                message:"token invalid"
            })
         }
         next();
     }catch(e){
        return res.status(401).json({
            message:"something worng went wrong",
            success:false,
            e
        })
     }
}

exports.isNormal=(req,res,next)=>{
    try{
        if(req.user.role!=='Normal'&&req.user.role!='Admin'){
            return res.status(401).json({
                success:"false",
                "message":"Only Student can perform this action",
            })
        }
        next();
    }catch(e){
        return res.status(500).json({
            success:false,
            message:"User role not found"
        })
    }
}
exports.isAdmin=(req,res,next)=>{
    try{
        if(req.user.role!=='Admin'){
            return res.status(401).json({
                success:"false",
                "message":"Only Admin can perform this action",
            })
        }
        next();
    }catch(e){
        return res.status(500).json({
            success:false,
            message:"User role not found"
        })
    }
}
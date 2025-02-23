const express=require("express");
const route=express.Router();


const {auth}=require("../middleware/Auth")
const {signup,login,verifyOtp,deleteUser,updateUser,logout,getMyData,contact}=require("../controllers/userController");

route.post("/signup",signup);
route.post("/login",login);
route.post("/verify-otp" ,verifyOtp);
route.delete("/delete",auth,deleteUser);
route.patch("/update",auth,updateUser);
route.get("/logout",auth,logout);
route.get("/myProfile",auth,getMyData);
route.post("/contact",contact);

module.exports=route;
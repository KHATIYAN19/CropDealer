const express=require("express");
const route=express.Router();


const {auth}=require("../middleware/Auth")
const {signup,login,verifyOtp,deleteUser,updateUser,logout,getMyData}=require("../controllers/userController");
const {getDayByDayDataForLast30Days,getAllData}=require("../controllers/dashboardController");
route.post("/signup",signup);
route.post("/login",login);
route.post("/verify-otp" ,verifyOtp);
route.delete("/delete",auth,deleteUser);
route.patch("/update",auth,updateUser);
route.get("/logout",auth,logout);
route.get("/myProfile",auth,getMyData);

route.get("/dash/last30days",auth,getDayByDayDataForLast30Days);
route.get("/dash/all",auth,getAllData);
module.exports=route;
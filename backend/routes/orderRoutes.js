const express=require("express");
const route=express.Router();
const {auth}=require("../middleware/Auth")
const {place_order,get_my_orders,get_orders_by_product}=require("../controllers/orderController");

route.post("/create/:id",auth,place_order);
route.get("/getmyorder",auth,get_my_orders);
route.get("/get/product/:id",get_orders_by_product);
// route.delete("/delete/:comment_id",auth,deleteComment);
// route.patch("/update/:comment_id",editComment);
module.exports=route;
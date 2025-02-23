const express=require("express");
const route=express.Router();
const {auth}=require("../middleware/Auth")
const {addComment,deleteComment,editComment}=require("../controllers/commentController");
route.post("/create/:id",auth,addComment);
route.delete("/delete/:comment_id",auth,deleteComment);
route.patch("/update/:comment_id",editComment);
module.exports=route;
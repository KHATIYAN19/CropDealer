const express=require("express");
const route=express.Router();
const multer = require('multer');
const upload = multer({ storage:multer.diskStorage({}),limits:{fileSize:50000000 } }); 
const {auth}=require("../middleware/Auth")
const {create,update,deleteProduct,getAllProduct,getProductById,getownProduct,getProductByPin,getProductByState}=require("../controllers/productController");
route.post("/create",auth,upload.single('image'),create);
route.post("/update/:id",auth,upload.single('image'),update);
route.delete("/delete/:id",auth,deleteProduct);
route.get("/allProduct",getAllProduct);
route.get("/getProduct/:id",getProductById)
route.get("/myProduct",auth,getownProduct);
route.get("/state/:state",getProductByState);
route.get("/pincode/:pincode",getProductByPin);
module.exports=route;
const express=require("express");
const route=express.Router();

const multer = require('multer');
const upload = multer({ storage:multer.diskStorage({}),limits:{fileSize:500000 } }); 

const {auth}=require("../middleware/Auth")
const {create,update,deleteRequest,getMyRequest,acceptRequest,rejectRequest}=require("../controllers/requestController");
route.post("/create/:id",auth,upload.single('image'),create);
route.patch("/update/:id/:req_id",auth,update);

route.delete("/delete/:id/:req_id",auth,deleteRequest);
route.get("/myRequest",auth,getMyRequest);


route.patch("/accept/:id/:req_id",auth,acceptRequest);
route.patch("/reject/:id/:req_id",auth,rejectRequest);
module.exports=route;
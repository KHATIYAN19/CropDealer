const express=require("express");
const cors = require("cors");
require('dotenv').config();
const app=express();
var cookieParser = require('cookie-parser');
const Dbconnect=require("./Utils/DbConnections");
const userRoutes=require("./routes/userRoute");
const productRoutes=require("./routes/productRoute");
const requestRoutes=require("./routes/requestRoute");
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use("/product",productRoutes);
app.use("/request",requestRoutes);





app.use("/",userRoutes);
app.listen(process.env.PORT,()=>{
    console.log(`App is listening on ${process.env.PORT}`);
});
Dbconnect();

 

const Order = require("../models/orderModel");
const User = require("../models/userModel");
const Product = require("../models/productModel");
exports.place_order = async (req, res) => {
    try {
        const user_id = req.user.id;
        const {quantity} = req.body;
        const product_id=req.params.id;
        console.log(req.body)
        if (!quantity) {
            return res.status(400).json({
                message: "Quantity Needed",
                success: false,
            })
        }
        const user = await User.findOne({ _id: user_id });
        if (!user) {
            return res.status(400).json({
                message: "No user found",
                success: false,
            })
        }
        const product = await Product.findOne({ _id: product_id });
        if (!product) {
            return res.status(400).json({
                message: "No Product found",
                success: false,
                
            })
        }
        if(product.quantity<quantity){
            return res.status(400).json({
                message:"Not enough Quantity",
                success:false
            })
        }
        product.quantity=Number(product.quantity)-quantity;
        const price=product.price*quantity;
        const order_id = `#${String.fromCharCode(65 + Math.random() * 26)}${String.fromCharCode(65 + Math.random() * 26)}${Math.floor(10000000 + Math.random() * 90000000)}`;
        const newOrder=await Order.create({
            price,quantity,
            user:user_id,
            order_id,
            product:product._id
        })
        await product.save();
        return res.status(200).json({
            message: "Order Placed",
            success: true,
            order:newOrder
        })
    } catch (e) {
        return res.status(400).json({
            message: "Something went wrong",
            success: false,
            error:e
        })
    }
}

exports.get_my_orders = async (req, res) => {
    try {
        const user_id = req.user.id;
        const orders = await Order.find({ user: user_id }).populate("product").sort({ createdAt: -1 });;
            
       return res.status(200).json({
            message: "Orders retrieved successfully",
            success: true,
            orders,
        });
    } catch (e) {
        return res.status(400).json({
            message: "Something went wrong",
            success: false,
            error: e,
        });
    }
};


exports.get_orders_by_product = async (req, res) => {
    try {
        const user_id = req.user.id;
        const product_id = req.params.id;

        const user = await User.findOne({ _id: user_id });
        if (!user) {
            return res.status(400).json({
                message: "No user found",
                success: false,
            });
        }

        const product = await Product.findOne({ _id: product_id });
        if (!product) {
            return res.status(400).json({
                message: "No Product found",
                success: false,
            });
        }

        const orders = await Order.find({ product: product_id }).populate("user");

        return res.status(200).json({
            message: "Orders retrieved successfully",
            success: true,
            orders,
        });
    } catch (e) {
        return res.status(400).json({
            message: "Something went wrong",
            success: false,
            error: e,
        });
    }
};




const Comment = require("../models/commentModel");
const User = require("../models/userModel");
const Product = require("../models/productModel");
exports.addComment = async (req, res) => {
    try {
        const user_id = req.user.id;
        const { comment } = req.body;
        const product_id=req.params.id;
        if (!comment) {
            return res.status(400).json({
                message: "Need Some comment",
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
        const newComment=await Comment.create({
            user:user_id,
            comment:comment
        })
        product.comments.push(newComment._id);
        await product.save();
        return res.status(200).json({
            message: "Commented",
            success: true,
            comment:newComment
        })
    } catch (e) {
        return res.status(400).json({
            message: "Something went wrong",
            success: false,
            error:e
        })
    }
}
exports.deleteComment = async (req, res) => {
    try {
        const user_id = req.user.id;
        const comment_id = req.params.comment_id;
        console.log(comment_id)
        const user = await User.findOne({ _id: user_id });
        console.log("user",user);

        const comment = await Comment.findOne({ _id: comment_id });
        if (!comment) {
            return res.status(400).json({
                message: "Comment not found",
                success: false,
            });
        }
        
        if (comment.user.toString() !== user_id) {
            return res.status(403).json({
                message: "Unauthorized to delete this comment",
                success: false,
            });
        }
        await Comment.deleteOne({ _id: comment_id });
        await Product.updateOne(
            { comments: comment_id },
            { $pull: { comments: comment_id } }
        );
        return res.status(200).json({
            message: "Comment deleted successfully",
            success: true,
        });
    } catch (e) {
        return res.status(400).json({
            message: "Something went wrong",
            success: false,
            error: e,
        });
    }
};
exports.editComment = async (req, res) => {
    try {
        const user_id = req.user.id;
        const comment_id = req.params.comment_id;
        const { comment } = req.body;

        if (!comment) {
            return res.status(400).json({
                message: "Comment content is required",
                success: false,
            });
        }

        const existingComment = await Comment.findOne({ _id: comment_id });
        if (!existingComment) {
            return res.status(400).json({
                message: "Comment not found",
                success: false,
            });
        }

        if (existingComment.user.toString() !== user_id) {
            return res.status(403).json({
                message: "Unauthorized to edit this comment",
                success: false,
            });
        }
        existingComment.comment = comment;
        await existingComment.save();
        return res.status(200).json({
            message: "Comment updated successfully",
            success: true,
        });
    } catch (e) {
        return res.status(400).json({
            message: "Something went wrong",
            success: false,
            error: e,
        });
    }
};

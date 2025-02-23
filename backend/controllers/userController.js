const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Otp = require("../models/otpModel");
const moment = require('moment');
const otpGenerator = require("../utils/OtpGeneration");
const mailSender = require("../utils/mailSender");
exports.signup = async (req, res) => {
    try {
        let { email, password, name, mobile } = req.body;
        if (!email || !password || !name || !mobile) {
            return res.status(400).json({
                message: "All fields are required",
                success: false,
            });
        }
        function isValid10DigitNumber(str) {
            return /^\d{10}$/.test(str);
        }
        if(!isValid10DigitNumber(mobile)){
            return res.status(400).json({
                message:"Wrong phone number",
                success:false
            })
        }
        email = email.toLowerCase();
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            if (!existingUser.isVerified) {
                const otp = otpGenerator();
                const existingOtp = await Otp.findOne({ email });
                if (existingOtp) {
                    await Otp.updateOne(
                        { email },
                        {
                            otp,
                            createdAt: new Date(),
                            expiresAt: new Date(Date.now() + 10 * 60 * 1000),
                        }
                    );
                } else {
                    await Otp.create({
                        email,
                        otp,
                        createdAt: new Date(),
                        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
                    });
                }
                const content = `Dear ${name},\n\nYour OTP for signup is ${otp}. It is valid for 10 minutes.\n\nThank you!`;
                await mailSender(email, 'Please verify your email ', otp, content);
                return res.status(200).json({
                    message: "User already exists but is not verified. A new OTP has been sent to your email.",
                    email,
                    success: true,
                });
            }
            return res.status(400).json({
                message: "User already exists. Please login.",
                success: false,
            });
        }
        let hashedPassword;
        try {
            hashedPassword = await bcrypt.hash(password, 10);
        } catch (e) {
            return res.status(500).json({
                success: false,
                message: "Internal error during password hashing",
            });
        }
        const otp = otpGenerator();
        await Otp.create({
            email,
            otp,
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        });
        const content = `Dear ${name},\n\nYour OTP for signup is ${otp}. It is valid for 10 minutes.\n\nThank you!`;
        await mailSender(email, otp, content);

        await User.create({
            name,
            email,
            password: hashedPassword,
            phone: mobile,
            role: "Normal",
            isVerified: false,
        });

        return res.status(200).json({
            message: "User signed up successfully. Please verify your OTP.",
            success: true,
        });
    } catch (e) {
        return res.status(500).json({
            message: "Something went wrong",
            success: false,
            error: e,
        });
    }
};
exports.verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                message: "Email and OTP are required",
                success: false,
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: "Email not found",
                success: false,
            });
        }

        const otpRecord = await Otp.findOne({ email });
        if (!otpRecord) {
            return res.status(400).json({
                message: "OTP not found or expired",
                success: false,
            });
        }

        const currentTime = moment().valueOf();
        const otpExpiryTime = moment(otpRecord.expiresAt).valueOf();
        console.log(otp, " diff ", otpRecord.otp);
        console.log(currentTime, " diff ", otpExpiryTime)
        if (currentTime > otpExpiryTime || otpRecord.otp !== otp) {
            return res.status(400).json({
                message: "Invalid or expired OTP",
                success: false,
            });
        }

        if (user.isVerified) {
            return res.status(400).json({
                message: "User is already verified",
                success: false,
            });
        }

        await User.updateOne({ email }, { isVerified: true });
        await Otp.deleteOne({ email });
        return res.status(200).json({
            message: "OTP verified successfully. User is now verified.",
            success: true,
        });
    } catch (e) {
        return res.status(500).json({
            message: "Something went wrong",
            success: false,
            error: e.message,
        });
    }
};

exports.login = async (req, res) => {
    try {
        let { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({
                message: "All feild Required",
                success: false
            })
        }
        email = email.toLowerCase();
        const user = await User.findOne({ email });
        if (!user || !user.isVerified) {
            return res.status(400).json({
                success: false,
                message: "No user available",
            })
        }

        const payload = {
            email: user.email,
            id: user._id,
        }
        if (await bcrypt.compare(password, user.password)) {
            let token = jwt.sign(payload, "asdfdsdfd", {
                expiresIn: "720h"
            });
            const options = {
                expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                httpOnly: true,
            }
            user.password = undefined;
            req.token = token;
            console.log(token);
            return res.cookie("token", token, options).status(200).json({
                success: true,
                message: "User login",
                token,
                user
            })
        } else {
            return res.status(400).json({
                success: false,
                message: "Incorrect Email or Password",
            })
        }
    } catch (e) {
        return res.status(400).json({
            success: false,
            message: "Something went wrong",
            error: e.message
        })
    }
}

exports.deleteUser = async (req, res) => {
    try {
        const id=req.user.id;
        if (!id) {
            return res.status(400).json({ message: "User ID is required",success:false });
        }
        const result = await User.findByIdAndDelete(id);
        if (!result) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User deleted successfully", data: result ,success:true});
    } catch (e) {
        console.error("Error deleting user:", e);
        res.status(500).json({ message: "Internal server error", error: e.message,success:false });
    }
};


exports.updateUser = async (req, res) => {
    try {
        const { name, phone } = req.body;
        if (!name || !phone) {
            return res.status(400).json({ message: "All Feild Required",success:false });
        }
      
      
        function isValid10DigitNumber(str) {
            return /^\d{10}$/.test(str);
        }
        if(!isValid10DigitNumber(phone)){
            return res.status(400).json({
                message:"Wrong phone number",
                success:false
            })
        }
        
        const user_id=req.user.id;
        const user=await User.findOne({_id:user_id});
        if(!user){
            return res.status(400).json({
                message:"No user found",
                success:false
            })
        }
       const email=user.email
       
        if (!email) {
            return res.status(400).json({ message: "Email is required in params", success:false });
        }
       
        const updatedUser = await User.findOneAndUpdate(
            { email },
            { $set: { ...(name && { name }), ...(phone && { phone }) } },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found",success:false });
        }

        res.status(200).json({ message: "User updated successfully", data: updatedUser ,success:true });
    } catch (e) {
        console.error("Error updating user:", e);
        res.status(500).json({ message: "Internal server error", error: e.message,success:false });
    }
};

exports.logout = async (req, res) => {
    try {
        const user_id=req.user.id;
        const user=User.findOne({_id:user_id});
        if(!user){
            return res.status(400).json({
                success:false,
                message:"No user found"
            })
        }
        res.clearCookie('token', {
            httpOnly: true,
            sameSite: 'strict',
        });
        return res.status(200).json({
            message: "Logged out successfully",
            success: true,
        });
    } catch (e) {
        return res.status(500).json({
            message: "Something went wrong",
            success: false,
            error: e.message,
        });
    }
};

exports.getMyData = async (req, res) => {
    try {
        const user_id = req.user.id;
        const user = await User.findOne({ _id: user_id });
        if (!user) {
            return res.status(400).json({
                message: "No user found",
                success: false,
            })
        }
        user.password = undefined;
        return res.status(200).json({
            message: "User fetched",
            success: true,
            user
        })
    } catch (e) {
        return res.status(400).json({
            message: "Something went wrong",
            success: false,
            e
        })
    }
}

exports.contact = async (req, res) => {
     try{ 
        const{email,phone,name,message}=req.body;
        if(!email||!phone||!name||!message){
             return res.status(400).json({
                message:"All feild Required",
                success:false,
             })
        }
        const content = `Dear Admin,\n\n User ${name} have some query.Please solver user query.\n\n  ${message}. \n\n
        Reagrds,\n\n
        ${name}\n\n
        ${phone}\n\n
        ${email}
        `;
        await mailSender(`lavikhatiyan2@gmail.com`, `${name}-Contact You `,"" , content);
        return res.status(200).json({
            message:"Query Recieved Our team reply you.",
            success:true
        })
     }catch(e){
         return res.status(400).json({
            success:false,
            message:e.message
         })
     }
}
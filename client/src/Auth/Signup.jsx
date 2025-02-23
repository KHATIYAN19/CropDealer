import React, { useState } from "react";
import { z } from "zod";
import { FaEye, FaEyeSlash, FaArrowLeft } from "react-icons/fa";
import axios from "axios"; // fixed import statement
import {toast} from "react-toastify"
import { NavLink } from "react-router-dom";
const signupSchema = z.object({
  name: z.string().nonempty("Name is required"),
  email: z
    .string()
    .nonempty("Email is required")
    .email("Invalid email address"),
  password: z
    .string()
    .nonempty("Password is required")
    .min(6, "Password must be at least 6 characters"),
  mobile: z
    .string()
    .nonempty("Mobile number is required")
    .regex(/^\d{10}$/, "Mobile number must be 10 digits"),
});

const otpSchema = z.object({
  otp: z
    .string()
    .nonempty("OTP is required")
    .length(6, "OTP must be 6 digits"),
});

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    mobile: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    mobile: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
    setOtpError("");
  };

  const validateSignupForm = () => {
    const result = signupSchema.safeParse(formData);
    if (!result.success) {
      const validationErrors = result.error.flatten().fieldErrors;
      setErrors({
        name: validationErrors.name ? validationErrors.name[0] : "",
        email: validationErrors.email ? validationErrors.email[0] : "",
        password: validationErrors.password ? validationErrors.password[0] : "",
        mobile: validationErrors.mobile ? validationErrors.mobile[0] : "",
      });
      return false;
    }
    return true;
  };

  const validateOtpForm = () => {
    const result = otpSchema.safeParse({ otp });
    if (!result.success) {
      setOtpError(result.error.flatten().fieldErrors.otp[0]);
      return false;
    }
    return true;
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    if (validateSignupForm()) {
      try {
        const response = await axios.post("http://localhost:8880/signup", formData);
        if (response.data.success) {
            toast.warning(response.data.message);
          setIsOtpStep(true);
        }
      } catch (error) {
        toast.error(error.response.data.message);
      }
    }
  };
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (validateOtpForm()) {
      try {
        const response=await axios.post("http://localhost:8880/verify-otp", { email: formData.email, otp });
        if(response.data.message){
            toast.success(response.data.message); 
        }else{
            toast.error(response.data.message);
        }
      } catch (error) {
        toast.error(error.response.data.message);
      }
    }
  };

  return (
   
    <div className="flex justify-center items-center h-screen pt-[100px] bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 py-2 rounded-lg shadow-md text-black relative">
        {!isOtpStep ? (
          <>
            <h2 className="text-2xl font-bold text-black text-center mb-6 ">Sign Up</h2>
            <form onSubmit={handleSignupSubmit}>
              {/* Name Field */}
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full  p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
              </div>

              {/* Email Field */}
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="text"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
              </div>

              {/* Password Field */}
              <div className="mb-4 relative">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.password ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  <div
                    className="absolute top-1/2 right-3 transform -translate-y-1/2 flex items-center cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash className="text-gray-500" /> : <FaEye className="text-gray-500" />}
                  </div>
                </div>
                {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
              </div>

              {/* Mobile Field */}
              <div className="mb-4">
                <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">
                  Mobile
                </label>
                <input
                  id="mobile"
                  name="mobile"
                  type="text"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.mobile ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.mobile && <p className="mt-1 text-sm text-red-500">{errors.mobile}</p>}
              </div>

              {/* Sign Up Button */}
              <div className="mb-4">
                <button
                  type="submit"
                  className="w-full bg-black text-white py-2 px-4 rounded-md "
                >
                  Sign Up
                </button>
                <p className="text-center pt-4 text-sm text-gray-600">
                      Already have an account? <NavLink to="/login" className="text-black text-md font-semibold hover:underline"> Login</NavLink>
                 </p>
              </div>
            </form>
             
           
          </>
        ) : (
          <>
            <div className="flex items-center mb-6">
              <button
                onClick={() => setIsOtpStep(false)}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <FaArrowLeft className="text-lg" />
              </button>
              <h2 className="text-2xl font-bold text-black text-center flex-grow">Enter Otp</h2>
            </div>
            <h2>Email: <span className="text-black">{formData.email}</span></h2>
            <form onSubmit={handleOtpSubmit}>
              {/* OTP Field */}
              <div className="mb-4">
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                  OTP
                </label>
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  value={otp}
                  onChange={handleOtpChange}
                  className={`mt-1 block w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    otpError ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {otpError && <p className="mt-1 text-sm text-red-500">{otpError}</p>}
              </div>

              {/* Submit OTP Button */}
              <div className="mb-4">
                <button
                  type="submit"
                  className="w-full bg-black text-white py-2 px-4 rounded-md  "
                >
                  Submit OTP
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Signup;

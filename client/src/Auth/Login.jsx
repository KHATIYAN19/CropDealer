import React, { useState } from "react";
import { z } from "zod";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { useDispatch } from "react-redux";
import { login } from "../redux/authSlice";

const loginSchema = z.object({
  email: z.string().nonempty("Email is required").email("Invalid email address"),
  password: z.string().nonempty("Password is required").min(6, "Password must be at least 6 characters"),
});

const Login = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const validateForm = () => {
    const result = loginSchema.safeParse(formData);
    if (!result.success) {
      const validationErrors = result.error.flatten().fieldErrors;
      setErrors({
        email: validationErrors.email ? validationErrors.email[0] : "",
        password: validationErrors.password ? validationErrors.password[0] : "",
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await axios.post("http://localhost:8880/login", formData);
      if (response.data.success) {
        const { token, user } = response.data;
        dispatch(login({ token, user }));
        toast.success(response?.data?.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold text-center mb-2">Sign In</h2>
        <p className="text-gray-600 text-center mb-6">Access your account</p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email or Phone</label>
            <input
              id="email"
              name="email"
              type="text"
              value={formData.email}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 border-gray-300"
            />
            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
          </div>
          <div className="mb-4 relative">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <div className="relative flex items-center">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 border-gray-300 pr-10"
              />
              <div
                className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash className="text-gray-500" /> : <FaEye className="text-gray-500" />}
              </div>
            </div>
            {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
          </div>
          <button type="submit" className="w-full bg-black text-white py-2 px-4 rounded-md hover:opacity-90">
            Sign in
          </button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-4">
          Not a member? <NavLink to="/signup" className="text-black font-semibold">Sign up now</NavLink>
        </p>
      </div>
    </div>
  );
};

export default Login;
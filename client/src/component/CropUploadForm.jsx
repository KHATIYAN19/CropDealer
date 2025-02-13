import React, { useState } from "react";
import axios from "axios";
import { z } from "zod";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  quantity: z.number().min(1, "Quantity must be greater than 0"),
  description: z.string().min(1, "Description is required"),
  price: z.number().min(1, "Price must be greater than 0"),
  location: z.string().min(1, "Location is required"),
  pincode: z.string().min(6, "Invalid Pincode").max(6,"Invalid Pincode"),
  state: z.string().min(1, "State is required"),
  image: z.instanceof(File).optional(),
});

const Form = () => {
  const navigate=useNavigate();
  const { token } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    description: "",
    price: "",
    location: "",
    pincode: "",
    state: "",
    image: null,
  });

  const [imageUrl, setImageUrl] = useState("");
  const [errors, setErrors] = useState({});

  const states = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa",
    "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
    "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
    "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
    "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands",
    "Chandigarh", "Dadra and Nagar Haveli", "Daman and Diu", "Lakshadweep", "Delhi", "Puducherry"
  ];

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    let updatedValue = type === "file" ? files[0] : value;
    if (name === "quantity" || name === "price") {
      updatedValue = parseFloat(value);
    }
    setErrors((prevErrors) => ({ ...prevErrors, [name]: [] }));
    const updatedFormData = { ...formData, [name]: updatedValue };
    setFormData(updatedFormData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = formSchema.safeParse(formData);
    if (!result.success) {
      const formErrors = result.error.formErrors.fieldErrors;
      setErrors(formErrors);
      return;
    }

    setErrors({});
    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) formDataToSend.append(key, value);
      });
      const response = await axios.post("http://localhost:8880/product/create", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" ,Authorization: `Bearer ${token}`},        
      });
      if(response.data.success){
          toast.success(response.data.message);
          navigate("/");
      }else{
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.error("Error submitting form", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 my-12 bg-white rounded-xl shadow-xl">
      <h2 className="text-3xl font-semibold text-center mb-6 text-gray-800">Crop Form</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Crop Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              placeholder="Ex:- Rice, Sugarcane, etc."
              onChange={handleChange}
              className="w-full p-3 border rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name[0]}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Quantity (in Quintals):</label>
            <input
              type="number"
              name="quantity"
              placeholder="1"
              value={formData.quantity}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.quantity && <p className="text-red-500 text-sm">{errors.quantity[0]}</p>}
          </div>

          <div className="col-span-2 mb-4">
            <label className="block text-sm font-medium text-gray-700">Description:</label>
            <textarea
              placeholder="Please tell about the crop & seeds and other information that can help a buyer."
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.description && <p className="text-red-500 text-sm">{errors.description[0]}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Price:</label>
            <input
              placeholder="Enter Price per Quintal"
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.price && <p className="text-red-500 text-sm">{errors.price[0]}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Location:</label>
            <input
              type="text"
              name="location"
              placeholder="Enter Complete Location Of Crop "
              value={formData.location}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.location && <p className="text-red-500 text-sm">{errors.location[0]}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Pincode:</label>
            <input
              type="text"
              placeholder="Enter 6 digit Of pincode"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.pincode && <p className="text-red-500 text-sm">{errors.pincode[0]}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">State:</label>
            <select
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select State</option>
              {states.map((state, idx) => (
                <option key={idx} value={state}>
                  {state}
                </option>
              ))}
            </select>
            {errors.state && <p className="text-red-500 text-sm">{errors.state[0]}</p>}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">Crop Image:</label>
          <input
            type="file"
            placeholder="Please upload image of your crop"
            name="image"
            onChange={handleChange}
            className="w-full p-3 border rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.image && <p className="text-red-500 text-sm">{errors.image[0]}</p>}
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
        >
          Submit
        </button>
      </form>

      {imageUrl && (
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-700">Image uploaded successfully. URL:</p>
          <a href={imageUrl} target="_blank" className="text-blue-500">
            {imageUrl}
          </a>
        </div>
      )}
    </div>
  );
};

export default Form;

import React, { useState } from "react";
import axios from "axios";
import { z } from "zod";
import { toast } from "react-toastify";
//import "react-toastify/dist/ReactToastify.css";

//toast.configure();

const schema = z.object({
  description: z.string().min(5, "Description must be at least 5 characters long"),
  location: z.string().min(3, "Location must be at least 3 characters long"),
  image: z.instanceof(File, "Image is required"),
});

const LostItem = () => {
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({});

  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const formData = new FormData();
    formData.append("description", description);
    formData.append("location", location);
    formData.append("image", image);

    const validation = schema.safeParse({ description, location, image });
    if (!validation.success) {
      setErrors(validation.error.format());
      return;
    }
    setErrors({});

    try {
      await axios.post("http://localhost:8880/lost/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImxhdmlAZ21haWwuY29tIiwiaWQiOiI2NzljNzlkYmU5ZDBlNjI0NzY2ZjJiOTYiLCJpYXQiOjE3Mzg0MzMwMDQsImV4cCI6MTc0MTAyNTAwNH0.kiKsU49qJv2WVv0I3YtD1OC6FsGBUX-VaauDy2tftUM `,  
        },
      });
      toast.success("Item submitted successfully!");
    } catch (error) {
      console.error("Error submitting the lost item:", error);
      toast.error("Failed to submit item");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white text-black rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Report Lost Item</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Description:</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
          />
          {errors.description && <p className="text-red-500 text-sm">{errors.description._errors[0]}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium">Location:</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
          />
          {errors.location && <p className="text-red-500 text-sm">{errors.location._errors[0]}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium">Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full border rounded-lg px-3 py-2"
          />
          {errors.image && <p className="text-red-500 text-sm">{errors.image._errors[0]}</p>}
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default LostItem;

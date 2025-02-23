import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { FaEdit } from "react-icons/fa";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const FarmerProfile = () => {
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);

  const [user, setUser] = useState({ name: "", phone: "", email: "", image: "" });
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", email: "" });

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Fetch User Data & Products
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await axios.get("http://localhost:8880/myprofile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(userResponse.data.user);

        const productsResponse = await axios.get("http://localhost:8880/product/myproduct", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducts(productsResponse.data.products);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to fetch profile data");
      }
    };

    fetchData();
  }, [token]);

  // Handle Edit Button Click (Populate Form Data)
  const handleEdit = () => {
    setFormData(user); // Populate form with user data
    setIsModalOpen(true);
  };

  // Handle Edit Profile Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.patch("http://localhost:8880/update", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setUser(formData);
        setIsModalOpen(false);
        toast.success("Profile Updated");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Profile update failed");
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-6">
        {/* Profile Section */}
        <div className="flex justify-between items-center bg-blue-100 p-6 rounded-lg">
          <div className="flex items-center space-x-4">
            <img src={user.image} alt="Profile" className="w-24 h-24 rounded-full border-4 border-white" />
            <div>
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <p className="text-gray-600">Organic Farmer</p>
            </div>
          </div>
          <button
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            onClick={handleEdit} // ✅ Fixed button click to populate form
          >
            <FaEdit /> Edit Profile
          </button>
        </div>

        {/* Contact Info & Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="bg-gray-50 p-4 rounded-lg shadow">
            <h3 className="font-semibold mb-2">Contact Information</h3>
            <p>📧 {user.email}</p>
            <p>📞 {user.phone}</p>
            <p>📍 India</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg shadow">
            <h3 className="font-semibold mb-2">Farm Details</h3>
            <p>✅ Organic Certified</p>
            <p>📏 25 Acres Total Area</p>
            <p>🏆 FSSAI Certified</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg shadow">
            <h3 className="font-semibold mb-2">Account Statistics</h3>
            <p>🛒 156 Total Orders</p>
            <p>⭐ 4.8/5 Rating</p>
            <p>📆 Member since 2021</p>
          </div>
        </div>

        {/* Product Listings */}
        <h3 className="font-semibold text-lg mt-6">Recent Listings</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          {products.map((item, index) => (
            <div
              key={index}
              className="bg-gray-50 p-4 rounded-lg cursor-pointer hover:scale-105 shadow flex items-center space-x-4"
              onClick={() => navigate(`/product/${item._id}`)}
            >
              <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg" />
              <div>
                <h4 className="font-semibold">{item.name}</h4>
                <p className="text-gray-600">{item.price}/Quintal</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
            <h2 className="text-lg font-bold mb-4">Edit Profile</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="Name"
              />
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="Phone"
              />
              <input
                type="text"
                disabled
                name="email"
                value={formData.email}
                className="w-full p-2 border rounded"
                placeholder="Email"
              />
              <div className="flex justify-between">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmerProfile;

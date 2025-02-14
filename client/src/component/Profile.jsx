import React, { useState, useEffect, useReducer } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { FiTrash, FiEdit,FiX } from "react-icons/fi"; 
import {toast} from "react-toastify";
import MyRequests from "./Myrequests";
const Profile = () => {
  const [requests,setRequests]=useState([]);
  const { token } = useSelector((state) => state.auth);
  const [user, setUser] = useState({ name: "", phone: "", email: "", image: "" });
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", email: "" });

  useEffect(() => {
    const fetchData = async () => {
      const userResponse = await axios.get("http://localhost:8880/myprofile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(userResponse.data.user);
      const productsResponse = await axios.get("http://localhost:8880/product/myproduct", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(productsResponse.data.products);
    };
    fetchData();
  }, [token]);
  const handleEdit = () => {
    setFormData(user);
    setIsModalOpen(true);
  };


  const AcceptReq = async (reqId,pro_id,index) => {
    try {
      requests[index].quantity=10000
       console.log("index",index,requests[index] );

       
      const response = await axios.patch(`http://localhost:8880/request/accept/${pro_id}/${reqId}`,{}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if(response.data.success){
        setRequests((prevRequests) => {
          return prevRequests.map((req, i) =>
              i === index ? { ...req, status: "accept" } : req
          );
      });
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.error("Error accepting request:", error);
    }
  };
  
  const RejectReq = async (reqId,pro_id,index) => {
    try {
      const response = await axios.patch(`http://localhost:8880/request/reject/${pro_id}/${reqId}`,{},{
        headers: { Authorization: `Bearer ${token}` },
      });
      if(response.data.success){
        setRequests((prevRequests) => {
          return prevRequests.map((req, i) =>
              i === index ? { ...req, status: "reject" } : req
          );
      });

     }
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.error("Error rejecting request:", error);
    }
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.patch("http://localhost:8880/update",formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if(response.data.success){
        setUser(formData);
        setIsModalOpen(false);
        toast.success("Profile Updated")
      }
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.message);
    }
  };



  const handleDeleteProduct = async () => {
    if (!deleteProductId) return;
    try {
       const resp= await axios.delete(`http://localhost:8880/product/delete/${deleteProductId}`, {
        headers: { Authorization: `Bearer ${token}` },
        });
        if(resp.data.success){
           setProducts(products.filter((product) => product._id !== deleteProductId));
            setShowDeleteModal(false);
            toast.success("Product Delete")
        }
    } catch (error) {
      setShowDeleteModal(false);
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      {/* Profile Section */}
      <div className="bg-white p-6 shadow-lg rounded-lg flex items-center space-x-6">
        <img src={user.image} alt="Profile" className="w-24 h-24 rounded-full object-cover border" />
        <div className="flex w-full justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <p className="text-gray-500">{user.phone}</p>
            <p className="text-gray-500">{user.email}</p>
          </div>
          <button onClick={handleEdit} className="mt-2 px-4 py-2 bg-orange-600 text-white rounded-lg shadow">Edit Profile</button>

        </div>
      </div>

      {/* Products Section */}
      <div>
        <h3 className="text-xl font-bold mb-4">Your Products</h3>
        {products.length === 0 ? (
          <p className="text-gray-500 text-center">No products found.</p>
        ) : (
          <div className="space-y-2">
            {products.map((product) => (
              <div
                key={product._id}
                className="flex items-center justify-between bg-white p-4 shadow rounded-lg hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  setRequests(product.request);
                  setSelectedProduct(product);
                  setShowProductModal(true);
                }}
              >
                <div className="flex items-center">
                  <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded" />
                  <div className="ml-4">
                    <h4 className="text-lg font-bold">{product.name}</h4>
                    <p className="text-gray-500">Price: ${product.price} | Quantity: {product.quantity}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-gray-300">Active Request:</span>
                  <span className={product.totalPendingRequests < 2 ? "text-green-500" : "text-red-500"}>
                    {product.totalPendingRequests}
                  </span>
                  {/* Delete Icon */}
                  <FiTrash
                    className="text-red-500 hover:text-red-700 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteProductId(product._id);
                      setShowDeleteModal(true);
                    }}
                  />
                </div>
              </div>
            ))}
             < MyRequests></MyRequests>

          </div>
        )}
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
            <h2 className="text-lg font-bold mb-4">Edit Profile</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Name" />
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Phone" />
              <input type="text" disabled name="email" value={formData.email} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Email" />
              {/* <input type="text" name="image" value={formData.image} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Image URL" /> */}
              <div className="flex justify-between">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}



      {/* Product Modal */}
      {showProductModal && selectedProduct && (
  <div
    className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
    onClick={() => setShowProductModal(false)} // Close modal when clicking outside
  >
    <div
      className="bg-white p-6 rounded-lg shadow-lg w-[600px] max-h-[80vh] overflow-y-auto relative"
      onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
    >
      {/* Close Button */}
      <button
        className="absolute top-4 right-4 text-gray-500 text-2xl cursor-pointer hover:text-gray-700"
        onClick={() => setShowProductModal(false)}
      >
        <FiX />
      </button>

      {/* Product Image */}
      <img
        src={selectedProduct.image}
        alt={selectedProduct.name}
        className="w-full h-64 object-cover rounded-lg"
      />

      {/* Product Details */}
      <h2 className="text-xl font-bold mt-4">{selectedProduct.name}</h2>
      <p className="text-gray-600 mt-2">{selectedProduct.description}</p>
      <p className="text-gray-500 mt-2">Price: ${selectedProduct.price}</p>
      <p className="text-gray-500">Quantity: {selectedProduct.quantity}</p>

      {/* Edit & Delete Buttons */}
      <div className="flex justify-end space-x-4 mt-4">
        <FiEdit
          className="text-blue-500 text-xl cursor-pointer hover:text-blue-700"
          onClick={() => handleEdit(selectedProduct)}
        />
        <FiTrash
          className="text-red-500 text-xl cursor-pointer hover:text-red-700"
          onClick={(e) => {
            e.stopPropagation();
            //setDeleteProductId(product._id);
            setShowDeleteModal(true);
          }}
        />
      </div>

      {/* Requests Section */}
      <h3 className="text-lg font-bold mt-6">Requests</h3>
      <div className="space-y-2">
        {requests.map((req, index) => (
          <div key={req._id} className="flex items-center justify-between bg-gray-100 p-2 rounded-lg">
            <div className="flex items-center space-x-4">
              <img
                src={req.sender.image}
                alt={req.sender.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <div className="flex flex-row text-gray-500">
                  <p className="text-gray-600 font-semibold pr-1">{req.sender.name}</p> |
                  <p className="px-1">{req.sender.email}</p> |
                  <p className="pl-1">{req.sender.phone}</p>
                </div>
                <div className="flex text-gray-500 items-center">
                  <p className="text-sm text-gray-500 pr-2">Price: ${req.price}</p> |
                  <p className="text-sm text-gray-500 pl-2">Quantity: {req.quantity}</p>
                </div>
                <div className="text-gray-400 text-sm">{req.message}</div>
              </div>
            </div>

            {/* Accept/Reject Buttons */}
            {req.status === "pending" ? (
              <div className="flex space-x-2">
                <button
                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                  onClick={() => AcceptReq(req._id, selectedProduct._id, index)}
                >
                  Accept
                </button>
                <button
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  onClick={() => RejectReq(req._id, selectedProduct._id, index)}
                >
                  Reject
                </button>
              </div>
            ) : (
              <div className={req.status === "reject" ? "text-red-600 pr-2" : "pr-2 text-green-600"}>
                {req.status.toUpperCase()}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  </div>
)}
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold">Confirm Deletion</h2>
            <p className="text-gray-500">Are you sure you want to delete this product?</p>
            <div className="flex justify-between mt-4">
              <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 border rounded">
                Cancel
              </button>
              <button onClick={handleDeleteProduct} className="px-4 py-2 bg-red-500 text-white rounded">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;

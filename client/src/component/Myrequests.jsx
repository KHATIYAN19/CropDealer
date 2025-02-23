import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

function MyRequests() {
  const [requests, setRequests] = useState([]);
  const { token } = useSelector((state) => state.auth);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [quantity, setQuantity] = useState("");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get("http://localhost:8880/request/myRequest", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRequests(response.data.requests);
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };
    fetchRequests();
  }, [token]);

  const openEditModal = (request) => {
    setSelectedRequest(request);
    setNewMessage(request.message);
    setQuantity(request.quantity);
    setModalOpen(true);
  };

  const openDeleteModal = (request) => {
    setSelectedRequest(request);
    setDeleteModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setDeleteModalOpen(false);
    setSelectedRequest(null);
  };

  const handleUpdate = async () => {
    if (!selectedRequest) return;
    try {
      const updatedData = { message: newMessage, quantity: Number(quantity) };
      const res = await axios.patch(`http://localhost:8880/request/update/${selectedRequest.product._id}/${selectedRequest._id}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setRequests((prev) =>
          prev.map((req) =>
            req._id === selectedRequest._id ? { ...req, ...updatedData } : req
          )
        );
        closeModal();
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.error("Error updating request:", error);
    }
  };

  const handleDelete = async () => {
    if (!selectedRequest) return;
    try {
      const res=await axios.delete(`http://localhost:8880/request/delete/${selectedRequest.product._id}/${selectedRequest._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if(res.data.success){
        setRequests((prev) => prev.filter((req) => req._id !== selectedRequest._id));
        closeModal();
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message)
      console.error("Error deleting request:", error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">My Requests</h2>
      {requests.length === 0 ? (
        <p className="text-gray-500">No requests found.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {requests.map((req) => (
            <div key={req._id} className="bg-white shadow-md p-4 rounded-lg border flex items-center">
              {req.product && req.product.image && (
                <img src={req.product.image} alt={req.product.name} className="w-24 h-24 rounded-md object-cover mr-4" />
              )}
              <div className="flex flex-col flex-grow">
                {req.product && (
                  <div className="mb-2">
                    <h3 className="text-lg font-semibold">🛒 {req.product.name}</h3>
                    <p className="text-gray-700">📦 Total Quantity: {req.product.quantity} Quintals</p>
                    <p className="text-gray-700">💰 Price Per Quintal: ₹{req.product.price}</p>
                  </div>
                )}
                <div className="bg-gray-100 p-3 rounded-md">
                  <h4 className="text-md font-semibold">📝 Request</h4>
                  <p className="text-gray-700">💰 Price: ₹{req.price}</p>
                  <p className="text-gray-700">📦 Quantity Requested: {req.quantity} Quintals</p>
                  <p className={`font-bold mt-2 ${
                    req.status === "pending"
                      ? "text-yellow-500"
                      : req.status === "approved"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}>
                    {req.status.toUpperCase()}
                  </p>
                </div>
                {req.status === "pending" && (
                  <div className="mt-3 flex gap-2">
                    <button onClick={() => openEditModal(req)} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                      Edit
                    </button>
                    <button onClick={() => openDeleteModal(req)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      {(modalOpen || deleteModalOpen) && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            {modalOpen ? (
              <>
                <h3 className="text-lg font-bold mb-3">Edit Request</h3>
                <label className="block text-gray-700 text-sm font-bold mb-1">Message</label>
                <input type="text" className="w-full p-2 border rounded mb-3" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
                <label className="block text-gray-700 text-sm font-bold mb-1">Quantity</label>
                <input type="number" className="w-full p-2 border rounded mb-3" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
                <div className="flex justify-end gap-2">
                  <button onClick={handleUpdate} className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">Update</button>
                  <button onClick={closeModal} className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600">Cancel</button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-lg font-bold mb-3">Confirm Delete</h3>
                <p>Are you sure you want to delete this request?</p>
                <div className="flex justify-end gap-2 mt-4">
                  <button onClick={handleDelete} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Delete</button>
                  <button onClick={closeModal} className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600">Cancel</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
export default MyRequests;

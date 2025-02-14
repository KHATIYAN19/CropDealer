import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function MyRequests() {
  const [requests, setRequests] = useState([]);
  const { token } = useSelector((state) => state.auth);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [quantity, setQuantity] = useState("");

  // Fetch requests from API
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get("http://localhost:8880/request/myRequest", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Fetched Data:", response.data);
        setRequests(response.data.requests); // Ensure correct response structure
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };
    fetchRequests();
  }, [token]);

  // Open Edit Modal
  const openEditModal = (request) => {
    setSelectedRequest(request);
    setNewMessage(request.message);
    setQuantity(request.quantity);
    setModalOpen(true);
  };

  // Close Modal
  const closeModal = () => {
    setModalOpen(false);
    setSelectedRequest(null);
  };

  // Handle Update (Message & Price in One Request)
  const handleUpdate = async () => {
    if (!selectedRequest) return;

    try {
      const updatedData = { message: newMessage, quantity: Number(quantity) };

      await axios.patch(`http://localhost:8880/request/update/${selectedRequest.product._id}/${selectedRequest._id}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setRequests((prev) =>
        prev.map((req) =>
          req._id === selectedRequest._id ? { ...req, ...updatedData } : req
        )
      );
      closeModal();
    } catch (error) {
      console.error("Error updating request:", error);
    }
  };

  // Handle Delete
  const handleDelete = async (id) => {
    if (!selectedRequest) return;
    try {
      await axios.delete(`http://localhost:8880/request/delete/${selectedRequest.product._id}/${selectedRequest._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests((prev) => prev.filter((req) => req._id !== id));
    } catch (error) {
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
              {/* ✅ Product Image */}
              {req.product && req.product.image && (
                <img src={req.product.image} alt={req.product.name} className="w-24 h-24 rounded-md object-cover mr-4" />
              )}

              <div className="flex flex-col flex-grow">
                {/* ✅ Product Details */}
                {req.product && (
                  <div className="mb-2">
                    <h3 className="text-lg font-semibold">🛒 {req.product.name}</h3>
                    <p className="text-gray-700">📦 Total Quantity: {req.product.quantity} Quintals</p>
                    <p className="text-gray-700">💰 Price Per Quintal: ₹{req.product.price}</p>
                  </div>
                )}

                {/* ✅ Request Details */}
                <div className="bg-gray-100 p-3 rounded-md">
                  <h4 className="text-md font-semibold">📝 Request</h4>
                  <p className="text-gray-700">💰  Price: ₹{req.price}</p>
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

                {/* ✅ Buttons for Pending Requests */}
                {req.status === "pending" && (
                  <div className="mt-3 flex gap-2">
                    <button onClick={() => openEditModal(req)} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                      Edit
                    </button>
                    <button onClick={() => handleDelete()} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ✅ Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-bold mb-3">Edit Request</h3>
            <label className="block text-gray-700 text-sm font-bold mb-1">Message</label>
            <input
              type="text"
              className="w-full p-2 border rounded mb-3"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <label className="block text-gray-700 text-sm font-bold mb-1">Qunatity</label>
            <input
              type="number"
              className="w-full p-2 border rounded mb-3"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button onClick={handleUpdate} className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">
                Update
              </button>
              <button onClick={closeModal} className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyRequests;

import React from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useState,useEffect } from "react";
import axios from "axios";

const MyOrders = () => {
  const {token}=useSelector((state)=>state.auth);
  const [orders,setOrders]=useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8880/orders/getmyorder", {
          headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` },
        });
        setOrders(response.data.orders);
        console.log(response.data.orders);
      } catch (err) {
      
      }
    };

    fetchData();
  }, []); 
  
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-500 text-white";
      case "cancelled":
        return "bg-red-500 text-white";
      case "pending":
        return "bg-yellow-300 text-black";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const formatDate = (createdAt) => {
    const date = new Date(createdAt);
    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "short" });
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12; // Convert 0 to 12 for 12 AM

    return `${day}-${month}-${year} ${formattedHours}:${minutes} ${ampm}`;
};

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-4">My Orders</h1>
      <div className="bg-white p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-3">Order History</h2>
        {orders.map((order) => (
          <div
            key={order.id}
            className="flex items-center justify-between border-b border-gray-200 py-4"
          >
            <div className="flex items-center space-x-4">
              <img src={order?.product?.image} alt={order?.title} className="w-20 h-20 rounded-md" />
              <div>
                <h3 className="text-lg font-semibold">{order?.product?.name}</h3>
                <p className="text-sm text-gray-500">Order: #{order?.order_id}</p>
                <p className="font-semibold">Price: {order.price} INR</p>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              <p>Quantity: {order.quantity}</p>
              <p>Location: {order?.product?.location}</p>
            </div>
            <div className="text-sm text-gray-600">
              <p>Placed Date</p>
              <p className="font-semibold">{formatDate(order?.createdAt)}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
              {order.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
export default MyOrders;

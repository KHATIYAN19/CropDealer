import React, { useState } from "react";
import { FaShoppingCart, FaEdit } from "react-icons/fa";
import axios from "axios";
import { z } from "zod";

const orderSchema = z.object({
    quantity: z.string().min(1, "Quantity is required").refine(val => !isNaN(val) && Number(val) > 0, {
        message: "Quantity must be a positive number"
    }),
    message: z.string().min(5, "Message should be at least 5 characters"),
});

const products = [
    {
        id: 1,
        owner: "John Doe",
        ownerImage: "https://randomuser.me/api/portraits/men/1.jpg",
        phone: "9876543210",
        email: "john@example.com",
        location: "Pune",
        state: "Maharashtra",
        pincode: "411001",
        image: "https://source.unsplash.com/300x200/?wheat",
        name: "Wheat",
        quantity: 50,
        price: 1800,
        postedDate: "Feb 10, 2025",
        description: "High-quality wheat grains for sale. These grains are freshly harvested and organic, ensuring great nutrition and taste.",
    },
    {
        id: 2,
        owner: "Lavi Kumar",
        ownerImage: "https://randomuser.me/api/portraits/men/2.jpg",
        phone: "9123456789",
        email: "lavi@12",
        location: "Jaipur",
        state: "Rajasthan",
        pincode: "302001",
        image: "https://source.unsplash.com/300x200/?rice",
        name: "Rice",
        quantity: 70,
        price: 2200,
        postedDate: "Feb 12, 2025",
        description: "Premium organic rice with excellent quality and high nutritional value. Sourced from the best farms in India.",
    },
];

const ProductList = () => {
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [quantity, setQuantity] = useState("");
    const [message, setMessage] = useState("");
    const [errors, setErrors] = useState({});
    const [expandedDescriptions, setExpandedDescriptions] = useState({});

    const toggleDescription = (id) => {
        setExpandedDescriptions(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const openModal = (product) => {
        setSelectedProduct(product);
        setQuantity("");
        setMessage("");
        setErrors({});
    };

    const closeModal = () => {
        setSelectedProduct(null);
    };

    const handleOrder = async () => {
        try {
            const orderData = { quantity, message };
            orderSchema.parse(orderData);

            if (Number(quantity) > selectedProduct.quantity) {
                setErrors({ quantity: `Only ${selectedProduct.quantity} quintals available!` });
                return;
            }

            await axios.post("/api/order", {
                productId: selectedProduct.id,
                quantity: Number(quantity),
                message,
            });

            alert("Order request sent!");
            closeModal();
        } catch (err) {
            setErrors(err.errors?.reduce((acc, cur) => ({ ...acc, [cur.path[0]]: cur.message }), {}) || {});
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">🌾 Available Crops</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => {
                    const isExpanded = expandedDescriptions[product.id];
                    const displayDescription = isExpanded ? product.description : product.description.slice(0, 50) + (product.description.length > 50 ? "..." : "");

                    return (
                        <div key={product.id} className="bg-white p-4 rounded-xl shadow-lg border border-gray-200">
                            <div className="flex items-center gap-4 mb-4 border-b pb-2">
                                <img src={product.ownerImage} alt={product.owner} className="w-12 h-12 rounded-full border-2 border-blue-500" />
                                <div>
                                    <h3 className="text-gray-800 font-semibold">{product.owner}</h3>
                                    <p className="text-gray-500 text-sm">{product.location}, {product.state} - {product.pincode}</p>
                                    <p className="text-gray-500 text-sm">📧 {product.email}</p>
                                    <p className="text-gray-500 text-sm">📞 {product.phone}</p>
                                </div>
                            </div>

                            <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded-md mb-4" />

                            <h2 className="text-xl font-bold text-gray-800">{product.name}</h2>
                            
                            <p className="text-gray-600 text-sm mb-2">
                                {displayDescription}
                                {product.description.length > 50 && (
                                    <span 
                                        className="text-blue-500 cursor-pointer font-semibold" 
                                        onClick={() => toggleDescription(product.id)}
                                    >
                                        {isExpanded ? " Read Less" : " Read More"}
                                    </span>
                                )}
                            </p>

                            <div className="text-gray-700">
                                <p><span className="font-semibold">Quantity:</span> {product.quantity} Quintals</p>
                                <p><span className="font-semibold">Price:</span> ₹{product.price} per Quintal</p>
                                <p className="text-sm text-gray-500">📅 Posted on: {product.postedDate}</p>
                            </div>

                            {product.email === "lavi@12" ? (
                                <button className="mt-4 w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2">
                                    <FaEdit />
                                    Edit Product
                                </button>
                            ) : (
                                <button
                                    className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2"
                                    onClick={() => openModal(product)}
                                >
                                    <FaShoppingCart />
                                    Buy Now
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>

            {selectedProduct && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center backdrop-blur-sm"
                     onClick={closeModal}>
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Buy {selectedProduct.name}</h2>

                        <label className="block text-gray-700 text-sm font-medium">Message:</label>
                        <textarea className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                                  value={message} onChange={(e) => setMessage(e.target.value)} />
                        {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}

                        <label className="block text-gray-700 text-sm font-medium mt-4">Quantity (Quintals):</label>
                        <input type="number" className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                               value={quantity} onChange={(e) => setQuantity(e.target.value)} />
                        {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>}

                        <p className="text-sm text-gray-600 mt-4">⚠ You can't cancel order if owner accepts request.</p>

                        <div className="flex justify-end mt-4 gap-2">
                            <button className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500" onClick={closeModal}>Cancel</button>
                            <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600" onClick={handleOrder}>Confirm Order</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductList;

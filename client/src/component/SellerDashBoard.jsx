import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { FaShoppingCart, FaDollarSign, FaBox, FaUsers, FaChartLine } from "react-icons/fa";

// Dummy Data
const salesData = [
    { name: "Jan", sales: 1200 },
    { name: "Feb", sales: 2100 },
    { name: "Mar", sales: 800 },
    { name: "Apr", sales: 1600 },
    { name: "May", sales: 2500 },
    { name: "Jun", sales: 3000 },
    { name: "Jul", sales: 2800 },
];

const recentOrders = [
    { id: 1, product: "Wheat", customer: "John Doe", amount: "$120", status: "Completed", date: "Feb 18, 2025" },
    { id: 2, product: "Rice", customer: "Alice Smith", amount: "$90", status: "Pending", date: "Feb 17, 2025" },
    { id: 3, product: "Corn", customer: "Michael Brown", amount: "$150", status: "Completed", date: "Feb 16, 2025" },
    { id: 4, product: "Barley", customer: "Sophia Lee", amount: "$200", status: "Shipped", date: "Feb 15, 2025" },
];

const topProducts = [
    { name: "Wheat", sales: 200 },
    { name: "Rice", sales: 150 },
    { name: "Corn", sales: 100 },
    { name: "Barley", sales: 80 },
    { name: "Oats", sales: 60 },
];

const SellerDashboard = () => {
    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Seller Dashboard</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
                    <FaShoppingCart className="text-blue-500 text-3xl" />
                    <div>
                        <h2 className="text-gray-700 text-lg">Total Orders</h2>
                        <p className="text-2xl font-bold">320</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
                    <FaDollarSign className="text-green-500 text-3xl" />
                    <div>
                        <h2 className="text-gray-700 text-lg">Revenue</h2>
                        <p className="text-2xl font-bold">$14,200</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
                    <FaBox className="text-yellow-500 text-3xl" />
                    <div>
                        <h2 className="text-gray-700 text-lg">Products Sold</h2>
                        <p className="text-2xl font-bold">850</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
                    <FaUsers className="text-purple-500 text-3xl" />
                    <div>
                        <h2 className="text-gray-700 text-lg">New Customers</h2>
                        <p className="text-2xl font-bold">120</p>
                    </div>
                </div>
            </div>

            {/* Charts and Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Sales Graph */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">Sales Overview</h2>
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={salesData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Recent Orders Table */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">Recent Orders</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="p-2">Product</th>
                                    <th className="p-2">Customer</th>
                                    <th className="p-2">Amount</th>
                                    <th className="p-2">Status</th>
                                    <th className="p-2">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.map((order) => (
                                    <tr key={order.id} className="border-t">
                                        <td className="p-2">{order.product}</td>
                                        <td className="p-2">{order.customer}</td>
                                        <td className="p-2">{order.amount}</td>
                                        <td className={`p-2 ${order.status === "Completed" ? "text-green-500" : "text-yellow-500"}`}>
                                            {order.status}
                                        </td>
                                        <td className="p-2">{order.date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Top Selling Products */}
            <div className="bg-white p-6 rounded-lg shadow-md mt-6">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">Top Selling Products</h2>
                <div className="space-y-3">
                    {topProducts.map((product, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-gray-100 rounded-lg">
                            <span className="text-gray-800">{product.name}</span>
                            <div className="w-2/3 bg-gray-300 h-3 rounded-full overflow-hidden">
                                <div className={`h-full ${index === 0 ? "bg-blue-500" : "bg-green-500"}`} style={{ width: `${(product.sales / 200) * 100}%` }}></div>
                            </div>
                            <span className="text-gray-600">{product.sales} Sold</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SellerDashboard;

import { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowDown, CheckCircle, XCircle } from 'lucide-react';

const ReceivedOrder = () => {
  const generateDummyOrders = () => {
    const products = [
      'Wireless Headphones',
      'Smart Watch Series 7',
      'Leather Office Chair',
      '4K Ultra HD Camera',
      'Wireless Mechanical Keyboard',
      'Noise Cancelling Headphones',
      'Ergonomic Mouse',
      'Gaming Monitor 27"',
      'Bluetooth Speaker',
      'USB-C Docking Station'
    ];

    return Array(10).fill().map((_, index) => ({
      id: index + 1,
      product: {
        image: `https://picsum.photos/120/120?random=${index}`,
        name: products[index],
        price: Math.floor(Math.random() * 5000) + 1000,
        quantity: Math.floor(Math.random() * 3) + 1,
      },
      buyer: {
        name: ['John Doe', 'Jane Smith', 'Bob Johnson', 'Alice Williams'][index % 4],
        phone: `+91 98765 43${index.toString().padStart(2, '0')}`,
        email: `buyer${index}@example.com`
      },
      status: ['pending', 'completed', 'cancelled'][index % 3],
      orderDate: new Date(2024, 0, index + 1).toLocaleDateString('en-IN')
    }));
  };

  // State management
  const [orders, setOrders] = useState(generateDummyOrders());
  const [loadingStates, setLoadingStates] = useState({});

  const statusColors = {
    pending: 'bg-amber-100 text-amber-800',
    completed: 'bg-emerald-100 text-emerald-800',
    cancelled: 'bg-red-100 text-red-800'
  };

  const handleStatusChange = async (orderId, newStatus) => {
    const originalOrders = [...orders];
    
    try {
      setLoadingStates(prev => ({ ...prev, [orderId]: true }));
      
      // Optimistic UI update
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));

      // Simulated API call
      await axios.put(`https://api.example.com/orders/${orderId}/status`, {
        status: newStatus
      });

    } catch (error) {
      console.error('Error updating status:', error);
      setOrders(originalOrders);
    } finally {
      setLoadingStates(prev => ({ ...prev, [orderId]: false }));
    }
  };

  const StatusDropdown = ({ status, orderId }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    useEffect(() => {
      const handleClickOutside = (e) => {
        if (!e.target.closest('.status-dropdown')) setIsOpen(false);
      };
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    return (
      <div className="status-dropdown relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          disabled={loadingStates[orderId]}
          className={`${statusColors[status]} px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${
            status === 'pending' ? 'hover:bg-amber-200' : ''
          }`}
        >
          {loadingStates[orderId] ? (
            <span className="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
          ) : (
            <>
              {status === 'completed' && <CheckCircle size={16} />}
              {status === 'cancelled' && <XCircle size={16} />}
              {status.charAt(0).toUpperCase() + status.slice(1)}
              {status === 'pending' && <ArrowDown size={14} className="ml-1" />}
            </>
          )}
        </button>
        
        {isOpen && status === 'pending' && (
          <div className="absolute top-12 right-0 bg-white border border-gray-200 rounded-lg shadow-xl z-10 w-48 overflow-hidden">
            <button
              onClick={() => handleStatusChange(orderId, 'completed')}
              className="w-full px-4 py-3 text-sm flex items-center gap-2 hover:bg-green-50 text-green-700"
            >
              <CheckCircle size={16} />
              Mark Completed
            </button>
            <button
              onClick={() => handleStatusChange(orderId, 'cancelled')}
              className="w-full px-4 py-3 text-sm flex items-center gap-2 hover:bg-red-50 text-red-700 border-t border-gray-200"
            >
              <XCircle size={16} />
              Mark Cancelled
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Order Management</h1>
      
      <div className="grid gap-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-[120px_1fr_160px] gap-4">
              <div className="flex items-center">
                <img 
                  src={order.product.image} 
                  alt={order.product.name}
                  className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-lg border border-gray-100"
                />
              </div>
              
              <div className="space-y-3">
                <div className="flex items-baseline justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {order.product.name}
                  </h2>
                  <span className="text-sm text-gray-500">{order.orderDate}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">Unit Price:</span>
                      <span className="font-medium">₹{order.product.price.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">Quantity:</span>
                      <span className="font-medium">{order.product.quantity}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">Total:</span>
                      <span className="font-medium text-blue-600">
                        ₹{(order.product.price * order.product.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">Buyer:</span>
                      <span className="font-medium">{order.buyer.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">Contact:</span>
                      <a href={`tel:${order.buyer.phone}`} className="hover:text-blue-600">
                        {order.buyer.phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">Email:</span>
                      <a 
                        href={`mailto:${order.buyer.email}`} 
                        className="hover:text-blue-600 truncate block max-w-[160px]"
                      >
                        {order.buyer.email}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end justify-between">
                <StatusDropdown 
                  status={order.status} 
                  orderId={order.id}
                />
                <div className="mt-4 text-xs text-gray-400">
                  Order ID: #{order.id.toString().padStart(4, '0')}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReceivedOrder;
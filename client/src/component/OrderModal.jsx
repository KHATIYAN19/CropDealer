// OrderModal.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const OrderModal = ({ isOpen, onClose, product }) => {
  const [quantity, setQuantity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [error, setError] = useState('');
  const { token } = useSelector((state) => state.auth);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setQuantity(1);
      setOrderDetails(null);
      setError('');
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await axios.post(
        `http://localhost:8880/orders/create/${product._id}`,
        { quantity },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
        }
      );

      if (response.data.success) {
        setOrderDetails({
          id: response.data.order.order_id,
          quantity: quantity,
          productName: product.name,
          price: product.price,
          total: (product.price * quantity).toFixed(2),
          message: response.data.message || 'Your order has been placed successfully!'
        });
      }
    } catch (err) {
      console.log(err);
      setError(err?.response?.data?.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />
      
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="bg-white rounded-lg p-6 w-full max-w-md mx-auto z-50">
          {!orderDetails ? (
            <form onSubmit={handleSubmit}>
              <h2 className="text-2xl font-bold mb-4">Order {product.name}</h2>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Quantity
                </label>
                <input
                  type=""
                  min=""
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  
                />
              </div>

              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
                <p className="text-sm">
                  ⚠️ Important: You cannot cancel this order after placement, 
                  you must collect your order yourself from our location.
                </p>
              </div>

              {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center"
                  disabled={isSubmitting}
                >
                  {isSubmitting && (
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                  {isSubmitting ? 'Processing...' : 'Confirm Purchase'}
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center">
              <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6">
                <h3 className="text-xl font-bold mb-2">🎉 Order Created!</h3>
                <p className="text-sm">Your order has been successfully placed!</p>
              </div>

              <div className="text-left space-y-2 mb-4">
                <p><span className="font-semibold">Order ID:</span> {orderDetails.id}</p>
                <p><span className="font-semibold">Product:</span> {orderDetails.productName}</p>
                <p><span className="font-semibold">Quantity:</span> {orderDetails.quantity}</p>
                <p><span className="font-semibold">Total Price:</span> {orderDetails.total} INR</p>
                <p className="mt-4 text-sm text-red-500">
                  Remember: You must collect your order personally from Seller location.
                </p>
              </div>
              <button
                onClick={onClose}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderModal;
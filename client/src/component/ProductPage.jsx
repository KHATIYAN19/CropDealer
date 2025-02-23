import React, { useState, useEffect } from "react";
import { Send, Trash2, Pencil, MapPin } from "lucide-react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Map from "./Map";
import OrderModal from "./OrderModal";
const ProductPage = () => {
  const { id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { token, user } = useSelector((state) => state.auth);
  const [product, setProduct] = useState(null);
  const [commentText, setCommentText] = useState("");

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`http://localhost:8880/product/getProduct/${id}`, {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      console.log(response.data.products[0]);
      setProduct(response.data.products[0]);
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [id]);

  const formatTimeAgo = (createdAt) => {
    const createdTime = new Date(createdAt);
    const now = new Date();
    const diffInMs = now - createdTime;
    const diffInSeconds = Math.floor(diffInMs / 1000);
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`;
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      return `${diffInDays} days ago`;
    }
  };


  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    try {
      const response = await axios.post(
        `http://localhost:8880/comment/create/${id}`,
        { productId: id, comment: commentText },
        { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200) {
        setProduct((prev) => ({
          ...prev,
          comments: [...prev.comments, { user, comment: commentText, createdAt: new Date(), _id: response.data.comment._id }],
        }));
        setCommentText("");
        toast.success("Commented");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const response = await axios.delete(`http://localhost:8880/comment/delete/${commentId}`, {
        data: { commentId },
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        setProduct((prev) => ({
          ...prev,
          comments: prev.comments.filter((comment) => comment._id !== commentId),
        }));
        toast.success("Comment deleted");
      }
    } catch (err) {
      console.log(err);

      toast.error("Failed to delete comment");
    }
  };
  const address = `${product?.location || ""}, ${product?.state || ""}, ${product?.pincode || ""}`.trim() || "India";
  return (
    <div className="w-full p-6 bg-white shadow-lg rounded-lg">
      <div className="w-full space-y-4 px-2">
        {/* Product Image with Owner Actions */}
        <div className="relative group">
          <div className="bg-gray-100 rounded-xl overflow-hidden h-48">
            <img
              className="w-full h-full object-cover"
              src={product?.image}
              alt={product?.name}
            />
          </div>

          {user?._id === product?.owner?._id && (
            <div className="absolute top-2 right-2 flex gap-2">
              <button className="p-1.5 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm hover:bg-white transition-all">
                <Pencil className="w-4 h-4 text-gray-700" />
              </button>
              <button className="p-1.5 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm hover:bg-white transition-all">
                <Trash2 className="w-4 h-4 text-red-600" />
              </button>
            </div>
          )}
        </div>

        {/* Seller Info Section */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-gray-50 rounded-xl">
          <div className="flex items-center gap-3">
            <img
              src={product?.owner?.image}
              alt="Seller"
              className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
            />
            <div>
              <h2 className="text-md font-semibold text-gray-900 truncate max-w-[180px]">
                {product?.owner?.name}
              </h2>
              <div className="mt-1 flex flex-wrap items-center gap-1">
                <p className="text-sm text-gray-600">{product?.owner?.email}</p>
                <span className="text-gray-400">•</span>
                <p className="text-sm text-gray-600">{product?.owner?.phone}</p>
              </div>
            </div>
          </div>

          <button
        onClick={() => setIsModalOpen(true)}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
      >
        Buy Now
      </button>

      <OrderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={product}
      />
        </div>

        {/* Product Details */}
        <div className="space-y-3 p-3 bg-gray-50 rounded-xl">
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-xl font-bold text-gray-900 truncate">
              {product?.name}
            </h1>
            <span className="flex-shrink-0 px-2 py-0.5 bg-green-100 text-green-800 text-sm rounded-full">
              {product?.quantity} Quintal
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-gray-600">
            <div className="flex items-center gap-1 text-sm">
              <MapPin className="w-4 h-4" />
              <span>
                {product?.location}, {product?.state} - {product?.pincode}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <span className="text-xl font-bold text-blue-600">
                ₹{product?.price}
              </span>
              <span className="text-sm text-gray-500">/quintal</span>
            </div>
          </div>

          <p className="text-gray-700 text-sm leading-relaxed">
            {product?.description}
          </p>
        </div>
      </div>
      <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
          <Map address={address} />
        </div>
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-6">
          Comments ({product?.comments?.length || 0})
        </h3>


       

        <div className="space-y-4 mb-8">
          {product?.comments?.length > 0 ? (
            product.comments.map((comment) => (
              <div
                key={comment._id}
                className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg relative"
              >
                <img
                  src={comment.user.image}
                  alt="User"
                  className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <h4 className="font-semibold text-gray-800">
                      {comment.user.name}
                    </h4>
                    <span className="text-sm text-gray-500">
                      {formatTimeAgo(comment.createdAt)}
                    </span>
                  </div>
                  <p className="mt-1 text-gray-600 break-words">
                    {comment.comment}
                  </p>
                </div>
                {user._id === comment.user._id && (
                  <button
                    onClick={() => handleDeleteComment(comment._id)}
                    className="text-red-500 hover:text-red-600 transition-colors p-2"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-4">
              No comments yet
            </p>
          )}
        </div>

        {/* Comment Input */}
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
          <img
            src={user.image}
            alt="User"
            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
          />
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Write a comment..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
            />
            <button
              type="button"
              onClick={handleAddComment}
              className="absolute right-2 top-2 p-2 text-blue-500 hover:text-blue-600 transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;




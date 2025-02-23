import { useState, useRef, useEffect } from "react";
import { LogOut, Trash2, User, XCircle } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {toast} from "react-toastify"
import { logout } from "../redux/authSlice";
import axios from "axios";
import { CiGift } from "react-icons/ci";
export default function Avatar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const modalRef = useRef(null);
  const user = useSelector((state) => state.auth.user);
  const token=useSelector((state)=>state.auth.token);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const logoutHandler = async () => {
    try {
      const resp=await axios.get("http://localhost:8880/logout",{
       headers: { Authorization: `Bearer ${token}` },
     }); 
      if(resp.data.success){
         toast.success("Logout Successfully")
         dispatch(logout()); 
      }
    } catch (error) {
       console.log(error)
      toast.error(error?.response?.data?.message);
    }
  };
  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

 
  const handleDeleteAccount = async () => {
    try {
      const response = await fetch("http://delete/account", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        alert("Account deleted successfully");
        navigate("/login"); 
      } else {
        alert("Failed to delete account");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
    }
    setShowConfirm(false);
  };

  return (
    <div className="relative inline-block">
      <img
        src={user?.image}
        alt="Profile"
        className="w-12 h-12 rounded-full cursor-pointer border-2 border-gray-300 hover:ring-2 hover:ring-blue-500"
        onClick={() => setIsOpen(!isOpen)}
      />

      {isOpen && (
        <div
          ref={modalRef}
          className="absolute right-0 mt-2 w-60 bg-white shadow-lg rounded-lg p-4 z-50"
        >
          <div className="flex items-center border-b pb-3">
            <img src={user.image} alt="Profile" className="w-14 h-14 rounded-full mb-2" />
            <div className="ml-3">
              <p className="font-semibold">{user.name}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>
          <button
            className="flex items-center w-full px-3 py-2 mt-3 hover:bg-gray-100 rounded"
            onClick={() => navigate("/profile")}
          >
            <User className="w-5 h-5 mr-2" />
            Profile
          </button>
          <button className="flex items-center w-full px-3 py-2 hover:bg-gray-100 rounded " onClick={() => navigate("/myorders")}>
            <CiGift  className="w-5 h-5 mr-2" />
            My Orders
          </button>
          <button className="flex items-center w-full px-3 py-2 hover:bg-gray-100 rounded text-red-500" onClick={logoutHandler}>
            <LogOut className="w-5 h-5 mr-2" />
            Logout
          </button>
          <button
            className="flex items-center w-full px-3 py-2 hover:bg-gray-100 rounded text-red-600"
            onClick={() => setShowConfirm(true)}
          >
            <Trash2 className="w-5 h-5 mr-2" />
            Delete
          </button>
        </div>
      )}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center w-80">
            <XCircle
              className="w-6 h-6 text-gray-500 absolute top-3 right-3 cursor-pointer"
              onClick={() => setShowConfirm(false)}
            />
            <p className="text-lg font-semibold mb-2">Confirm Deletion</p>
            <p className="text-gray-600 mb-4">Are you sure you want to delete your account?</p>
            <div className="flex justify-center gap-4">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={handleDeleteAccount}
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

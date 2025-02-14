import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import { toast } from "react-toastify";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai"; // Icons
import Avatar from "./Avatar";

export default function App() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [menuOpen, setMenuOpen] = useState(false);

  // Function to close menu when clicking anywhere outside
  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="bg-white px-6 flex items-center justify-between border-b border-gray-200 mb-6 relative">
      {/* Logo */}
      <NavLink className="flex items-center" to="/">
        <div className="h-10 w-fit bg-orange-600 font-bold flex items-center px-4 rounded-md">
          <div className="text-white">CROP</div>
          <div className="bg-white ml-4 px-4 text-orange-600 rounded-md">
            DEALER
          </div>
        </div>
      </NavLink>

      {/* Hamburger Icon (Visible on Medium Screens) */}
      <button className="md:hidden text-orange-600 text-2xl" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <AiOutlineClose /> : <AiOutlineMenu />}
      </button>

      {/* Navigation Links */}
      <div className={`md:flex gap-5 items-center absolute md:static top-14 left-0 bg-white w-full md:w-auto md:bg-transparent shadow-md md:shadow-none p-5 md:p-0 transform ${menuOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 transition-transform duration-300 ease-in-out`}>
        <NavLink to="/products" className="block md:inline-block p-2" onClick={closeMenu}>PRODUCTS</NavLink>
        <NavLink to="/product/sell" className="block md:inline-block p-2" onClick={closeMenu}>SELL</NavLink>
        <NavLink to="/meet" className="block md:inline-block p-2" onClick={closeMenu}>MEET</NavLink>
        <NavLink to="/contact" className="block md:inline-block p-2" onClick={closeMenu}>CONTACT</NavLink>
      </div>

      {/* Authentication Section */}
      <div className="flex gap-5">
        {!isAuthenticated ? (
          <>
            <NavLink className="bg-orange-500 h-10 text-white px-5 py-2 rounded-xl flex items-center" to="/signup">
              SIGNUP
            </NavLink>
            <NavLink className="bg-orange-500 h-10 text-white px-5 py-2 rounded-xl flex items-center" to="/login">
              LOGIN
            </NavLink>
          </>
        ) : (
          <Avatar />
        )}
      </div>

      {/* Overlay (Click to Close Menu) */}
      {menuOpen && <div className="fixed inset-0 bg-black opacity-30 md:hidden" onClick={closeMenu}></div>}
    </div>
  );
}

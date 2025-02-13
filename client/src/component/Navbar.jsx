import {NavLink} from "react-router-dom"
import "../index.css"
export default function App() {
  return (
       <div className="h-16 bg-white px-12 flex items-center justify-between border-b border-gray-200 mb-6 ">
          <NavLink className="flex items-centre" to="/">
              <div className="h-10 w-fit bg-orange-600  font-bold flex items-center px-4  rounded-md">
                     <div className="text-white">
                        CROP
                     </div>
                     <div className="bg-white ml-4 px-4 text-orange-600 rounded-md">
                        SELLER 
                     </div>
              </div>
          </NavLink>
          <div className="text-orange-600 flex align-centre justify-between gap-5 items-center">
                 <NavLink to="/crops">CROPS</NavLink>
                 <NavLink to="/dc">FOODS</NavLink>
                 <NavLink to="/meet">MEET</NavLink>
                 <NavLink to="/contact">CONTACT</NavLink>
          </div>
          <div className="flex gap-5">
                <NavLink className="bg-orange-500 h-10 text-white px-5 py-5 rounded-xl flex items-center" to="/signup">SIGNUP</NavLink>
                <NavLink className="bg-orange-500 h-10 text-white px-5 py-5 rounded-xl flex items-center" to="/login">LOGIN</NavLink>
          </div>
       </div>
  );
}

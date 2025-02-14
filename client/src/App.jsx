import './App.css'
import Navbar from './component/Navbar'
import Home from './component/Home/Home';
import Signup from "./Auth/Signup";
import Login from './Auth/Login';
import CropUploadForm from "./component/CropUploadForm"
import ContactForm from "./component/ContactForm"
import DailyDataChart from './component/DailyDataChart';
import Profile from './component/Profile';
import Products from "./component/Products"
import { Route,Routes } from 'react-router-dom';
function App() {
  return (
       <div className=" bg-white font-sans h-full text-black">
            <Navbar></Navbar>
            <Routes>
   <Route path="/" element={<Home />} />

   <Route path="/signup" element={<Signup />} />
   <Route path="/login" element={<Login />} />
   {/* <Route path="/found" element={<FoundForm />} />
   <Route path="/lost" element={<LostForm />} /> */}
   <Route path="/product/sell"  element={<CropUploadForm/>}  />
   <Route path="/products" element={<Products/>}/>
   <Route path="/profile" element={<Profile></Profile>} ></Route>
   <Route path="/contact" element={<ContactForm/>}/>
   <Route path="/dash" element={<DailyDataChart/>}/>
</Routes>


       </div>
  )
}
export default App

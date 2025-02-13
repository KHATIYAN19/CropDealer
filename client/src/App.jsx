import './App.css'
import Navbar from './component/Navbar'
import Home from './component/Home'
import Signup from "./Auth/Signup";
import Login from './Auth/Login';
import CropUploadForm from "./component/CropUploadForm"
import Demo from './component/Demo';
import DailyDataChart from './component/DailyDataChart';
import Profile from './component/Profile';
import Products from "./component/Products"
import { Route,Routes } from 'react-router-dom';
function App() {
  return (
       <div className=" bg-white font-sans h-full text-black">
            <Navbar></Navbar>
            <Routes>
   <Route path="/signup" element={<Signup />} />
   <Route path="/login" element={<Login />} />
   {/* <Route path="/found" element={<FoundForm />} />
   <Route path="/lost" element={<LostForm />} /> */}
   <Route path="/crop"  element={<CropUploadForm/>}  />
   <Route path="/crops" element={<Products/>}/>
   <Route path="/profile" element={<Profile></Profile>} ></Route>
   
</Routes>


       </div>
  )
}
export default App

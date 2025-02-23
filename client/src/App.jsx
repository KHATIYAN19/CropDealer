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
import { useSelector, useDispatch } from "react-redux";

import { Route, Routes } from 'react-router-dom';
import SellerDashboard from './component/SellerDashBoard';
import Checkout from "./component/Payment/Checkout";
import ProductList from './component/ProductList';
import ProductPage from './component/ProductPage';
import MyOrders from './component/Myorders';
import ProtectedRoute from './Auth/ProtectedRoute';
import NonProtectedRoute  from './Auth/NonProtectedRoute';
import ReceivedOrder from './component/ReceivedOrder';
function App() {

     const { isAuthenticated } = useSelector((state) => state.auth);

     return (
          <div className=" bg-white font-sans h-full text-black">
               <Navbar></Navbar>
               <Routes>


                     <Route path="/" element={<Home />} />
                     <Route path="/contact" element={<ContactForm />} />

                     <Route
                    path="/signup"
                    element={
                        <NonProtectedRoute isAuthenticated={isAuthenticated}>
                            <Signup />
                        </NonProtectedRoute>
                    }
                />
                <Route
                    path="/login"
                    element={
                        <NonProtectedRoute isAuthenticated={isAuthenticated}>
                            <Login />
                        </NonProtectedRoute>
                    }
                />



                    
                     <Route path="/myorders"
                    element={
                        <ProtectedRoute isAuthenticated={isAuthenticated}>
                            <MyOrders />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/product/sell"
                    element={
                        <ProtectedRoute isAuthenticated={isAuthenticated}>
                            <CropUploadForm />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/products"
                    element={
                        <ProtectedRoute isAuthenticated={isAuthenticated}>
                            <Products />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute isAuthenticated={isAuthenticated}>
                            <Profile />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/product/:id"
                    element={
                        <ProtectedRoute isAuthenticated={isAuthenticated}>
                            <ProductPage />
                        </ProtectedRoute>
                    }
                />

                  
                    <Route path="/orders" element={<ReceivedOrder/>}/>
                    
                   
               </Routes>
          </div>
     )
}
export default App

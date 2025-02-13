import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import {HeroUIProvider} from "@heroui/react";
  import 'react-toastify/dist/ReactToastify.css';
  import { Provider } from "react-redux";
  import store from "../src/redux/store.js"
ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
  <BrowserRouter>
   <HeroUIProvider>
   <App />
   </HeroUIProvider>
   <ToastContainer/>
  </BrowserRouter>
  </Provider>
)

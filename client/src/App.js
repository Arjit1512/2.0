import React from 'react'
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Home from './pages/Home';
import Products from './pages/Products';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductDetail from './pages/ProductDetail';
import CustomerCare from './pages/CustomerCare';
import { MyProvider } from './pages/CartContext';
import { CartDetail } from './pages/CartDetail';
import Dashboard from './pages/Dashboard';
import TAC from './pages/TAC.jsx';
import RP from './pages/RP.jsx';
import PrivacyPolicy from './pages/PP.jsx';
import Community from './pages/Feedback.jsx';
import Success from './pages/Success.jsx';

const App = () => {
  return (
    <>
    <MyProvider>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Landing />} />
            <Route path='/home' element={<Home />} />
            <Route path='/products' element={<Products />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<CartDetail />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tac" element={<TAC />} />
            <Route path="/rp" element={<RP />} />
            <Route path="/pp" element={<PrivacyPolicy />} />
            <Route path="/feedback" element={<Community />} />
            <Route path="/success" element={<Success />} />
            <Route path="/customer-care" element={<CustomerCare />} /> 
          </Routes>
        </BrowserRouter>
    </MyProvider>
    </>
  )
}

export default App
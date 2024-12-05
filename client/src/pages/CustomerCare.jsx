import '../styling/CustomerCare.css'
import React, { useState } from 'react'
import Clothes from './Clothes.jsx'
import { useNavigate, useParams } from 'react-router-dom';
import { useMyContext } from './CartContext';
import logo from "../sources/H-logo.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';
import FAQ from './FAQ.jsx';
import map from '../sources/map.png';

const CustomerCare = () => {
  const navigate = useNavigate();
  const refresh = () => {
    navigate("/");
  }
  const [isOpen, setIsOpen] = useState(false);
  const { globalUserID, setGlobalUserID } = useMyContext();
  const { loggedIn, setLoggedIn } = useMyContext();


  const handleLogout = async () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      setLoggedIn(false);
      setGlobalUserID(null);
      window.location.reload();
      console.log('User logged out successfully.');
    } catch (error) {
      console.log('Error: ', error);
    }
  }
  return (
    <div className='cc'>
      <div className='navbar not-fixed'>
        <p>WE WOULD LOVE TO HEAR FROM YOU.</p>
      </div>
      <div className='main m1 black' >
        <img src={logo} alt="logo" className='logo' onClick={refresh} />
        <div className="dropdown d1 black">
          <div className="hamburger-icon hi" onClick={() => setIsOpen(!isOpen)}>
            <span></span>
            <span></span>
            <span></span>
          </div>
          {isOpen && (
            <div className="dropdown-menu black">
              {loggedIn && (
                <a onClick={handleLogout} className="dropdown-item">Logout</a>
              )}
              {!loggedIn && (
                <a onClick={() => navigate("/login")} className="dropdown-item">Login</a>
              )}
              <a onClick={() => navigate("/cart")} className="dropdown-item">Cart</a>
              <a onClick={() => navigate("/dashboard")} className="dropdown-item">My Orders</a>
            </div>
          )}
        </div>
      </div>

      <div className='c-us'>
        <h1>Contact Us</h1>
        <p>Email, call, or complete the form to see how<br />
          True Hood can solve your problem within 3-4 days.</p>
        <ul>
          <li>✉ truehood.business@gmail.com</li>
          <li>📞+91 9618825172</li>
          <li><FontAwesomeIcon icon={faInstagram} />  truehoodclothing</li>

        </ul>
        <h3>Customer Support</h3>
        <p>Our support team is available around the clock to address any<br />
          concerns or queries you may have.</p>
      </div>

      <div className='c-us flex-row'>
      <div className='c-right'>
          <h1>Our location</h1>
          <p>Lalitha Nagar,<br />
            Ram Nagar,<br />
            Hyderabad - 500029</p>
          <p>This is our operational address for correspondence and administrative purposes.</p>
        </div>
        <div className='c-left'>
          <img src={map} alt="map.png" />
        </div>
        
      </div>


      <div className='c-us'>
        <h1>Terms and Conditions</h1>
        <p>Please review our Terms and Conditions to understand the guidelines and rules governing the use of our website and services.<br />
          Visit our <a onClick={() => navigate("/tac")}>Terms and Conditions</a> page for more information.</p>
      </div>

      <div className='c-us'>
        <h1>FAQs</h1>
        <p>Before reaching out, you may find answers to common questions in our FAQs section. Here are some frequently asked questions:</p>
        <FAQ />
      </div>

      <div className='c-us'>
        <h1>Return Policy</h1>
        <p>Currently we are sorry to tell you that we are not interested in taking any returns of our products.<br />
          Please visit our <a onClick={() => navigate("/rp")}>Return Policy</a> page for more information.</p>
      </div>

      <div className='c-us'>
        <h1>Privacy & Security</h1>
        <p>Your privacy and security are important to us. Learn how we protect your information and ensure secure transactions.<br />
          Please read our <a onClick={() => navigate("/pp")}>Privacy Policy</a> for more information.</p>
      </div>

      <div className='c-us'>
        <h1>Feedback</h1>
        <p>We value your feedback! Help us improve by sharing your thoughts and suggestions.<br />
        Submit your feedback through our <a onClick={() => navigate("/feedback")}>Feedback Form</a>.</p>
      </div>
    </div>
  )
}

export default CustomerCare
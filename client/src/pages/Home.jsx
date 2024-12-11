import React from 'react'
import logo from "../sources/H-logo.png";
import logo1 from "../sources/hnigg.png";
import '../styling/Home.css';
import { useNavigate, Link } from 'react-router-dom';
import vid from "../sources/thunder.mp4";
import videoSource from '../sources/Hstar.gif';
import ts from '../sources/ts.jpg';
import { useState } from 'react';
import { useMyContext } from './CartContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faInstagram, faFacebook, faTwitter } from '@fortawesome/free-brands-svg-icons';
import i1 from "../sources/i1.jpg";
import i2 from "../sources/i2.jpg";
import i3 from "../sources/i3.jpg";
import i4 from "../sources/i4.jpg";
import i13 from "../sources/i13.png";
import i14 from "../sources/i14.png";
import i7 from "../sources/i7.png";
import i8 from "../sources/i8.png";

const Home = () => {
  const navigate = useNavigate();
  const { globalUserID, setGlobalUserID } = useMyContext();
  const [isOpen, setIsOpen] = useState(false);
  const { loggedIn, setLoggedIn } = useMyContext();
  const refresh = () => {
    window.location.reload();
  }
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

  const handleClick = (id) => {
    navigate(`/products/${id}`);
    window.scrollTo(0, 0);
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE, and Opera
  };


  return (
    <div>
      <div className='navbar'>
        <p>WE THE INDEPENDENT</p>
      </div>

      <section className="video-background">
        <video autoPlay muted loop className="background-video">
          <source src={vid} type="video/mp4" alt="video" />
        </video>
        <div className='main' >
          <img src={logo} alt="logo" className='logo' onClick={refresh} />

          <h3 onClick={() => navigate("/products")}>SHOP</h3>
          <h3 onClick={() => navigate("/products")}>COLLECTIONS</h3>

          <h3 onClick={() => navigate("/customer-care")}>CUSTOMER CARE</h3>

          <div className="dropdown">
            <div className="hamburger-icon" onClick={() => setIsOpen(!isOpen)}>
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
                <a onClick={() => navigate("/products")} className="dropdown-item">SALE</a>
                <a onClick={() => navigate("/cart")} className="dropdown-item">Cart</a>
                <a onClick={() => navigate("/dashboard")} className="dropdown-item">My Orders</a>
                <a onClick={() => navigate("/customer-care")} className="dropdown-item">Customer Care</a>
              </div>
            )}
          </div>
        </div>


        <div className='th'>
          <h1>TRUE<span>&nbsp;H</span>OOD</h1>
        </div>
      </section>

      <section id='home-div'>
        <div className='flex-row hr fr1'>
          <div className='flex-col hc' onClick={() => handleClick(1)}>
            <img src={i1} className="body-img-top" alt="T-Shirt Green" />
            <img src={i2} className="body-img-hover" alt="T-Shirt Green Hover" />
            <div className="body-body">
              <p className='gray-text'>OVERSIZED T-SHIRT</p>
              <h5 className="body-title">Vengeance of the Hood</h5>
              <p className="body-text"> ₹699.00</p>
              {/* <div className='discount'>-21%</div> */}
            </div>
          </div>

          <div className='flex-col hc' onClick={() => handleClick(3)}>
            <img src={i3} className="body-img-top" alt="T-Shirt Green" />
            <img src={i4} className="body-img-hover" alt="T-Shirt Green Hover" />
            <div className="body-body">
              <p className='gray-text'>OVERSIZED T-SHIRT</p>
              <h5 className="body-title">True Hood Original</h5>
              <p className="body-text"> ₹599.00</p>
            </div>
          </div>

          <div className='flex-col hc' onClick={() => handleClick(13)}>
            <img src={i13} className="body-img-top" alt="T-Shirt Green" />
            <img src={i14} className="body-img-hover" alt="T-Shirt Green Hover" />
            <div className="body-body">
              <p className='gray-text'>OVERSIZED T-SHIRT</p>
              <h5 className="body-title">Hood Over Fear</h5>
              <p className="body-text"> ₹699.00</p>
            </div>
          </div>

          <div className='flex-col hc' onClick={() => handleClick(7)}>
            <img src={i7} className="body-img-top" alt="T-Shirt Green" />
            <img src={i8} className="body-img-hover" alt="T-Shirt Green Hover" />
            <div className="body-body">
              <p className='gray-text'>OVERSIZED T-SHIRT</p>
              <h5 className="body-title">The Black Panther Tee</h5>
              <p className="body-text"> ₹799.00</p>
            </div>
          </div>
        </div>
      </section>

      <section id="part-3">
        <div className='p3-part1'>
          <h3>Discover our<br />
            latest vintage<br />
            editions and <br />
            more collection</h3>

          <p> Our dedication to excellence extends beyond<br />
            our product
            selection. We believe
            in delivering<br />
            exceptional customer
            service to ensure your<br /> satisfaction. From the
            moment you browse our website<br />
            to the time your order arrives at your doorstep,<br />
            we strive to make every step of your shopping<br />
            journey seamless and enjoyable.
          </p>
          <div className='move-a'>
            <a onClick={() => { navigate("/products"); window.scrollTo(0, 0); document.body.scrollTop = 0; document.documentElement.scrollTop = 0; }} style={{ textDecoration: "none" }}><i>view the collections</i></a>
          </div>
        </div>
        <div className='p3-part2'>
          <div className='gif-video'>
            <img src={videoSource} alt="Loading gif" />
          </div>
        </div>

      </section>

      <section id='travis'>
        <img className='ts' src={ts} alt="ts.jpg" />
        <div className='typist'>
          <p className='typewriter'>
            " We sincerely promise that our exclusive t-shirt designs, crafted with the finest fabrics and the latest trends, will not only match your style but also<br />
            leave you absolutely impressed with their comfort and uniqueness. Experience the perfect blend of fashion and quality like never before! "
          </p>
        </div>
      </section>


      <section id='footer'>
        <div className='mp'>
          <img src={logo1} alt="logo.png" />
          <div className='move-p'>
            <p className='inv-rev'>Born in the hood and praised on the street,<br />
              True Hood has firmly settled itself as an iconic<br />
              street wear brand inspired by innovation and style.</p>
          </div>
        </div>
        <div className='mp1'>
          <h4>Customer</h4>
          <a onClick={() => navigate("/customer-care")}>FAQ</a>
          <a onClick={() => navigate("/dashboard")}>My Orders</a>
          <a onClick={() => navigate("/customer-care")}>Contact Us</a>
          <a onClick={() => navigate("/rp")}>Returns</a>
        </div>
        <div className='mp1'>
          <h4>Navigate</h4>
          <a onClick={() => navigate("/login")}>Login</a>
          <a onClick={() => navigate("/tac")}>Terms & Conditions</a>
          <a onClick={() => navigate("/rp")}>Refund Policy</a>
          <a onClick={() => navigate("/register")}>Register</a>
        </div>
        <div className='mp1'>
          <h4>Follow us at</h4>
          <div className='flex-row'>
            <a href="mailto:truehood.business@gmail.com" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faEnvelope} />
            </a>
            <a href="https://www.instagram.com/truehoodclothing" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faInstagram} />
            </a>
            <a href="/tac" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faFacebook} />
            </a>
          </div>
        </div>


      </section>
      <div className='copyright'>
        <h3>© Copyright 2024 True Hood</h3>
      </div>
    </div>
  )
}

export default Home
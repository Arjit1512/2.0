import React from 'react'
import logo from "../sources/H-logo.png";
import '../styling/Home.css';
import { useNavigate, Link } from 'react-router-dom';
import vid from "../sources/thunder.mp4";
import videoSource from '../sources/Hstar.gif';
import { useState } from 'react';
import { useMyContext } from './CartContext';
import i1 from "../sources/i1.jpg";
import i2 from "../sources/i2.jpg";
import i3 from "../sources/i3.jpg";
import i4 from "../sources/i4.jpg";
import i5 from "../sources/i5.jpg";
import i6 from "../sources/i6.jpg";
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
                <a onClick={() => navigate("/cart")} className="dropdown-item">Cart</a>
                <a onClick={() => navigate("/dashboard")} className="dropdown-item">My Orders</a>
              </div>
            )}
          </div>
        </div>


        <div className='th'>
          <h1>TRUE<span>&nbsp;H</span>OOD</h1>
        </div>
      </section>

      <section id='home-div'>
        <div className='flex-row hr'>
          <div className='flex-col hc' onClick={() => { navigate("/products/1") }}>
            <img src={i1} className="body-img-top" alt="T-Shirt Green" />
            <img src={i2} className="body-img-hover" alt="T-Shirt Green Hover" />
            <div className="body-body">
              <p className='gray-text'>OVERSIZED T-SHIRT</p>
              <h5 className="body-title">Vengeance of the Hood</h5>
              <p className="body-text"> ₹699.00</p>
              {/* <div className='discount'>-21%</div> */}
            </div>
          </div>

          <div className='flex-col hc' onClick={() => { navigate("/products/3") }}>
            <img src={i3} className="body-img-top" alt="T-Shirt Green" />
            <img src={i4} className="body-img-hover" alt="T-Shirt Green Hover" />
            <div className="body-body">
              <p className='gray-text'>OVERSIZED T-SHIRT</p>
              <h5 className="body-title">True Hood Original</h5>
              <p className="body-text"> ₹599.00</p>
            </div>
          </div>

          <div className='flex-col hc' onClick={() => { navigate("/products/5") }}>
            <img src={i5} className="body-img-top" alt="T-Shirt Green" />
            <img src={i6} className="body-img-hover" alt="T-Shirt Green Hover" />
            <div className="body-body">
              <p className='gray-text'>OVERSIZED T-SHIRT</p>
              <h5 className="body-title">Vengeance of the Hood</h5>
              <p className="body-text"> ₹699.00</p>
            </div>
          </div>

          <div className='flex-col hc' onClick={() => { navigate("/products/7") }}>
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
            <Link to="/products" style={{ textDecoration: "none" }}><i>view the collections</i></Link>
          </div>
        </div>
        <div className='p3-part2'>
          <div className='gif-video'>
            <img src={videoSource} alt="Loading gif" />
          </div>
        </div>

      </section>


    </div>
  )
}

export default Home
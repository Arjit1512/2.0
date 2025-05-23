import React, { useState } from 'react';
import logo from "../sources/H-logo.png";
import Clothes from './Clothes.jsx';
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faInstagram, faFacebook, faTwitter } from '@fortawesome/free-brands-svg-icons';
import logo1 from "../sources/hnigg.png";
import Card from './Card.jsx';
import '../styling/Products.css';
import pic from '../sources/pic1.png';

const Products = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  // const [hovered, setHovered] = useState(null);
  const userID = localStorage.getItem('userID');
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  const [sortOption, setSortOption] = useState("recommended");
  const [sortedClothes, setSortedClothes] = useState(Clothes);

  const refresh = () => {
    window.location.reload();
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("userID");
      localStorage.setItem("isLoggedIn", false);
      window.location.reload();
      console.log('User logged out successfully.');
    } catch (error) {
      console.log('Error: ', error);
    }
  };

  const handleClick = (id) => {
    navigate(`/products/${id}`);
    window.scrollTo(0, 0);
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE, and Opera
  };

  // Sort function
  const handleSortChange = (e) => {
    const option = e.target.value;
    setSortOption(option);

    let sorted = [...Clothes];
    if (option === "lowToHigh") {
      sorted.sort((a, b) => a.price - b.price);
    } else if (option === "highToLow") {
      sorted.sort((a, b) => b.price - a.price);
    } else {
      sorted = Clothes;
    }
    setSortedClothes(sorted);
  };

  console.log('FINAL ISLOGGEDIN STATUS : ', isLoggedIn)
  return (
    <>
      <div className='navbar'>
        <p>THE <span className='blink'>SALE</span> IS LIVE NOW!</p>
      </div>

      <div className='main main1'>
        <img src={logo} alt="logo" className='inv-rev logo' onClick={() => navigate("/")} />
        <h3 onClick={refresh}>SHOP</h3>
        <h3 onClick={refresh}>COLLECTIONS</h3>
        <h3 onClick={() => navigate("/customer-care")}>CUSTOMER CARE</h3>

        <div className="dropdown db1">
          <div className="hamburger-icon hi" onClick={() => setIsOpen(!isOpen)}>
            <span></span>
            <span></span>
            <span></span>
          </div>
          {isOpen && (
            <div className="dropdown-menu black">
              {(isLoggedIn == "false" || (isLoggedIn == null)) && (
                <a onClick={() => navigate("/login")} className="dropdown-item">Login</a>
              )}
              {(isLoggedIn == "true") && (
                <a onClick={handleLogout} className="dropdown-item">Logout</a>
              )}
              <a onClick={() => navigate("/cart")} className="dropdown-item">Cart</a>
              <a onClick={() => navigate("/dashboard")} className="dropdown-item">My Orders</a>
            </div>
          )}
        </div>
      </div>

      {/* <div className='picture'>
        <img src={pic} alt="img.png" />
      </div> */}

      <div className='products'>
        <div className='shop flex-row'>
          <h1>OUR COLLECTIONS</h1>
          <div className="sort-dropdown">
            <select value={sortOption} onChange={handleSortChange}>
              <option value="recommended">Recommended</option>
              <option value="lowToHigh">Price: Low to High</option>
              <option value="highToLow">Price: High to Low</option>
            </select>
          </div>
        </div>
        <div className='grid'>
          {sortedClothes.map((cloth) => (
            <div key={cloth.id} onClick={() => handleClick(cloth.id)}>
              <Card
                id={cloth.id}
                imgURL={cloth.imgURL}
                name={cloth.name}
                price={cloth.price}
              />
            </div>
          ))}
        </div>
      </div>

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
            <a href="/customer-care" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faFacebook} />
            </a>
          </div>
        </div>
      </section>
      <div className='copyright'>
        <h3>© Copyright 2025 True Hood</h3>
      </div>
    </>
  );
};

export default Products;

import React, { useState } from 'react'
import logo from "../sources/H-logo.png";
import Clothes from './Clothes.jsx';
import { useNavigate, Link } from 'react-router-dom';
import Card from './Card.jsx';
import '../styling/Products.css';

const Products = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const refresh = () => {
    window.location.reload();
  }
  return (
    <>
      <div className='navbar'>
        <p>THE <span className='blink'>SALE</span> IS LIVE NOW!</p>
      </div>

      <div className='main main1' >
        <img src={logo} alt="logo" className='logo' onClick={() => navigate("/")} />


        <h3 onClick={refresh}>SHOP</h3>
        <h3 onClick={refresh}>COLLECTIONS</h3>

        <h3 onClick={() => navigate("/customer-care")}>CUSTOMER CARE</h3>

        <div className="dropdown">
            <div className="hamburger-icon hi" onClick={() => setIsOpen(!isOpen)}>
              <span></span>
              <span></span>
              <span></span>
            </div>
            {isOpen && (
              <div className="dropdown-menu">
                <a onClick={() => navigate("/login")} className="dropdown-item">Login</a>
                <a onClick={() => navigate("/cart")} className="dropdown-item">Cart</a>
                <a onClick={() => navigate("/dashboard")} className="dropdown-item">My Orders</a>
              </div>
            )}
          </div>
      </div>


      <div className='products'>

        <div className='shop'>
          <h1>Our <br />Collections</h1>
        </div>
        <div className='grid'>
          {Clothes.map((cloth) => {
            return (
              <div  onClick={() => navigate(`/products/${cloth.id}`)}>
                <Card
                  id = {cloth.id}
                  imgURL={cloth.imgURL}
                  name={cloth.name}
                  price={cloth.price}
                />
              </div>)
          })}
        </div>
      </div>
    </>
  )
}

export default Products
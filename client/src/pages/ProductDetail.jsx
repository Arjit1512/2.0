import React, { useState } from 'react'
import Clothes from './Clothes.jsx'
import { useNavigate, useParams } from 'react-router-dom';
import { useMyContext } from './CartContext';
import '../styling/ProductDetail.css';
import logo from "../sources/H-logo.png";
import axios from 'axios';
import size from "../sources/size.png";
import athlete from "../sources/athlete.jpg";
import i1 from "../sources/i1.jpg";
import i2 from "../sources/i2.jpg";
import i3 from "../sources/i3.jpg";
import i4 from "../sources/i4.jpg";
import i5 from "../sources/i5.jpg";
import i6 from "../sources/i6.jpg";
import i7 from "../sources/i7.png";
import i8 from "../sources/i8.png";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { globalUserID, setGlobalUserID } = useMyContext();
  const token = localStorage.getItem('token');
  const { loggedIn, setLoggedIn } = useMyContext();
  const [selectedSize, setSelectedSize] = useState('');
  const [popup, setPopup] = useState(false); 
  const [isOpen, setIsOpen] = useState(false);
  const refresh = () => {
    navigate("/");
  }
  const cloth = Clothes.find((item) => item.id === parseInt(id));

  const handleQuantityChange = async (id, action, size) => {
    try {

      if (size === '') {
        alert('Enter valid size!')
        return;
      }

      console.log('Button clicked');
      setPopup(true);

      console.log('Action: ', action);
      console.log('id: ', id);
      console.log('Size: ', size);

      setTimeout(() => {
        setPopup(false);
      }, 2000)



      if (action === "increase") {
        const response = await axios.post(`http://localhost:3001/${globalUserID}/add-item/${id}`, { size: size }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log(response.message);
      }
      else if (action === "decrease") {
        const response = await axios.post(`http://localhost:3001/${globalUserID}/remove-item/${id}`, { size: size }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log(response.message);
      }
    } catch (error) {
      console.log('Error: ', error);
    }
  }

  const handleSize = async (size) => {
    try {
      if (loggedIn) {
        setSelectedSize(size);
      }
      if (!loggedIn) {
        alert("Please login to add items!");
      }
    } catch (error) {
      console.log('Error: ', error);
    }
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

  if (!cloth) {
    return (
      <>
        <h1 style={{ textAlign: "center" }}>Product not found.</h1>
      </>
    )
  }

  return (
    <>
      <div className='navbar not-fixed'>
        <p>WE THE INDEPENDENT</p>
      </div>
      {popup && (
        <>
          <div className='notification-box'>
            <h3 className='blinking-text'>Item added to cart succesfully!</h3>
          </div>
        </>
      )}
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
      <div className='pd'>

        <div className='img-div pd25'>
          <img src={cloth.imgURL} alt='item-img' />
          <img src={cloth.altURL} alt='item-img' />
        </div>
        <div className='flex-row pd25'>
          <div className='left-box'>
            <h3>Product Details</h3>
            <h2>{cloth.name}</h2>
            <p>Experience ultimate comfort and style with our premium True Hood T-shirt. Crafted from 100% soft,
              breathable cotton. Whether you' re dressing up for a special occasion or keeping it casual, our
              True Hood T-shirt is the perfect choice for any wardrobe. Elevate your everyday look with the
              perfect blend of comfort and style.</p>
          </div>

          <div className='right-box'>
            <h3>Oversized t-shirt</h3>
            <h2>{cloth.name}</h2>
            <p className='black'>₹{cloth.price}.00</p>
            <div className='boxes'>
              <div className='box' onClick={() => handleSize('XS')}>XS</div>
              <div className='box' onClick={() => handleSize('S')}>S</div>
              <div className='box' onClick={() => handleSize('M')}>M</div>
              <div className='box' onClick={() => handleSize('L')}>L</div>
              <div className='box' onClick={() => handleSize('XL')}>XL</div>
            </div>
            <h3><a href="#size">Size Guide</a></h3>
            <p>Selected Size: <b>{selectedSize}</b></p>
            <button className='atc' onClick={() => handleQuantityChange(cloth.id, 'increase', selectedSize)}>Add to Cart</button>
          </div>
        </div>

        <section id="middle">
          <h3>A journey to develop ground-breaking oversized apparel.</h3>
        </section>

        <section id="size" className='pd25'>
          <div className='flex-row'>
            <div className='l-box'>
              <img src={size} alt="size.png" />
            </div>
            <div className='r-box'>
              <h3>Size Guide</h3>
              <h1>Optimized for you</h1>
              <p>True Hood apparel is crafted to embody the essence of urban culture, blending contemporary design with unmatched comfort. Each piece is tailored for a relaxed fit, allowing effortless movement while showcasing bold, authentic statements. With True Hood, you don’t just wear fashion—you represent a lifestyle that celebrates individuality, resilience, and the fearless pursuit of self-expression.</p>
              <p>
                <div className='bold'>
                  <b>If you fall between sizes, for maximum performance benefits we advise selecting the smaller size.</b>
                </div>
              </p>


              <div className='size-table-container'>
                <table className='size-table'>
                  <thead>
                    <tr>
                      <th></th>
                      <th>XS</th>
                      <th>S</th>
                      <th>M</th>
                      <th>L</th>
                      <th>XL</th>
                      <th>XXL</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <div>CHEST (IN)</div>
                        <div>(A in fig)</div>
                      </td>
                      <td>35-37</td>
                      <td>37-39</td>
                      <td>39-41</td>
                      <td>41-43</td>
                      <td>43-45</td>
                      <td>45-47</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        <section id='home-div'>
          <h1 className='or'>Our Recommendations</h1>
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
      </div>
    </>
  )
}

export default ProductDetail
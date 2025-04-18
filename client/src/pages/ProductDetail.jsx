import React, { useState } from 'react'
import Clothes from './Clothes.jsx'
import { useNavigate, useParams } from 'react-router-dom';
import '../styling/ProductDetail.css';
import logo from "../sources/H-logo.png";
import axios from 'axios';
import size from "../sources/size.png";
import athlete from "../sources/athlete.jpg";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faInstagram, faFacebook, faTwitter } from '@fortawesome/free-brands-svg-icons';
import logo1 from "../sources/hnigg.png";
import i1 from "../sources/i1.jpg";
import i2 from "../sources/i2.jpg";
import i3 from "../sources/i3.jpg";
import i4 from "../sources/i4.jpg";
import i13 from "../sources/i13.png";
import i14 from "../sources/i14.png";
import i7 from "../sources/i7.png";
import i8 from "../sources/i8.png";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [selectedSize, setSelectedSize] = useState('');
  const userID = localStorage.getItem('userID');
  const isLoggedIn = localStorage.getItem('isLoggedIn');
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

      setTimeout(() => {
        setPopup(false);
      }, 2000)

      if(!userID){
        alert('Please login to add items!')
        navigate('/login');
        return;
      }
      
      setPopup(true);

      console.log('Action: ', action);
      console.log('id: ', id);
      console.log('Size: ', size);

      if (action === "increase") {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/${userID}/add-item/${id}`, { size: size }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log(response.message);
      }
      else if (action === "decrease") {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/${userID}/remove-item/${id}`, { size: size }, {
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
      if (isLoggedIn) {
        setSelectedSize(size);
      }
      if (!isLoggedIn) {
        alert("Please login to add items!");
        navigate("/login");
      }
    } catch (error) {
      console.log('Error: ', error);
    }
  }
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
  }

  const handleClick = (id) => {
    navigate(`/products/${id}`);
    window.scrollTo(0, 0);
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE, and Opera
  };
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
        <div className="dropdown db d1 black">
          <div className="hamburger-icon hi" onClick={() => setIsOpen(!isOpen)}>
            <span></span>
            <span></span>
            <span></span>
          </div>
          {isOpen && (
            <div className="dropdown-menu black">
              {(isLoggedIn=="true") && (
                <a onClick={handleLogout} className="dropdown-item">Logout</a>
              )}
              {(isLoggedIn=="false" || (isLoggedIn==null)) && (
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
          <div className='left-box inv-rev'>
            <h3>Product Details</h3>
            <h2>{cloth.name}</h2>
            <p>Experience ultimate comfort and style with our premium True Hood T-shirt. Crafted from 100% soft,
              breathable cotton. Whether you' re dressing up for a special occasion or keeping it casual, our
              True Hood T-shirt is the perfect choice for any wardrobe.</p>
            <p>Details: Product is of 240GSM (Oversized) with a 9 x 12 inch design on it.
            </p>
          </div>

          <div className='right-box'>
            <h3>Oversized black t-shirt</h3>
            <h2>{cloth.name}</h2>
            <p className='black'>₹{cloth.price}.00</p>
            <div className='boxes'>
              <div className='box' onClick={() => handleSize('S')}>S</div>
              <div className='box' onClick={() => handleSize('M')}>M</div>
              <div className='box' onClick={() => handleSize('L')}>L</div>
              <div className='box' onClick={() => handleSize('XL')}>XL</div>
              <div className='box' onClick={() => handleSize('XXL')}>XXL</div>
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
          <div className='flex-row fr1'>
            <div className='l-box'>
              <img src={size} alt="size.png" />
            </div>
            <div className='r-box'>
              <h3>Size Guide</h3>
              <h1 className='inv-rev'>Optimized for you</h1>
              <div className='pla'>
                <p className=''>True Hood apparel is crafted to embody the essence of urban culture, blending contemporary design with unmatched comfort. Each piece is tailored for a relaxed fit, allowing effortless movement while showcasing bold, authentic statements. With True Hood, you don’t just wear fashion—you represent a lifestyle that celebrates individuality, resilience, and the fearless pursuit of self-expression.</p>
              </div>
              <p>
                <div className='bold inv-rev'>
                  <b>If you fall between sizes, for maximum performance benefits we advise selecting the smaller size.</b>
                </div>
              </p>


              <div className='size-table-container'>
                <table className='size-table'>
                  <thead>
                    <tr>
                      <th></th>
                      <th>S</th>
                      <th>M</th>
                      <th>L</th>
                      <th>XL</th>
                      <th>XXL</th>
                      <th>XXXL</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <div>CHEST (IN)</div>
                        <div>(A in fig)</div>
                      </td>
                      <td>42</td>
                      <td>44</td>
                      <td>46</td>
                      <td>48</td>
                      <td>50</td>
                      <td>52</td>
                    </tr>

                    <tr>
                      <td>
                        <div>Length (IN)</div>
                      </td>
                      <td>29</td>
                      <td>29.75</td>
                      <td>30.5</td>
                      <td>31.25</td>
                      <td>32</td>
                      <td>32.75</td>
                    </tr>

                    <tr>
                      <td>
                        <div>Shoulder (IN)</div>
                        <div>(F in fig)</div>
                      </td>
                      <td>20.5</td>
                      <td>21.25</td>
                      <td>22</td>
                      <td>22.75</td>
                      <td>23.5</td>
                      <td>24.25</td>
                    </tr>

                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* <section id='home-div'>
          <h1 className='ymal'>You may also like</h1>
          <div className='flex-row hr fr1'>
            <div className='flex-col hc' onClick={() => handleClick(1)}>
              <img src={i1} className="body-img-top" alt="T-Shirt Green" />
              <img src={i2} className="body-img-hover" alt="T-Shirt Green Hover" />
              <div className="body-body">
                <p className='gray-text'>OVERSIZED T-SHIRT</p>
                <h5 className="body-title">Vengeance of the Hood</h5>
                <p className="body-text"> ₹699.00</p>
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
        </section> */}

        <section id='footer' className='priv'>
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
      </div>
    </>
  )
}

export default ProductDetail
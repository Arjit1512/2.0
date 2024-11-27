import React, { useEffect, useState } from 'react'
import { useMyContext } from './CartContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from "../sources/H-logo.png";
import '../styling/CartDetail.css'
import Razorpay from 'razorpay';

export const CartDetail = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const Name = localStorage.getItem('userName');
    const { globalUserID, setGlobalUserID } = useMyContext();
    const [popup, setPopup] = useState(false); const [isOpen, setIsOpen] = useState(false);
    const refresh = () => {
      navigate("/");
    }
    const [flagArray, setFlagArray] = useState([]);
    const [items, setItems] = useState([]);
    const [addressPopup, showAddressPopup] = useState(false);
    const [address, setAddress] = useState({
        street: '',
        city: '',
        state: '',
        pincode: ''
    })

    if (globalUserID == null) {
        navigate("/login");
    }

    useEffect(() => {
        const handleCart = async () => {
            const response = await axios.get(`http://localhost:3001/${globalUserID}/get-cart`,{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            });
            if(response.data.message === "Cart items fetched!" || response.data.message === "Cart is empty!" ){
                setItems(response.data.items);
            }      
        }
        handleCart();
    }, [setItems, flagArray])



    const handleQuantityChange = async (id, action, size) => {
        try {
            console.log('Action: ', action);
            console.log('id: ', id);
            console.log('Size: ', size);

            if (action === "increase") {
                const response = await axios.post(`http://localhost:3001/${globalUserID}/add-item/${id}`, { size: size },{
                    headers:{
                        Authorization:`Bearer ${token}`
                    }
                });
                console.log(response.message);
                setFlagArray([...flagArray, 1]);
            }
            else if (action === "decrease") {
                const response = await axios.post(`http://localhost:3001/${globalUserID}/remove-item/${id}`, { size: size },{
                    headers:{
                        Authorization:`Bearer ${token}`
                    }
                });
                console.log(response.message);
                setFlagArray([...flagArray, -1]);
            }
        } catch (error) {
            console.log('Error: ', error);
        }
    }

    console.log("items: ", items);


    if (items.length === 0) {
        return (
            <div className='oops'>
                <h3>Oops, you don't have anything in your cart.</h3>
                <p>Please find our new collections <span onClick={() => navigate("/products")}>here</span></p>
            </div>
        )
    }

    const handleCheckout = async () => {
        try {
            const response = await axios.post(`http://localhost:3001/${globalUserID}/checkout`, {},{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            });
            console.log(response.data);
            if (response.data.message === "Checkout successful!") {
                //loadRazorpaySript();
            }
            else {
                alert(response.data.message);
            }
        } catch (error) {
            console.log('Error: ', error);
        }
    }

    
    const totalBill = items.reduce((acc, item) => (acc + item.product_price * item.product_quantity), 0);

    // const loadRazorpaySript = async () => {
    //     try {
    //         const script = document.createElement("script");
    //         script.src = "https://checkout.razorpay.com/v1/checkout.js";
    //         script.async = true;
    //         document.body.appendChild(script);
    
    //         script.onload = async () => {
    //             const response = await axios.post(`http://localhost:3001/create-order`, {
    //                 amount: totalBill, // Pass the total amount here
    //             });
    
    //             const { orderId } = response.data;
    
    //             const razorpayOptions = {
    //                 key: process.env.RAZORPAY_KEY_ID, 
    //                 amount: totalBill * 100, 
    //                 currency: "INR",
    //                 name: "True Hood",
    //                 description: "Fashion Product Purchase",
    //                 order_id: orderId,
    //                 handler: function (response) {
    //                     // Callback on successful payment
    //                     console.log(response);
    //                     alert("Payment Successful!");
    //                     navigate("/dashboard");
    //                 },
    //                 prefill: {
    //                     name: Name,
    //                     email: "customer@example.com",
    //                     contact: "",
    //                 },
    //                 theme: {
    //                     color: "#3399cc",
    //                 },
    //             };
    
    //             const razorpay = new Razorpay(razorpayOptions);
    //             razorpay.open();
    //         };
    //     } catch (error) {
    //         console.log("Error loading Razorpay:", error);
    //     }
    // };


    const addAddress = async () => {
        try {
            const response = await axios.post(`http://localhost:3001/${globalUserID}/add-address`, {
                street: address.street,
                city: address.city,
                state: address.state,
                pincode: address.pincode,
            },{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            });
            alert(response.data.message);
            console.log(response.data.message);
            if (response.data.message === "Address added successfully!") {
                handleCheckout();
            }
        } catch (error) {
            console.log('Error: ', error);
        }
    }
    const handleAddressSubmit = (e) => {
        e.preventDefault();
        addAddress();
    };

    return (
        <div>
            <div className='navbar true'>
                <p>WE THE INDEPENDENT</p>
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
                            <a onClick={() => navigate("/login")} className="dropdown-item">Login</a>
                            <a onClick={() => navigate("/cart")} className="dropdown-item">Cart</a>
                            <a onClick={() => navigate("/dashboard")} className="dropdown-item">My Orders</a>
                        </div>
                    )}
                </div>
            </div>
            {items.map((item) => (
                <div key={item._id} className="cart-class1">
                    <img src={item.imagePath} alt={`Product ${item.product_id}`} />
                    <div className="flex-col calvin1">
                        <h3>{item.product_name}</h3>
                        {item.size && <p className='p-size'>Size: {item.size}</p>}
                        <p className="quantity calvin1">Quantity: {item.product_quantity}</p>
                        <h3 className="itemprice">₹{item.product_price * item.product_quantity}.00</h3>
                        <div className="quantity-buttons">
                            <button className="quantity-button" onClick={() => handleQuantityChange(item.product_id, 'decrease', item.size)}>-</button>
                            <button className="quantity-button" onClick={() => handleQuantityChange(item.product_id, 'increase', item.size)}>+</button>
                        </div>
                    </div>
                    <div className="border-45"></div>
                </div>
            ))}
            {addressPopup && (
                <>
                    <div className="overlay" onClick={() => showAddressPopup(false)}></div>

                    <div className='a-pop'>
                        <button className="close-btn" onClick={() => showAddressPopup(false)}>✕</button>
                        <h2>Enter your shipping address</h2>
                        <form className='address-form'>
                            <img src="images/map.png" alt="Random Image" className='address-image' />
                            <div className='input-container'>
                                <input type='text' id='street' value={address.street} name='street' placeholder='Address line*' required onChange={(e) => setAddress({ ...address, street: e.target.value })} />
                            </div>
                            <div className='input-container'>
                                <input type='text' id='city' value={address.city} name='city' placeholder='City' required onChange={(e) => setAddress({ ...address, city: e.target.value })} />
                            </div>
                            <div className='row'>
                                <div className='input-container'>
                                    <input type='text' id='state' value={address.state} name='state' placeholder='State' required onChange={(e) => setAddress({ ...address, state: e.target.value })} />
                                </div>
                                <div className='input-container'>
                                    <input type='text' id='pincode' value={address.pincode} name='pincode' placeholder='Pincode' required onChange={(e) => setAddress({ ...address, pincode: e.target.value })} />
                                </div>
                            </div>
                            <button type='submit' className='submit-btn' onClick={handleAddressSubmit}>Submit</button>
                        </form>
                    </div>
                </>
            )}


            <div className="cart-class2">
                <div className="inside">
                    <h2>ORDER SUMMARY</h2>
                    <h4><span>SUB TOTAL:</span> INR {totalBill}.00</h4>
                    <h4><span>DELIVERY CHARGES:</span> FREE</h4>
                    <h4><span>TOTAL:</span> INR {totalBill}.00</h4>
                    <button className="checkout-btn last-button" onClick={() => showAddressPopup(true)}>
                        CHECKOUT
                    </button>
                </div>
            </div>
        </div>
    )
}

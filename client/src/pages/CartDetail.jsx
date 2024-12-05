import React, { useEffect, useState } from 'react'
import { useMyContext } from './CartContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from "../sources/H-logo.png";
import '../styling/CartDetail.css'

export const CartDetail = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const { globalUserID, setGlobalUserID } = useMyContext();
    const { loggedIn, setLoggedIn } = useMyContext();
    const [popup, setPopup] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
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

    const [user, setUser] = useState({
        name: '',
        email: ''
    })

    if (globalUserID == null) {
        navigate("/login");
    }
    useEffect(() => {
        const getDetails = async () => {
            if (loggedIn && globalUserID) {
                const response = await axios.get(`http://localhost:3001/${globalUserID}/get-user-details`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (response.data.message === "success") {
                    setUser({
                        name: response.data.name,
                        email: response.data.email,
                    })
                }
            }
        }
        getDetails();
    }, [loggedIn,globalUserID])

    useEffect(() => {
        const handleCart = async () => {
            if (loggedIn && globalUserID) {
                const response = await axios.get(`http://localhost:3001/${globalUserID}/get-cart`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (response.data.message === "Cart items fetched!" || response.data.message === "Cart is empty!") {
                    setItems(response.data.items);
                }
            }
        }
        handleCart();
    }, [setItems, flagArray, loggedIn])



    const handleQuantityChange = async (id, action, size) => {
        try {
            console.log('Action: ', action);
            console.log('id: ', id);
            console.log('Size: ', size);

            if (action === "increase") {
                const response = await axios.post(`http://localhost:3001/${globalUserID}/add-item/${id}`, { size: size }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                console.log(response.message);
                setFlagArray([...flagArray, 1]);
            }
            else if (action === "decrease") {
                const response = await axios.post(`http://localhost:3001/${globalUserID}/remove-item/${id}`, { size: size }, {
                    headers: {
                        Authorization: `Bearer ${token}`
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




    const totalBill = items.reduce((acc, item) => (acc + item.product_price * item.product_quantity), 0);

    const loadRazorpaySript = async () => {
        try {
            // Create the script element for Razorpay checkout
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.async = true;
            document.body.appendChild(script);

            // Handle script loading
            script.onload = async () => {
                // Confirm Razorpay is loaded
                if (!window.Razorpay) {
                    console.error("Razorpay script is not loaded or failed to initialize!");
                    return;
                }

                const response = await axios.post(`http://localhost:3001/create-order`, {
                    amount: totalBill * 100, //AMOUNT IN PAISE  
                });

                const orderId = response.data.orderId;

                const razorpayOptions = {
                    key: process.env.REACT_APP_RAZORPAY_KEY_ID,
                    amount: totalBill,
                    currency: "INR",
                    name: "True Hood",
                    description: "Fashion Product Purchase",
                    order_id: orderId,
                    handler: async function (response) {
                        const verificationResponse = await axios.post(`http://localhost:3001/verify-payment`, {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        });

                        if (verificationResponse.data.success) {
                            const order = {
                                items,
                                totalBill,
                            };
                            await createShiprocketOrder(order);
                            const checkoutResponse = await axios.post(
                                `http://localhost:3001/${globalUserID}/checkout`,
                                {},
                                {
                                    headers: {
                                        Authorization: `Bearer ${token}`,
                                    },
                                }
                            );
                            if (checkoutResponse.data.message === "Checkout successful!") {
                                alert("Payment and order creation Successful!");
                                navigate("/dashboard");
                            }
                        } else {
                            alert("Payment verification failed. Please try again!");
                        }
                    },
                    prefill: {
                        name: user.name,
                        email: user.email
                    },
                    theme: {
                        color: "#3399cc",
                    },
                };

                const razorpay = new window.Razorpay(razorpayOptions);
                razorpay.open();
            };
        } catch (error) {
            console.log("Error loading Razorpay:", error);
        }
    };

    const generateShiprocketToken = async () => {
        try {
            const response = await fetch('https://apiv2.shiprocket.in/v1/external/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: "hemanth.a21@iiits.in",
                    password: "Hemanth#2003",
                }),
            });
            const data = await response.json();
            return data.token;
        } catch (error) {
            console.error('Error generating Shiprocket token:', error);
            throw error;
        }
    };

    const createShiprocketOrder = async (order) => {
        try {
            const shiprocketToken = await generateShiprocketToken();

            // Validate `order.items`
            if (!order.items || !Array.isArray(order.items) || order.items.length === 0) {
                throw new Error('Order items are missing or invalid.');
            }

            // Log items for debugging
            console.log('Order Items:', JSON.stringify(order.items, null, 2));

            const totalQuantity = order.items.reduce((acc, item) => acc + (item.product_quantity || 0), 0);

            const orderDetails = {
                order_id: `order_${Date.now()}`,
                order_date: new Date().toISOString(),
                pickup_location: "warehouse",
                comment: "Customer Order",
                billing_customer_name: user.name || "Not Provided",
                billing_address: address.street || "Not Provided",
                billing_city: address.city || "Not Provided",
                billing_pincode: Number(address.pincode) || 111111,
                billing_state: address.state || "Not Provided",
                billing_country: "India",
                billing_last_name: "",
                billing_email: user.email,
                billing_phone: "9618825172",
                shipping_is_billing: true,
                shipping_customer_name: user.name || "Not Provided",
                shipping_address: address.street || "Not Provided",
                shipping_city: address.city || "Not Provided",
                shipping_pincode: Number(address.pincode) || 111111,
                shipping_country: "India",
                shipping_state: address.state || "Not Provided",
                shipping_email: user.email,
                shipping_phone: "9618825172",
                order_items: order.items.map(item => ({
                    name: item.name || "Default Item Name",
                    sku: "SKU" + (item.productId ? item.productId.toString() : "DefaultSKU"),
                    units: item.product_quantity || 1,
                    selling_price: Number(item.product_price) || 0,
                    discount: 0,
                    tax: 0,
                    hsn: 123456,
                })),
                payment_method: "Prepaid",
                sub_total: Number(order.totalBill) || 0,
                length: totalQuantity * 30,
                breadth: totalQuantity * 25,
                height: totalQuantity * 2,
                weight: totalQuantity * 0.2,
            };

            const response = await fetch('https://apiv2.shiprocket.in/v1/external/orders/create/adhoc', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${shiprocketToken}`,
                },
                body: JSON.stringify(orderDetails),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(`Shiprocket API Error: ${data.message || 'Unknown error'}`);
            }
            console.log('Shiprocket order created successfully:', data);
        } catch (error) {
            console.error('Error creating Shiprocket order:', error);
        }
    };


    const addAddress = async () => {
        try {
            const response = await axios.post(
                `http://localhost:3001/${globalUserID}/add-address`,
                {
                    street: address.street,
                    city: address.city,
                    state: address.state,
                    pincode: address.pincode,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            alert(response.data.message);
            console.log(response.data.message);
            if (response.data.message === "Address added successfully!") {
                // Do not call handleCheckout here
                showAddressPopup(false); // Close the address popup
                loadRazorpaySript(); // Now call Razorpay after address submission
            }
        } catch (error) {
            console.log("Error: ", error);
        }
    };


    const handleAddressSubmit = (e) => {
        e.preventDefault();
        addAddress();
    };

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

    if (items.length === 0) {
        return (
            <div className='oops'>
                <h3>Oops, you don't have anything in your cart.</h3>
                <p>Please find our new collections <span onClick={() => navigate("/products")}>here</span></p>
            </div>
        )
    }

    return (
        <>
            {!loggedIn && (
                <div className='oops'>
                    <h3>Please login to add items in your cart.</h3>
                    <p>Click <span onClick={() => navigate("/login")}>here</span> to login</p>
                </div>
            )}
            {loggedIn && (
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
                                        <input type='text' id='city' value={address.city} name='city' placeholder='City*' required onChange={(e) => setAddress({ ...address, city: e.target.value })} />
                                    </div>
                                    <div className='row'>
                                        <div className='input-container'>
                                            <input type='text' id='state' value={address.state} name='state' placeholder='State*' required onChange={(e) => setAddress({ ...address, state: e.target.value })} />
                                        </div>
                                        <div className='input-container'>
                                            <input type='text' id='pincode' value={address.pincode} name='pincode' placeholder='Pincode*' required onChange={(e) => setAddress({ ...address, pincode: e.target.value })} />
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
            )}
        </>
    )
}

import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Buffer } from 'buffer';
import logo from "../sources/H-logo.png";
import '../styling/CartDetail.css'
import Loader from "./Loader";

export const CartDetail = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const userID = localStorage.getItem('userID');
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const [popup, setPopup] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
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

    useEffect(() => {
        const getDetails = async () => {
            try {
                setIsLoading(true);
                if (userID) {
                    const response = await axios.get(`${process.env.REACT_APP_API_URL}/${userID}/get-user-details`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );
                    if (response.data.message === "success") {
                        setUser({ name: response.data.name, email: response.data.email });
                    }
                }
            } catch (error) {
                console.error("Error fetching user details:", error);
            } finally {
                setIsLoading(false);
            }
        };
        getDetails();
    }, [isLoggedIn, userID]);

    useEffect(() => {
        const handleCart = async () => {
            try {
                setIsLoading(true);
                console.log('Loggedin status: ', isLoggedIn);
                console.log('global userID: ', userID);
                if (userID) {
                    const response = await axios.get(`${process.env.REACT_APP_API_URL}/${userID}/get-cart`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );
                    if (response.data.message === "Cart items fetched!" || response.data.message === "Cart is empty!") {
                        setItems(response.data.items);
                    }
                    console.log('I want to know the response: ', response.data);
                }
            } catch (error) {
                console.error("Error fetching cart items:", error);
            } finally {
                setIsLoading(false);
            }
        };
        handleCart();
    }, [setItems, flagArray, isLoggedIn]);



    const handleQuantityChange = async (id, action, size) => {
        try {
            setIsLoading(true);
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
                setFlagArray([...flagArray, 1]);
            }
            else if (action === "decrease") {
                const response = await axios.post(`${process.env.REACT_APP_API_URL}/${userID}/remove-item/${id}`, { size: size }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                console.log(response.message);
                setFlagArray([...flagArray, -1]);
            }
        } catch (error) {
            console.log('Error: ', error);
        } finally {
            setIsLoading(false);
        }
    }
    console.log('User: ', user)
    console.log("items: ", items);




    const totalBill = items.reduce((acc, item) => (acc + item.product_price * item.product_quantity), 0);

    const loadRazorpayScript = async () => {
        try {
            setIsLoading(true);

            // Dynamically load the Razorpay script
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.async = true;
            document.body.appendChild(script);

            // Handle script load
            script.onload = async () => {
                if (!window.Razorpay) {
                    console.error("Razorpay script failed to load!");
                    return;
                }

                console.log("Razorpay script loaded successfully.");

                // Create an order on your backend
                const response = await axios.post(`${process.env.REACT_APP_API_URL}/create-order`, {
                    amount: totalBill * 100, // Amount in paise
                });

                const orderId = response.data.orderId;
                console.log("Order ID received from server:", orderId);

                // Razorpay options
                const razorpayOptions = {
                    key: process.env.REACT_APP_RAZORPAY_KEY_ID,
                    amount: totalBill,
                    currency: "INR",
                    name: "True Hood",
                    description: "Fashion Product Purchase",
                    order_id: orderId,
                    handler: async function (response) {
                        try {
                            console.log("Full Razorpay Payment Response:", JSON.stringify(response, null, 2));

                            const verificationResponse = await axios.post(`${process.env.REACT_APP_API_URL}/verify-payment`, {
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                            });

                            console.log("Full Payment Verification Response:", JSON.stringify(verificationResponse.data, null, 2));

                            if (verificationResponse.data.success) {
                                console.log("Payment verified successfully.");

                                // Create Shiprocket order
                                const order = {
                                    items,
                                    totalBill,
                                };

                                await createShiprocketOrder(order);

                                // Perform checkout
                                const checkoutResponse = await axios.post(
                                    `${process.env.REACT_APP_API_URL}/${userID}/checkout`,
                                    {},
                                    {
                                        headers: {
                                            Authorization: `Bearer ${token}`,
                                        },
                                    }
                                );

                                console.log("Checkout response:", checkoutResponse.data);

                                if (checkoutResponse.data.message === "Checkout successful!") {
                                    alert("Payment and order creation successful!");
                                    navigate("/dashboard");
                                }
                            } else {
                                alert("Payment verification failed. Please try again!");
                            }
                        } catch (error) {
                            console.error("Complete Verification Error:", error);
                            alert(`Payment verification failed: ${error.message}`);
                        }
                    },
                    prefill: {
                        name: user.name || "Guest User",
                        email: user.email || "guest@example.com",
                        contact: "",
                    },
                    theme: {
                        color: "#3399cc",
                    },
                };

                console.log("Razorpay options configured:", razorpayOptions);

                // Open Razorpay checkout
                const razorpay = new window.Razorpay(razorpayOptions);
                razorpay.open();
            };

            // Error handling if the script fails to load
            script.onerror = () => {
                console.error("Failed to load Razorpay script.");
                alert("Failed to load Razorpay. Please refresh and try again.");
            };
        } catch (error) {
            console.error("Error in loadRazorpayScript:", error);
        } finally {
            setIsLoading(false);
        }
    };



    const generateShiprocketToken = async () => {
        try {
            setIsLoading(true);

            const response = await fetch('https://apiv2.shiprocket.in/v1/external/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: "hemanth.a21@iiits.in",
                    password: "Hemanth#2003"
                }),
            });

            const data = await response.json();

            if (!data.token) {
                console.error('Failed to generate Shiprocket token: No token in response');
                throw new Error('Failed to generate Shiprocket token');
            }

            return data.token;
        } catch (error) {
            console.error('Detailed Shiprocket Token Error:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const createShiprocketOrder = async (order) => {
        try {
            setIsLoading(true);

            console.log('Creating Shiprocket Order with Details:', JSON.stringify(order, null, 2));

            const shiprocketToken = await generateShiprocketToken();

            // Validate order.items
            if (!order.items || !Array.isArray(order.items) || order.items.length === 0) {
                throw new Error('Order items are missing or invalid.');
            }

            const totalQuantity = order.items.reduce((acc, item) => acc + (item.product_quantity || 0), 0);


            const orderDetails = {
                order_id: `order_${Date.now()}`,
                order_date: new Date().toISOString(),
                pickup_location: "warehouse",
                comment: "Customer Order",
                billing_customer_name: user?.name || "Not Provided",
                billing_address: address?.street || "Not Provided",
                billing_city: address?.city || "Not Provided",
                billing_pincode: Number(address?.pincode) || 111111,
                billing_state: address?.state || "Not Provided",
                billing_country: "India",
                billing_last_name: "",
                billing_email: user?.email || "Not Provided",
                billing_phone: "9618825172",
                shipping_is_billing: true,
                shipping_customer_name: user?.name || "Not Provided",
                shipping_address: address?.street || "Not Provided",
                shipping_city: address?.city || "Not Provided",
                shipping_pincode: Number(address?.pincode) || 111111,
                shipping_country: "India",
                shipping_state: address?.state || "Not Provided",
                shipping_email: user?.email || "Not Provided",
                shipping_phone: "9618825172",
                order_items: order?.items?.map(item => ({
                    name: `${item?.product_name || "Default Item Name"} - Size: ${item?.size || "Default Size"}`,
                    sku: `SKU${item?.product_id ? item.product_id.toString() : "DefaultSKU"}-${item?.size || "DefaultSize"}`,
                    units: item?.product_quantity || 1,
                    selling_price: Number(item?.product_price * item?.product_quantity) || 0,
                    discount: 0,
                    tax: 0,
                    hsn: 61091000,
                })) || [],
                payment_method: "Prepaid",
                sub_total: Number(order?.totalBill) || 0,
                length: 30,
                breadth: 25,
                height: 2 + (1.5 * ((totalQuantity || 0) - 1)),
                weight: (totalQuantity || 0) * 0.25,
            };



            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/shiprocket/create-order`, {
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
            console.error('Detailed Shiprocket Order Creation Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const addAddress = async () => {
        try {
            setIsLoading(true);
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/${userID}/add-address`,
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
                loadRazorpayScript(); // Now call Razorpay after address submission
            }
        } catch (error) {
            console.log("Error: ", error);
        } finally {
            setIsLoading(false);
        }
    };


    const handleAddressSubmit = (e) => {
        e.preventDefault();
        addAddress();
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
    }
    if (isLoading) {
        return <Loader />;
    }

    console.log('FINAL ISLOGGEDIN STATUS : ', isLoggedIn)
    if (!userID) {
        return (
            <div className='oops'>
                <h3>Please login to add items in your cart.</h3>
                <p>Click <span onClick={() => navigate("/login")}>here</span> to login</p>
            </div>
        )
    }
    
    if (items.length === 0 && userID) {
        return (
            <div className='oops'>
                <h3>Oops, you don't have anything in your cart.</h3>
                <p>Please find our new collections <span onClick={() => navigate("/products")}>here</span></p>
            </div>
        )
    }
    
    return (
        <>
            {(isLoggedIn=="false" || (isLoggedIn==null)) && (
                <div className='oops'>
                    <h3>Please login to add items in your cart.</h3>
                    <p>Click <span onClick={() => navigate("/login")}>here</span> to login</p>
                </div>
            )}
            {(isLoggedIn=="true") && (
                <div className='main-center-div'>
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
                                    {isLoggedIn && (
                                        <a onClick={handleLogout} className="dropdown-item">Logout</a>
                                    )}
                                    {!isLoggedIn && (
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
                                        <input type='text' id='street' value={address.street} name='street' placeholder='Complete Address*' required onChange={(e) => setAddress({ ...address, street: e.target.value })} />
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

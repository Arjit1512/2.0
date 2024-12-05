import React, { useEffect, useState } from 'react'
import { useMyContext } from './CartContext'
import axios from "axios";
import '../styling/Dashboard.css';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const { globalUserID, setGlobalUserID, loggedIn, setLoggedIn } = useMyContext();
    const [orders, setOrders] = useState([]);
    const Name = localStorage.getItem('userName');
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    useEffect(() => {
        const getOrders = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/${globalUserID}/get-cart`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                console.log(response.data.orders);
                console.log('Full Response: ', response.data);
                console.log('Orders Field: ', response.data.orders);
                console.log('globalUserID: ', globalUserID);
                setOrders(response.data.orders);
            } catch (error) {
                console.log('Error: ', error);
            }
        }
        if (globalUserID) {
            getOrders();
        }

    }, [globalUserID])
    console.log('Orders: ---> ', orders);
    const sortedOrders = [...orders].sort((a, b) => new Date(b.date) - new Date(a.date));

    if (sortedOrders.length === 0) {
        return (
            <div className='oops'>
                <h3>You did not order any product yet.</h3>
                <p>Checkout our latest collections <span onClick={() => navigate("/products")}>here</span>.</p>

            </div>
        )
    }


    const formatDate = (dateString) => {
        return new Intl.DateTimeFormat('en-IN', {
            dateStyle: 'short',
            timeStyle: 'short',
            timeZone: 'Asia/Kolkata',
        }).format(new Date(dateString));
    };
    return (
        <>
            {!loggedIn && (
                <div className='oops'>
                    <h3>Please login to view your orders.</h3>
                    <p>Click <span onClick={() => navigate("/login")}>here</span> to login</p>
                </div>
            )}
            {loggedIn && (
                <div>
                    <div className='navbar'>
                        <p>Thank you <span className='blink'>{Name}</span> for being part of our hood</p>
                    </div>
                    <div className='dashboard'>
                        {sortedOrders && sortedOrders.map((order) => {
                            return (
                                <>
                                    <h2>Ordered at {formatDate(order.date)} IST</h2>
                                    <h3>Total amount paid: ₹{order.totalBill}.00</h3>
                                    {order.items.map((item) => {
                                        return (
                                            <>
                                                <div className='flex-row-d order-box'>
                                                    <img className='order-img' src={item.productImagePath} alt={order.name} />
                                                    <div className='flex-col-d inner-box'>
                                                        <h4>Name: {item.productName}</h4>
                                                        <p>Quantity: {item.productQuantity} <b>(Size: {item.productSize})</b></p>
                                                        <p>₹{item.productEntirePrice}.00</p>
                                                    </div>
                                                </div>
                                            </>
                                        )

                                    })}

                                </>
                            )

                        })}
                    </div>
                    <div className='tq'>
                        <p>While we deliver your product, please take a look at our brand new collections <span onClick={() => navigate("/products")}>here</span>.</p>
                    </div>
                </div>
            )}
        </>
    )
}

export default Dashboard

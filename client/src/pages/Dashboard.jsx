import React, { useEffect, useState } from 'react'
import axios from "axios";
import '../styling/Dashboard.css';
import { useNavigate } from 'react-router-dom';
import Loader from "./Loader";

const Dashboard = () => {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const Name = localStorage.getItem('userName');
    const token = localStorage.getItem('token');
    const userID = localStorage.getItem('userID');
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const navigate = useNavigate();

    useEffect(() => {
        const getOrders = async () => {
            try {
                setIsLoading(true);
                if (userID) {
                    const response = await axios.get(`${process.env.REACT_APP_API_URL}/${userID}/get-cart`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    console.log(response.data.orders);
                    console.log('Full Response: ', response.data);
                    console.log('Orders Field: ', response.data.orders);
                    console.log('userID: ', userID);
                    setOrders(response.data.orders);
                }
            } catch (error) {
                console.log('Error: ', error);
            } finally {
                setIsLoading(false);
            }
        }
        getOrders();

    }, [userID])
    console.log('Orders: ---> ', orders);
    const sortedOrders = [...orders].sort((a, b) => new Date(b.date) - new Date(a.date));
    console.log('FINAL ISLOGGEDIN STATUS : ', isLoggedIn)

    if ((isLoggedIn=="true") && sortedOrders.length === 0) {
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

    if (isLoading) {
        return <Loader />;
    }

    if (!userID) {
        return (
            <div className='oops'>
                <h3>Please login to add items in your cart.</h3>
                <p>Click <span onClick={() => navigate("/login")}>here</span> to login</p>
            </div>
        )
    }
    
    
    return (
        <>
            {(isLoggedIn=="false") && (
                <div className='oops'>
                    <h3>Please login to view your orders.</h3>
                    <p>Click <span onClick={() => navigate("/login")}>here</span> to login</p>
                </div>
            )}
            {(isLoggedIn=="true") && (
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
                                                        <p>Paid: ₹{item.productEntirePrice}.00</p>
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

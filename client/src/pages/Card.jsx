import React from 'react'
import '../styling/Card.css'
import { useNavigate } from 'react-router-dom'

const Card = (props) => {
    const navigate = useNavigate();
    return (
        <div className='card'>
            <img className='card-img' src={props.imgURL} />
            <div className='left-align la'>
                <p className='gray-text'>OVERSIZED T-SHIRT</p>
                <p className='card-name'>{props.name}</p>
                <p className='card-price'>₹{props.price}.00</p></div>
        </div>
    )
}

export default Card;
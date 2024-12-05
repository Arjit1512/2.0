import React from 'react'
import { useNavigate } from 'react-router-dom'

const Success = () => {
    const navigate = useNavigate();
    return (
        <div className='oops' style={{textAlign:"center"}}>
            <h3>Thank you for taking the time to provide us with your valuable feedback.</h3>
            <p>Please click here to go back to <span onClick={() => navigate("/")}>home</span> page.</p>
        </div>
    )
}

export default Success
import React, { useState } from 'react'
import HGif from '../sources/H.gif';
import '../styling/Landing.css';
import Home from './Home';

const Loader = () => {

    return (
        <>

            <div className="landing-container">
                <img src={HGif} alt="Loading..." className="landing-gif" />
            </div>


        </>
    )
}

export default Loader
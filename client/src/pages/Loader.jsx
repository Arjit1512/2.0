import React, { useState } from 'react'
import HGif from '../sources/loading-gif.gif';
import '../styling/Landing.css';
import Home from './Home';

const Loader = () => {

    return (
        <>

            <div className="landing-container">
                <img src={HGif} alt="Loading..." className="loader-gif" />
            </div>

        </>
    )
}

export default Loader
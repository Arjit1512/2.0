import React, { useEffect, useState } from 'react'
import HGif from '../sources/H.gif';
import '../styling/Landing.css';
import Home from './Home';

const Landing = () => {
    const [showHome, setShowHome] = useState(false);

    useEffect(() => {
        const show = localStorage.getItem('show');
        if (!show) {
            localStorage.setItem('show', true);
            setTimeout(() => {
                setShowHome(true);
            }, 3000);
        }
        else
            setShowHome(true);
    }, []);

    return (
        <>
            {showHome ? <>
                <Home />
            </> : <>
                <div className="landing-container">
                    <img src={HGif} alt="Loading animation" className="landing-gif" />
                </div>
            </>
            }

        </>
    )
}

export default Landing
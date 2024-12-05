import React, { createContext, useContext, useState, useEffect } from 'react'
const MyContext = createContext();

export const MyProvider = ({ children }) => {
    const [globalUserID, setGlobalUserID] = useState(null);
    const [loggedIn,setLoggedIn] = useState(false);

    useEffect(() => {
        const storedUserID = localStorage.getItem('userID');
        if (storedUserID) {
            setGlobalUserID(storedUserID);
        }
    }, []);

    return (
        <MyContext.Provider value={{ globalUserID, setGlobalUserID,loggedIn, setLoggedIn }}>
            {children}
        </MyContext.Provider>
    )
}

export const useMyContext = () => useContext(MyContext);

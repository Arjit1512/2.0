import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../styling/Login.css'
import { useMyContext } from './CartContext';

const Login = () => {
  const navigate = useNavigate();
  const {globalUserID,setGlobalUserID,loggedIn,setLoggedIn} = useMyContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    const storedUserID = localStorage.getItem('userID');
    if (storedUserID) {
      setGlobalUserID(storedUserID); 
    }
  }, [setGlobalUserID]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://localhost:3001/login`, {
        email,
        password
      });

      if (response.data.message === "Login successfull!") {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userID', response.data.userID); 
        localStorage.setItem('userName', response.data.userName); 
        console.log('USERID:::: ',response.data.userID);
        setGlobalUserID(response.data.userID);
        setLoggedIn(true);
        navigate("/");
      }
      else {
        console.log(response.data.message);
        alert(response.data.message);
        setLoginError('Login failed! Please try again');
      }
    } catch (error) {
      console.log('Error: ', error);
      setLoginError('Login failed! Please try again');
    }
  }
  return (
    <div>
      <link rel="stylesheet" href="https://pro.fontawesome.com/releases/v5.10.0/css/all.css" />
      <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
        integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm"
        crossOrigin="anonymous" />
      <link rel="stylesheet" href="Login.css" />
      <section className='header-login'>
          <p onClick={() => ("/")} style={{ cursor: "pointer" }}>TRUE HOOD</p>
      </section>
      <div className="wdiv">
        <div className="wrapper">
          <div className="form-box login">
            <h2>This way, to the hood</h2>
            <form onSubmit={handleLogin}>
              <div className="input-box">
                <input
                  type="email"
                  placeholder="Email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="input-box">
                <input
                  type="password"
                  placeholder="Password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="div-bt">
                <button className="bt" type="submit">
                  Login
                </button>
              </div>
              <p className='label-register' style={{ marginTop: '5%' }}>
                Don't have an account?{' '}
                <Link to="/register">
                  <span>Register here</span>
                </Link>
              </p>
              {loginError && <p>{loginError}</p>}
            </form>

          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
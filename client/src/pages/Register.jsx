import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../styling/Login.css'
import Loader from "./Loader";

const Register = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [Doubt, setDoubt] = useState(false);
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    const perform = async () => {
      const doubt = await localStorage.getItem('isLoggedIn');
      if (doubt === 'true') {
        setDoubt(true);
      }
    }
    perform();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/register`, {
        userName,
        email,
        password
      });

      if (response.data.message === "Registration successfull!") {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userID', response.data.userID);
        localStorage.setItem('userName', response.data.userName);
        localStorage.setItem('isLoggedIn', true);
        navigate("/");
      }
      else {
        console.log(response.data.message);
        alert(response.data.message);
        setLoginError('Registration failed! Please try again');
      }
    } catch (error) {
      console.log('Error: ', error);
      setLoginError('Registration failed! Please try again');
    } finally {
      setIsLoading(false);
    }
  }
  if (isLoading) {
    return <Loader />;
  }

  if (Doubt) {
    return (
      <div className='center-all'>
        <h1>You are already logged in.</h1>
      </div>
    )
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
                  type="text"
                  placeholder="Name"
                  required
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </div>
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
                  Register
                </button>
              </div>
              <p className='label-register' style={{ marginTop: '5%' }}>
                Already have an account?{' '}
                <Link to="/login">
                  <span>Login here</span>
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

export default Register
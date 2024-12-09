
import React, { useState } from 'react';
import location from '../sources/map.png';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styling/Feedback.css'
import { useMyContext } from './CartContext';
import Loader from "./Loader";

const Community = () => {
  const [message, setMessage] = useState("");
  const [fName, setfName] = useState("");
  const [lName, setlName] = useState("");
  const [subject, setSubject] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { globalUserID } = useMyContext();

  function handleMessage(event) {
    setMessage(event.target.value);
  }
  function handlefName(event) {
    setfName(event.target.value);
  }
  function handlelName(event) {
    setlName(event.target.value);
  }
  function handleSubject(event) {
    setSubject(event.target.value);
  }

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setIsLoading(true);
      const token = localStorage.getItem('token'); // Assuming token is stored in localStorage

      if (!token) {
        alert('Please login to give the feedback!');
        navigate("/login");
        return;
      }

      const response = await axios.post(`${process.env.REACT_APP_API_URL}/${globalUserID}/feedback`, {
        fName, lName, subject, message
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        navigate('/success');
      } else {
        alert('User does not exist.');
      }
    } catch (error) {
      console.error('Failed to submit message', error);
      alert('An error occurred while submitting the message.');
    } finally {
      setIsLoading(false);
    }
  };
  if (isLoading) {
    return <Loader />;
  }
  return (
    <>
      <section id='community-page'>
        <div className='cpage1'>
          <h1>Give us your valuable feedback.</h1>
          <div className='brown-border'></div>
          <p className='text-community'>
            Before we kick off any project we like to consult with you to give you the most accurate product possible.
            <br />
            Use the form below to send us your feedback to improve ourselves and come out with a better product.
          </p>

          <form onSubmit={handleSubmit}>
            <div className='flex-col'>
              <label>Name</label>
              <div className='flex-row name-form'>
                <input type='text' placeholder='First Name' onChange={handlefName} value={fName} />
                <input style={{ marginLeft: "3%" }} type='text' placeholder='Last Name' onChange={handlelName} value={lName} />
              </div>
              <br />
              <label>Subject</label>
              <input type='text' placeholder='' onChange={handleSubject} value={subject} />
              <br />
              <label>Message</label>
              <textarea style={{ height: "75px" }} placeholder='' onChange={handleMessage} value={message} />
              <button className='send' type='submit'>SEND</button>
            </div>
          </form>
        </div>

        <div className='cpage2 inv-rev'>
          <img src={location} alt='' />
          <div className='contact-text'>
            <h1>Contact</h1>
          </div>
          <div className='light-border lb2'></div>
          <div className='address'>
            <p>truehood.business@gmail.com<br />
            </p>
          </div>

          <div className='contact-text'>
            <h1>Operational Address</h1>
          </div>
          <div className='light-border lb2'></div>
          <div className='address'>
            <p className='addr'>Lalitha Nagar,<br />
              Ram Nagar,<br />
              Hyderabad - 500029

            </p>
          </div>


        </div>
      </section>
    </>
  );
}

export default Community;
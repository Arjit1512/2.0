import React from 'react';
import '../styling/RP.css';
import { useNavigate } from 'react-router-dom';

const Returns = () => {
    const navigate = useNavigate();
  return (
    <div className="returns-container">
      <h1 className="returns-title">Returns and Refund Policy</h1>
      
      <section className="policy-section">
        <h2>Cancellation & Refund Request Time</h2>
        <p>
        We accept cancellation and refund requests only within 1 hour of placing the order, and only on the same day the order is placed. Please contact customer support within this time frame to process your request.
        <br/>
        For knowing at what time exactly you have made your order, visit our <a style={{textDecoration:"underline" , cursor:"pointer", color:"black"}} onClick={()=>navigate("/dashboard")}>Dashboard</a> page.
        <br/>
        NOTE: <b>We are not accepting CODs for now.</b>
        </p>
      </section>

      <section className="policy-section">
        <h2>Shipping Policy</h2>
        <p>
        We do not guarantee that delivery will always be the fastest.<br />
          Minimum Shipping Time - 2 days<br/>
          Average Shipping Time - 8 days<br/>
          Maximum Shipping Time - 17 days(approx. 2-3 weeks)
        </p>
      </section>

      <section className="policy-section">
        <h2>Exchange Policy</h2>
        <p>
            Currently we are neither taking any exchanges nor returns. 
            <b> Please note that once the order is placed, we will not take any returns unless the request was done on the same day within 1 hour the product is placed.</b>
        </p>
      </section>

      <section className="policy-section">
        <h2>Refund Processing Time</h2>
        <p>
          All refunds will be processed within 5-7 business days after the cancellation request is approved. Confirmation emails will be sent once the refund is processed.
        </p>
      </section>

      <section className="policy-section">
        <h2>Shipping Time</h2>
        <p>
          Our average shipping times vary from 8 to 14 days, depending on your location and product availability. Tracking numbers will be provided once your order is shipped.
        </p>
      </section>
    </div>
  );
}

export default Returns;
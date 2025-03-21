import React, { useState } from "react";
import "./login:register.css";

function showSidebar() {
  document.querySelector("#navbar_2").style.display = "flex";
}

function hideSidebar() {
  document.querySelector("#navbar_2").style.display = "none";
}

const Verification = ({ email,name, onVerifyCode, onResendCode }) => {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [resending, setResending] = useState(false);

  const handleVerify = async (event) => {
    event.preventDefault();
    if (!otp) {
      setMessage("Please enter the OTP.");
      return;
    }

    const response = await onVerifyCode(email,otp,name);
    
    setMessage(response.message);
  };

  

  return (
    <div className="P3">
      <div className="container">
        <div className="navbar_1">
          <a href="/" className="logo">
            <ul>
              <li>
                <img src="images/logo.png" alt="Logo" />
              </li>
            </ul>
          </a>
          <nav className="icons">
            <ul>
              <li>
                <a href="/login" className="user">
                  <i className="bx bx-user"></i>
                </a>
              </li>
              
              <div id="mobile" onClick={showSidebar}>
                <li><a id="menu"><i className='bx bx-menu'></i></a></li>
              </div>
            </ul>
          </nav>
        </div>

        {/* Sidebar menu */}
        <div id="navbar_2">
          <nav className="menu_1">
            <ul>
              <div id="mobile_2">
                <li><a href="#" onClick={hideSidebar}><i className='bx bx-x'></i></a></li>
              </div>
              <li><a href="/">HOME</a></li>
              <li><a href="/shop">SHOP</a></li>
              <li><a href="/about">ABOUT</a></li>
              <li><a href="/contact">CONTACT</a></li>
            </ul>
          </nav>
        </div>

        <section id="Login-page">
          <div className="Login">
            <h1>Enter Verification Code</h1>
            <p style={{textAlign:"center"}}>We have sent a code to {email}</p>
            <form onSubmit={handleVerify} className="form">
              <div className="Input_box">
                <input
                  type="text"
                  placeholder="Enter code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn" id="login_btn">Verify Code</button>
              <p style={{padding:"10px 0", textAlign:"center"}}>
                Didn't work... 
                <span
                  style={{textDecoration:"underline", cursor: "pointer"}}
                  onClick={onResendCode}
                >
                  {resending ? "Resending..." : "Resend Code"}
                </span>
              </p>
            </form>
            {message && <p style={{textAlign:"center"}}>{message}</p>}
          </div>
        </section>

        {/* Footer */}
        <footer className="section-p1">
          <div className="col">
            <div className="logo">
              <img src="images/logo.png" width="55px" alt="" />
            </div>
            <h4>Contact</h4>
            <p><strong>Address:</strong> Dunham Rd, Cheshire, Altrincham WA14 4AH</p>
            <p><strong>Phone:</strong> 07889799082</p>
            <h4>Follow Us</h4>
            <div class="socials">
              <a href='https://www.instagram.com/culture.shock.clothing/'><i class='bx bxl-instagram'></i></a>
              <a href='https://cltrshck.myshopify.com/'><i class='bx bxl-shopify'></i></a>
            </div>
          </div>

          <div className="col">
            <h4>About</h4>
            <a href="/about">About Us</a>
            <a href="/privacy">Privacy Policy</a>
            <a href="/contact">Contact Us</a>
          </div>

          <div className="col">
            <h4>My Account</h4>
            <a href="/login">Sign In</a>
            <a href="/contact">Help</a>
          </div>

          <div className="col">
            <h4> Secure Payment Gateways</h4>
            <img src="images/pay.png" alt="" width="260px" />
          </div>
          <div className="copyright">
            <p>© Copyright 2024 HTML.am</p>
          </div>
        </footer>
      </div>
      <div className="spline-container">
        <spline-viewer url="https://prod.spline.design/WW56WhjGwg7hmUVs/scene.splinecode"></spline-viewer>
      </div>
    </div>
  );
};

export default Verification;

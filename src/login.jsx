import React, { useState } from "react";
import "./login:register.css";
import EmailVerification from "./EmailVerification";
import { useNavigate } from "react-router-dom"; 

// Menu functions
function showSidebar() {
  document.querySelector("#navbar_2").style.display = "flex";
}

function hideSidebar() {
  document.querySelector("#navbar_2").style.display = "none";
}

const Login = ({ sendVerificationCode }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [showVerification, setShowVerification] = useState(false);
  const navigate = useNavigate(); 
  

  
  // Send OTP to the backend (email and name) and then show verification form
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
  
    if (!name || !email) {
      alert("Please enter both name and email.");
      return;
    }
  
    // ✅ Call the function and check if success is true
    const response = await sendVerificationCode(name, email);
    console.log("Response from sendVerificationCode:", response);
  
    if (response.success) {  // ✅ Now checks for success
      navigate(`/verify?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}`);
    } else {
      setMessage(response.message);
    }
  };
  
  
  

  return (
    <div className="P3">
      <div className="container">
        {/* Navbar */}
        <div className="navbar_1">
          <a href="#/" className="logo">
            <ul>
              <li>
                <img src="images/logo.png" alt="Logo" />
              </li>
            </ul>
          </a>
          <nav className="icons">
            <ul>
              <li>
                <a href="#/login" className="user">
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
                <li><a onClick={hideSidebar}><i className='bx bx-x'></i></a></li>
              </div>
              <li><a href="#/">HOME</a></li>
              <li><a href="#/shop">SHOP</a></li>
              <li><a href="#/about">ABOUT</a></li>
              <li><a href="#/contact">CONTACT</a></li>
            </ul>
          </nav>
        </div>

        {/* Login Form */}
        <section id="Login-page">
          <div className="Login">
            {!showVerification ? (
              <form onSubmit={handleLoginSubmit} className="form">
                <h1>Login</h1>

                <div className="Input_box">
                  <input
                    type="text"
                    name="name"
                    placeholder="Username"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <i className="bx bxs-user"></i>
                </div>

                <div className="Input_box">
                  <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    required
                    className="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <i className="bx bxs-envelope"></i>
                </div>

                <button type="submit" className="btn" id="login_btn">
                  Login
                </button>

                {message && <p style={{ textAlign: "center" }}>{message}</p>}

                <div className="register-link">
                  <p>
                    We'll send a verification code to your email<br />
                    <a href="#/privacy" style={{ textDecoration: "underline" }}>
                      Privacy and Terms
                    </a>
                  </p>
                </div>
              </form>
            ) : (
              <EmailVerification name={name} email={email} /> // ✅ Show verification component
            )}
          </div>
        </section>


        <footer className="section-p1">     
          <div className="col">
            <div className="logo">
              <img src="images/logo.png" width="55px" alt=""/>
            </div>
            <h4>Contact</h4>
            <p><strong>Address:</strong> Dunham Rd, Cheshire, Altrincham WA14 4AH</p>
            <p><strong>Phone:</strong> 07889799082 </p>
            <h4>Follow Us</h4>
            <div class="socials">
              <a href='https://www.instagram.com/culture.shock.clothing/'><i class='bx bxl-instagram'></i></a>
              <a href='https://h7h4c9-aj.myshopify.com/'><i class='bx bxl-shopify'></i></a>
            </div>
          </div>

          <div class="col">
            <h4>About</h4>
            <a href="#/about">About Us</a>
            <a href="#/privacy">Privacy Policy</a>
            <a href="#/contact">Contact Us</a>
          </div>

          <div className="col">
            <h4>My Account</h4>
            <a href="#/login">Sign In</a>
            <a href="#/contact">Help</a>
          </div>

          <div className="col">
            <h4> Secure Payment Gateways</h4>
            <img src="images/pay.png" alt="" width="260px"/>
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

export default Login;

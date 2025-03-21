import { useState, useEffect } from 'react'
import './login:register.css'
import axios from 'axios';

// menu
function showSidebar(){
  const sidebar = document.querySelector("#navbar_2")
  sidebar.style.display = "flex"
}
function hideSidebar(){
  const sidebar = document.querySelector("#navbar_2")
  sidebar.style.display = "none"
}

function showAdminbar(){
  const sidebar = document.querySelector("#navbar_3")
  sidebar.style.display = "flex"
}
function hideAdminbar(){
  const sidebar = document.querySelector("#navbar_3")
  sidebar.style.display = "none"
}
function Contact({ sendHelpMessage }) {
  const [count, setCount] = useState(0)
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const customerId = localStorage.getItem("shopifyCustomerId");
    const userIcon = document.getElementById("userIcon");
    const adminIcon = document.getElementById("adminIcon");
  
    if (customerId) {
      if (userIcon) userIcon.style.display = "none"; // Hide login button
      if (adminIcon) adminIcon.style.display = "inline-flex"; // Show admin button
    } else {
      if (userIcon) userIcon.style.display = "inline-flex"; // Show login button
      if (adminIcon) adminIcon.style.display = "none"; // Hide admin button
    }
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem("shopifyCustomerId"); // Remove stored customer ID
    window.location.href = "/"; // Redirect to login page
  };

  

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!name || !email ||!message) {
      alert("Please enter both name and email.");
      return;
    }
  
    // ✅ Call the function and check if success is true
    const response = await sendHelpMessage(name, email, message);
    
    if (response.success) {  // ✅ Now checks for success
      
    } else {
      alert(response.message);
    }
  };
  return (
    <div className='P3'>

      <div className='container'>
        <div className="navbar_1">
          <a href="/" class="logo">
            <ul>
              <li><img src="images/logo.png"/></li>
            </ul>
          </a>
          <nav class="icons">
                        
            <ul>
              {!localStorage.getItem("shopifyCustomerId") ? (
                  <li><a href="/login" className="user"><i className='bx bx-user'></i></a></li>
              ) : (
                  <li><a onClick={showAdminbar} className="admin"><i className='bx bxs-user-circle'></i></a></li>
              )}
              <div id="mobile" onClick={showSidebar}>
                <li><a id="menu"><i class='bx bx-menu'></i></a></li>
              </div>
            </ul>
          </nav>
        </div>

        <div id="navbar_2">
          <nav className="menu_1">
           
            <ul>
              <div id="mobile_2">
                <li><a href="#" onClick={hideSidebar}><i class='bx bx-x'></i></a></li>
              </div>    
              <li><a href="/">HOME</a></li>
              <li><a href="/shop">SHOP</a></li>
              <li><a href="/about">ABOUT</a></li>
              <li><a href="/contact">CONTACT</a></li>
            </ul>
          </nav>
        </div>

        <div id="navbar_3">
          <nav className="menu_1">
            <ul>
                <div id="mobile_2">
                  <li><a href="#" onClick={hideAdminbar}><i class='bx bx-x'></i></a></li>
                </div>    
                <li><a href={`/admin/${localStorage.getItem("shopifyCustomerId")}`}>Profile</a></li>
                <li><a href={`/orders/${localStorage.getItem("shopifyCustomerId")}`}>Orders</a></li>
                <li><a href={`/settings/${localStorage.getItem("shopifyCustomerId")}`}>Settings</a></li>
                <li><a onClick={handleLogout}>Log out</a></li>
            </ul>
          </nav>
        </div>

        <section id="contact">
          <div id="contact_left">
              <h3>Get in Touch</h3>
              <p>We are here for you! How can we help?</p>
              <form id="query" onSubmit={handleSubmit}>
                  <div class="Input_box">
                    <input type="text" name="name" class="name" placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)}/>
                  </div> 
                    
                  <div class="Input_box">
                    <input type="text" name="email" class="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                  </div> 

                  <div class="Input_box">
                    <textarea name="message" class="message" placeholder="Enter your message..." value={message} onChange={(e) => setMessage(e.target.value)}></textarea>
                  </div>

                  <button type="submit" className="btn">Sumbit</button> 
              </form>

          </div>
          <div id="contact_right">
            <div class="illustration">
              <img src="images/Untitled6_20241231013745.PNG" alt=""/>
            </div>
            <div class="contact_info">
                <div class="infoBox">
                  <div class="icon">
                    <i class='bx bxs-map'></i>
                  </div>
                  <div class="text">
                    <a href="https://g.co/kgs/r5Pum7B">Dunham Rd, Cheshire, Altrincham WA14 4AH</a>
                  </div>
                </div>
                <div class="infoBox">
                  <div class="icon">
                    <i class='bx bxs-phone' ></i>
                  </div>
                  <div class="text">
                    <a href="tel:07889799082">07889799082</a>
                  </div>
                </div>
                <div class="infoBox">
                  <div class="icon">
                    <i class='bx bxs-envelope' ></i>
                  </div>
                  <div class="text">
                    <a href="mailto:cltrshckclothing@gmail.com">cltrshckclothing@gmail.com</a>
                  </div>
                </div>
            </div>
          </div>
          <div class="socials">
            <a href='https://www.instagram.com/culture.shock.clothing/'><i href='https://www.instagram.com/culture.shock.clothing/' class='bx bxl-instagram'></i></a>
            <a href='https://cltrshck.myshopify.com/'><i class='bx bxl-shopify'></i></a>
          </div>
        </section>

        <footer className="section-p1">     
          <div className="col">
            <div className="logo">
              <img src="images/logo.png" width="55px" alt=""/>
            </div>
            <h4>Contact</h4>
            <p><strong>Address:</strong> Dunham Rd, Cheshire, Altrincham WA14 4AH</p>
            <p><strong>Phone:</strong> 0000 0000 0000</p>
            <h4>Follow Us</h4>
            <div class="socials">
              <a href='https://www.instagram.com/culture.shock.clothing/'><i class='bx bxl-instagram'></i></a>
              <a href='https://cltrshck.myshopify.com/'><i class='bx bxl-shopify'></i></a>
            </div>
          </div>

          <div class="col">
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
            <img src="images/pay.png" alt="" width="260px"/>
          </div>
          <div className="copyright">
            <p>© Copyright 2024 HTML.am</p>
          </div>
        </footer>
        <div className="spline-container">
          <spline-viewer url="https://prod.spline.design/WW56WhjGwg7hmUVs/scene.splinecode"></spline-viewer>
        </div>
      </div>
      
    </div>
  )
}

export default Contact

import { useState } from 'react'
import './login:register.css'

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


function NotFound() {
  const [count, setCount] = useState(0)

  

  const handleLogout = () => {
    localStorage.removeItem("shopifyCustomerId"); // Remove stored customer ID
    window.location.href = "#/"; // Redirect to login page
  };
  const home_btn = () => {
    window.location.href = "#/";
  }

  return (
    <div className='P3'>

      <div className='container'>
        <div className="navbar_1">
          <a href="#/" className="logo">
            <ul>
              <li><img src="images/logo.png" alt="Logo" /></li>
            </ul>
          </a>
          <nav class="icons">
                        
            <ul>
              {!localStorage.getItem("shopifyCustomerId") ? (
                  <li><a href="#/login" className="user"><i className='bx bx-user'></i></a></li>
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
                <li><a onClick={hideSidebar}><i className='bx bx-x'></i></a></li>
              </div>    
              <li><a href="#/" >HOME</a></li>
              <li><a href="#/shop" >SHOP</a></li>
              <li><a href="#/about" >ABOUT</a></li>
              <li><a href="#/contact" >CONTACT</a></li>
            </ul>
          </nav>
        </div>
        
        <div id="navbar_3">
          <nav className="menu_1">
            <ul>
                <div id="mobile_2">
                  <li><a onClick={hideAdminbar}><i class='bx bx-x'></i></a></li>
                </div>    
                <li><a href="https://shopify.com/90358743415/account/profile">Profile</a></li>
                <li><a href="https://shopify.com/90358743415/account/orders">Orders</a></li>
                <li><a href={`#/settings/${localStorage.getItem("shopifyCustomerId")}`}>Settings</a></li>
                <li><a onClick={handleLogout}>Log out</a></li>
            </ul>
          </nav>
        </div>
        
        <section id="contact" style={{display:"flex",flexDirection:"column",gap:"10px "}}>
           <h1 style={{color:"rgb(166, 88, 88)",textAlign:"center"}}>Page Not Found</h1>
           <div className='LGE2'>
            <button onClick={home_btn}>Go Back Home</button>
           </div>
        </section>
        <footer className="section-p1" style={{position:"absolute",bottom:"0",width:"100vw",background:"transparent"}}>     
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
         
        <spline-viewer class="background" url="https://prod.spline.design/WW56WhjGwg7hmUVs/scene.splinecode"></spline-viewer>
      </div>
      
    </div>
  )
}

export default NotFound

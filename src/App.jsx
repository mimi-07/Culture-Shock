import React, { useContext, useState, useEffect } from 'react';
import './App.css';
import './test.css';
import ThemeButton from './ThemeButton.jsx';
import { ThemeContext } from './ThemeContext.jsx';


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


function App() {

  const [count, setCount] = useState(0);

  const {darkMode} = useContext(ThemeContext)

  const shop_btn = () =>{
    window.location.href = "/shop"
  }
  const shop_btn_shirt = () =>{
    window.location.href = "/shop?tag=Shirt";
  }
  const shop_btn_hoodie = () =>{
    window.location.href = "/shop?tag=Hoodie";
  }
  const shop_btn_accessories = () =>{
    window.location.href = "/shop?tag=Accessories";
  }
  const shop_btn_tobag = () =>{
    window.location.href = "/shop?tag=Tobag";
  }
  
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

   // ✅ Now updates when filtering happens!
  const handleLogout = () => {
    localStorage.removeItem("shopifyCustomerId"); // Remove stored customer ID
    window.location.href = "/"; // Redirect to login page
  };
  
  return (
    <div className="P1" style={darkMode ? {background:"black"}:{background:"white"}}>
      <div className="animation_bg_1">
        <div class="box">

          <div class="title">
            <span class="block"></span>
            <h1>Culture Shock<span></span></h1>
          </div>

          <div class="role">
            <div class="block"></div>
            <p>"Local Art Global Style"</p>
          </div>

        </div>
      </div>
      <div className="animation_bg_2"/>
      <div className="animation_bg_3"/>
      <div className='container'>
        <video className='bg_vid' autoPlay loop muted style={darkMode ? {display:"flex"}:{display:"none"}}>
          <source src="images/heart_screen.mp4" type="video/mp4" />
        </video>
        <div className="navbar_1" style={darkMode ? {background:"rgba(0,0,0,40)",backdropFilter:"10px", boxShadow:"0 0 3px #fff, 0 0 30px #e60073, 0 0 40px #e60004"}:{}}>
          <a href="/" className="logo">
            <ul>
              <li><img src="images/logo.png"/></li>
            </ul>
          </a>
          <nav className="icons">
                        
            <ul>
              <ThemeButton/>
              {!localStorage.getItem("shopifyCustomerId") ? (
                  <li><a href="/login" className="user"><i className='bx bx-user'></i></a></li>
              ) : (
                  <li><a onClick={showAdminbar} className="admin"><i className='bx bxs-user-circle'></i></a></li>
              )}
              <div id="mobile" onClick={showSidebar}>
                <li><a id="menu"><i className='bx bx-menu'></i></a></li>
              </div>
            </ul>
          </nav>
        </div>

        <div id="navbar_2">
          <nav className="menu_1">
           
            <ul>
              <div id="mobile_2">
                <li><a href="#" onClick={hideSidebar}><i className='bx bx-x'></i></a></li>
              </div>    
              <li><a href="/" style={darkMode ? {color:"white"}:{color:"black"}}>HOME</a></li>
              <li><a href="/shop" style={darkMode ? {color:"white"}:{color:"black"}}>SHOP</a></li>
              <li><a href="/about" style={darkMode ? {color:"white"}:{color:"black"}}>ABOUT</a></li>
              <li><a href="/contact" style={darkMode ? {color:"white"}:{color:"black"}}>CONTACT</a></li>
            </ul>
          </nav>
        </div>
        
        <div id="navbar_3">
          <nav className="menu_1">
            <ul>
                <div id="mobile_2">
                  <li><a href="#" onClick={hideAdminbar}><i class='bx bx-x'></i></a></li>
                </div>    
                <li><a href="https://shopify.com/90358743415/account/profile">Profile</a></li>
                <li><a href="https://shopify.com/90358743415/account/orders">Orders</a></li>
                <li><a href={`/settings/${localStorage.getItem("shopifyCustomerId")}`}>Settings</a></li>
                <li><a onClick={handleLogout}>Log out</a></li>
            </ul>
          </nav>
        </div>

        <div className={darkMode ? "Welcome-2":"Welcome"}>
              <h1>Local Art</h1>
              <h1>GlobalStyle</h1>
              <img src="images/logo.png"/>
        </div>



        <div className="Home">
            <div className="wrapper" style={darkMode ? {background:"black"}:{}}>
              
              <h1 className="title" style={darkMode ? {color:"white",textShadow:"0 0 3px #fff, 0 0 30px #e60073, 0 0 40px #e60004, 0 0 50px #e60073, 0 0 60px #e60004, 0 0 70px #e60073", WebkitTextStrokeWidth:"0"}:{}} >Featuring our Latests</h1>              
              
              <div className="home2">
                <div className="black" style={darkMode ? {background: "linear-gradient(to top, rgba(0, 0, 0, 0.477),rgba(0, 0, 0, 0.721)),url(images/IMG_55772.jpg)", backgroundSize: "cover"}:{}}></div>
                <div className="featured" style={darkMode ? {background: "linear-gradient(to top, rgba(0, 0, 0, 0.477),rgba(22, 22, 22, 0.721)), url(images/IMG_4003_430x.webp)",backgroundSize: "cover",backgroundPosition: "center"}:{}}>
                  <h1 className="product">Culture Shock Classics <br /> Available now <br /><a href="/shop"><button>Shop Now</button></a></h1>
                </div>
                <div className="black" style={darkMode ? {background: "linear-gradient(to top, rgba(0, 0, 0, 0.477),rgba(0, 0, 0, 0.721)),url(images/IMG_55772.jpg)", backgroundSize: "cover"}:{}}></div>
              </div>
              
              <div className="Explore" style={darkMode ? {boxShadow:"0 0 3px #fff, 0 0 30px #e60073, 0 0 40px #e60004"}:{}}>

                <div className="wrapper1" onClick={shop_btn_shirt}>
                  <div className="phone">
                    <h1>Shirts</h1>
                    <div className="block"></div>
                  </div>
                </div>

                <div className="wrapper2" onClick={shop_btn_hoodie}>
                  <div className="phone">
                    <h1>Hoodies</h1>
                    <div className="block"></div>
                  </div>
                </div>

                <div className="wrapper3" onClick={shop_btn}>
                  <div className="phone">
                      <h1>Explore</h1>
                      <div className="block"></div>
                  </div>
                </div>

                <div className="wrapper4" onClick={shop_btn_accessories}>
                  <div className="shadow"></div>
                  <h1>Accessories</h1>
                  
                </div>

                <div className="wrapper5" onClick={shop_btn_tobag}>
                  <div className="shadow"></div>
                  <h1>Tobags</h1>
                </div>

              </div>
              
            </div>
            <div className="About">
              <div className="LH" style={darkMode ? {background:"black",border:" 1px solid #e60073"}:{}}>
                <h1 style={darkMode ? {color:"#e60073"}:{}}>About Us</h1>
                <p style={darkMode ? {color:"white"}:{}}>A small clothing company.<br/>We work with Shopify and will dropship your choice products directly to you<br/>Run by students of Loreto Gammar School<br/>Part of the the Company Connect Project for Young enterprise</p>
                <a href='/about'><button>Learn more</button></a>
              </div>
              <div className="RH">
                <img src="images/modern-happy-asian-female-lifestyle-fashion-portrait-beautiful-attractive-young-woman-girl-enjoy-stylish-walk-with-shopping-bag-packages-on-the-department-store-trendy-outfit-on-shopping-mall-free-video.jpg" alt="" />
                <div className='box'></div>
                <video autoPlay loop muted >
                  <source src="images/istockphoto-1340904695-640_adpp_is.mp4" type="video/mp4" />
                </video>
              </div>
            </div>
        </div>
          
        

        <footer className="section-p1" style={darkMode ? {background:"black"}:{}}>     
          <div className="col" style={darkMode ? {color:"white"}:{}}>
            <div className="logo">
              <img src="images/logo.png" width="55px" alt=""/>
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

          <div class="col" style={darkMode ? {color:"white"}:{}}>
            <h4>About</h4>
            <a href="/about" style={darkMode ? {color:"white"}:{color:"black"}}>About Us</a>
            <a href="/privacy" style={darkMode ? {color:"white"}:{color:"black"}}>Privacy Policy</a>
            
            <a href="/contact" style={darkMode ? {color:"white"}:{color:"black"}}>Contact Us</a>
          </div>

          <div className="col" style={darkMode ? {color:"white"}:{}}>
            <h4 >My Account</h4>
            <a href="/login" style={darkMode ? {color:"white"}:{color:"black"}}>Sign In</a>
            <a href="/contact" style={darkMode ? {color:"white"}:{color:"black"}}>Help</a>
          </div>

          <div className="col" style={darkMode ? {color:"white"}:{}}>
            <h4> Secure Payment Gateways</h4>
            <img src="images/pay.png" alt="" width="260px" style={darkMode ? {background:"white", borderRadius:"15px"}:{}}/>
          </div>
          <div className="copyright" style={darkMode ? {color:"white"}:{}}>
            <p>© Copyright 2024 HTML.am</p>
          </div>
        </footer>
        
      </div>
    </div>
  )
}

export default App


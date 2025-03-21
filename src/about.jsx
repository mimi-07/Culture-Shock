import React, { useEffect, useState} from 'react';
import './about.css';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

// Menu functions
function showSidebar() {
  document.querySelector("#navbar_2").style.display = "flex";
}

function hideSidebar() {
  document.querySelector("#navbar_2").style.display = "none";
}

function showAdminbar(){
  const sidebar = document.querySelector("#navbar_3")
  sidebar.style.display = "flex"
}
function hideAdminbar(){
  const sidebar = document.querySelector("#navbar_3")
  sidebar.style.display = "none"
}

// Animation Variants
const boxVariant = {
  visible: { opacity: 1, height: "100%", y: 0, transition: { duration: 0.5, delay: 0.65 } },
  hidden: { opacity: 0, height: "0", y: 75 }
};

const Scroll = {
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 }},
  hidden: { opacity: 0, y: 75}
};

const Scroll2 = {
  firstPage: { width: "250px", height: "50vh", top:"40%",left:"50%", transform:"translateX(-50%)" },
  secondPage: {width: "100vw", height: "50vh", top:"150%",left:"50%",borderRadius:"0", transform:"translateX(-50%)",transition: { duration: 0.35 }}
}

const About = () => {
  const [count, setCount] = useState(0)

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

  const [isOnSecondPage, setIsOnSecondPage] = useState(false);
  // Controls and refs for animations
  const control1 = useAnimation();
  const control2 = useAnimation();
  const control3 = useAnimation();




  const { ref: ref1, inView: inView1 } = useInView();
  const { ref: ref2, inView: inView2 } = useInView();
  const { ref: ref3, inView: inView3 } = useInView();
  const { ref: ref4, inView: inView4 } = useInView({ threshold: 0.5 });
  const { ref: ref5, inView: inView5 } = useInView({ threshold: 0.5 });



  if (inView4 && isOnSecondPage) {
    setIsOnSecondPage(false);
  } else if (inView5 && !isOnSecondPage) {
    setIsOnSecondPage(true);
  }
  // Trigger animations when elements enter view
  useEffect(() => {
    if (inView1) control1.start("visible");
    else control1.start("hidden");
  }, [control1, inView1]);

  useEffect(() => {
    if (inView2) control2.start("visible");
    else control2.start("hidden");
  }, [control2, inView2]);

  useEffect(() => {
    if (inView3) control3.start("visible");
    else control3.start("hidden");
  }, [control3, inView3]);



  return (
    <div className='P4'>
      <div className='container'>
        {/* Navbar */}
        <div className="navbar_1">
          <a href="/" className="logo">
            <ul>
              <li><img src="images/logo.png" alt="Logo" /></li>
            </ul>
          </a>
          <nav className="icons">
            <ul>
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

        {/* Sidebar */}
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
        
        {/* Section 1 */}
        <section className='s1'ref={ref4}>

          <div>
            <a href="https://www.fontspace.com/category/fancy">
              <img src="https://see.fontimg.com/api/rf5/gx385/ZGExZDkzZGNiMWYzNDAxYjkyMWI0ZjMyZWFlZjM3YWMudHRm/V2hvIEFyZSBXZQ/daisyway-personal-use.png?r=fs&h=130&w=2000&fg=7D5C5C&bg=FFFFFF&tb=1&s=65" alt="Fancy fonts" />
            </a>
            <motion.img 
              initial="firstPage"
              animate={isOnSecondPage ? "secondPage" : "firstPage"}
              variants={Scroll2}
            id="img_1" src="images/fashion-woman-casual-hipster-summer-clothes_158538-7989.avif" alt="" />
          </div>
          <video autoPlay loop muted>
            <source src="images/istockphoto-512962704-640_adpp_is.mp4" type="video/mp4" />
          </video>
        </section>

        {/* Section 2 */}
        <section className='s2' ref={ref5}>
          <motion.div className="co1"
            ref={ref1}
            variants={boxVariant}
            initial="hidden"
            animate={control1}
          >
            <h1>We Are Culture Shock</h1>
            <h2>A business whose mission is to incorporate locally sourced art back into our community.</h2>
            <p>Aren’t you bored of everyone following the same trends and looking the same?</p>
          </motion.div>
        </section>

        <section className='s3'>

          <div className="col1">
            <p>We work with <a href="https://www.shopify.com/uk/free-trial?term=shopify&adid=565751946441&campaignid=15439902872&branded_enterprise=1&BOID=brand&utm_medium=cpc&utm_source=google&gad_source=1&gclid=CjwKCAiAg8S7BhATEiwAO2-R6vZPilveKDDDm5Ye6z49HH21ciAjAgt4UA10ik8bmk1btEuALruatxoCvzcQAvD_BwE&cmadid=516586848;cmadvertiserid=10730501;cmcampaignid=26990768;cmplacementid=324286430;cmcreativeid=163722649;cmsiteid=5500011">Shopify</a> and will dropship your choice products directly to you</p>
            <div className="wrapper">
              <img src="images/shopify_image.png" alt="" />
            </div>
          </div>

          <div className="col2">
            <div className="wrapper">
              <p>Run by students of <a href="https://www.loretogrammar.co.uk/">Loreto Gammar School</a></p>
              <img src="images/download2.png" alt="" />
            </div>
          </div>

          <div className="col3">
            <div className="wrapper">
              <p> Part of the the <a href="https://www.young-enterprise.org.uk/">Company Connect Project</a> for Young enterprise</p>
              <img src="images/download3.png" alt="" />
            </div>
          </div>

        </section>

        <section className='s4'>
          <motion.h1
            ref={ref2}
            variants={Scroll}
            initial="hidden"
            animate={control2}
          >
            So Don't Miss Out<br /><span>Culture Shock</span>
          </motion.h1>

          <motion.div className="socials"
            ref={ref3}
            variants={Scroll}
            initial="hidden"
            animate={control3}
          >
            <button><a href="/shop" style={{ color: "white" }}>Shop Now</a></button>
          </motion.div>
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
            <h4>Secure Payment Gateways</h4>
            <img src="images/pay.png" alt="" width="260px" />
          </div>
          <div className="copyright">
            <p>© Copyright 2024 HTML.am</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default About;

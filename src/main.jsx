import React, { StrictMode, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route} from "react-router-dom"; 
import './index.css';
import 'boxicons';

// Pages
import App from './App.jsx';
import Login from './login.jsx';
import Contact from './contact.jsx';
import About from './about.jsx';
import { ThemeProvider } from './ThemeContext.jsx';
import EmailVerification from './EmailVerification';
import Privacy from './privacy';
import Settings from './settings.jsx';
import NotFound from './notfound.jsx';

function Run() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  


  // This effect will re-render when the pathname changes
  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    // Add listener for pathname changes (if you're using browser history manipulation)
    window.addEventListener("popstate", handleLocationChange);

    return () => {
      // Clean up the event listener
      window.removeEventListener("popstate", handleLocationChange);
    };
  }, []);

  

  const sendVerificationCode = async (name, email) => {
    try {
      const response = await fetch('http://localhost:5002/verify-code', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json().catch(() => {
        throw new Error("Invalid JSON response from server");
      });
  
      console.log("API response:", data);
      
      // ✅ Ensure success property exists
      return { success: data.success || false, message: data.message || "OTP sent successfully!" };
    } catch (error) {
      console.error("Error sending email:", error);
      return { success: false, message: "Failed to send OTP. Please try again." };
    }
  };
  const HelpRequest = async (name, email, message) => {
    try {
      const response = await fetch('http://localhost:5002/send-message', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json().catch(() => {
        throw new Error("Invalid JSON response from server");
      });
  
      console.log("API response:", data);
      
      // ✅ Ensure success property exists
      return { success: data.success || false, message: data.message || "Message sent successfully!" };
    } catch (error) {
      console.error("Error sending email:", error);
      return { success: false, message: "Failed to send message. Please try again." };
    }
  };
  
  

  return <Router> {/* ✅ Wrap everything in Router */}
  <Routes>
    <Route path="/" element={<ThemeProvider><App /></ThemeProvider>} />
    <Route path="/login" element={<Login sendVerificationCode={sendVerificationCode} />} />
    <Route path="/about" element={<About />} />
    <Route path="/privacy" element={<ThemeProvider><Privacy /></ThemeProvider>} />
    <Route path="/contact" element={<Contact sendHelpMessage={HelpRequest}/>} />
    <Route path="/settings/:customerId" element={<Settings />} />
    <Route path="/verify" element={<EmailVerification sendVerificationCode={sendVerificationCode}/>} /> {/* ✅ Route for verification */}
    <Route path="*" element={<NotFound/>} />
  </Routes>
</Router>;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Run />
  </StrictMode>
);

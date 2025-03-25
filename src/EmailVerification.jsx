import React, { useState, useEffect } from "react";
import Verification from "./verification.jsx"; // Ensure correct path
import { useLocation } from "react-router-dom"; // ✅ Import useLocation

const EmailVerification = ({sendVerificationCode }) => {
  const location = useLocation();
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  
  useEffect(() => {
    // ✅ Extract query parameters from URL
    const urlParams = new URLSearchParams(location.search);
    setName(urlParams.get("name") || "");
    setEmail(urlParams.get("email") || "");
  }, [location.search]); // ✅ Updates if URL changes

  // Function to send OTP request to backend
  const sendCode = async (e) => {
    e.preventDefault();

    const response = await sendVerificationCode(name, email);
    console.log("Response from sendVerificationCode:", response);
  
  };

  // Function to verify OTP
  const verifyCode = async (email, otp, name) => {
    if (!otp) {
        console.log("Missing OTP.");
        return { success: false, message: "Missing OTP." };
    }

    console.log("Sending OTP verification request:", otp);

    try {
        const response = await fetch("https://culture-shock.onrender.com/verify-otp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, otp, name }),
            credentials: 'include', // ✅ Send correct OTP
        });

        const data = await response.json();
        console.log("Response Data:", data);

        if (data.success) {
            // ✅ Store ID in localStorage (use consistent key)
            localStorage.setItem("shopifyCustomerId", data.customerId);

            // ✅ Redirect to home page
            window.location.href = "#/"; 
        } else {
            alert(data.message || "Invalid OTP. Try again.");
        }

        return data;
    } catch (error) {
        console.error("Error verifying OTP:", error);
        return { success: false, message: "Internal server error." };
    }
};



  return (
    <div>
      {/* Here, you pass email to the Verification component */}
      <Verification 
        email={email}
        name={name}
        onVerifyCode={verifyCode}
        onResendCode={sendCode}
      />
    </div>
  );
};

export default EmailVerification;

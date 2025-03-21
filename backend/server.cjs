const nodemailer = require('nodemailer');
const axios = require('axios');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config({ path: './backend/.env' });


const app = express();
const PORT = 5002;  // Backend port

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:5173',  // Your frontend URL
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Preflight OPTIONS request
app.use(express.json());
app.use(bodyParser.json());

//testing



// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Temporary storage for OTPs
let storedOtp = {};

// Send OTP code to the user's email
app.post('/verify-code', async (req, res) => {
  const { name, email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000);  // Generate OTP
  storedOtp[email] = otp;


  try {
    console.log("Attempting to send email...");
    console.log("EMAIL_USER:", process.env.EMAIL_USER);
    console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "Loaded" : "Not Loaded");

    const info = await transporter.sendMail({
      from: `"Culture Shock" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your Verification Code',
      text: `Hello ${name},\nYour verification code is: ${otp}`,
    });

    console.log("Email sent successfully:", info);
    res.json({ success: true, message: 'Code sent successfully!' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ message: 'Failed to send code. Please try again.', error: error.toString() });
  }
});

// Verify OTP code and create Shopify customer
app.post("/verify-otp", async (req, res) => {
  try {

    const { email, otp, name } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: "Email and OTP are required." });
    }

    // Check OTP
    if (!storedOtp[email] || storedOtp[email] !== Number(otp)) {
      return res.status(400).json({ success: false, message: "Invalid OTP." });
    }

    delete storedOtp[email]; // ✅ OTP is valid, remove it after verification

    let customer = await getShopifyCustomer(email);

    if (!customer) {
      console.log(`🚨 Customer with email ${email} not found, creating a new one...`);
      customer = await createShopifyCustomer(email, name);

      if (!customer) {
        console.error("❌ Failed to create customer.");
        return res.status(500).json({ success: false, message: "Error creating customer." });
      }
    } else {
      console.log(`✅ Existing customer found: ${customer.id}`);
    }

    res.json({
      success: true,
      message: "Verified & logged in!",
      customerId: customer.id, // ✅ Send customer ID to frontend
    });

  } catch (error) {
    console.error("❌ Error in /verify-otp:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
});

app.post("/send-message", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const mailOptions = {
    from: email, // The sender's email
    to: process.env.EMAIL_USER, // Replace with your recipient email
    subject: `New Contact Form Message from ${name}`,
    text: `You received a new message from ${name} (${email}):\n\n${message}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ message: "Message sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
});

// Fetch customer details from Shopify



app.post("/logout-everywhere", async (req, res) => {
  try {
      const customerAccessToken = process.env.SHOPIFY_ACCESS_TOKEN; // Get the token from the request

      if (!customerAccessToken) {
          return res.status(400).json({ message: "No access token provided" });
      }

      const query = `
      mutation customerAccessTokenDelete($customerAccessToken: String!) {
          customerAccessTokenDelete(accessToken: $customerAccessToken) {
              deletedAccessToken
              userErrors {
                  field
                  message
              }
          }
      }`;

      const response = await fetch(`https://${process.env.SHOPIFY_STORE}.myshopify.com/api/2025-01/graphql.json`, {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              "X-Shopify-Storefront-Access-Token": "81e092b3726273186f5d50dfff4a1566",
          },
          body: JSON.stringify({
              query,
              variables: { customerAccessToken }
          }),
      });

      const data = await response.json();

      if (data.data.customerAccessTokenDelete.deletedAccessToken) {
          res.clearCookie("sessionId"); // If using cookies, clear them
          res.status(200).json({ message: "Logged out everywhere" });
      } else {
          res.status(400).json({ message: "Failed to revoke token", errors: data.data.customerAccessTokenDelete.userErrors });
      }

  } catch (error) {
      console.error("Error logging out everywhere:", error);
      res.status(500).json({ message: "Internal server error" });
  }
});



// Function to create or get a customer in Shopify
const getShopifyCustomer = async (email) => {
  const shopifyUrl = `https://${process.env.SHOPIFY_STORE}.myshopify.com/admin/api/2025-01/customers/search.json?query=email:${email}`;

  try {
    console.log(`🔍 Searching for Shopify customer with email: ${email}`);

    const response = await axios.get(shopifyUrl, {
      headers: {
        "X-Shopify-Access-Token": process.env.SHOPIFY_ACCESS_TOKEN,
        "Content-Type": "application/json",
      },
    });

    const customers = response.data.customers;

    if (!customers || customers.length === 0) {
      console.log(`❌ No Shopify customer found for email: ${email}`);
      return null;
    }

    console.log(`✅ Found existing Shopify customer:`, customers[0]);
    return customers[0]; // Return the existing customer
  } catch (error) {
    console.error("❌ Error fetching Shopify customer:", error);
    return null;
  }
};

const createShopifyCustomer = async (email, name) => {
  console.log(`🔵 Creating new Shopify customer for email: ${email}`);

  const shopifyUrl = `https://${process.env.SHOPIFY_STORE}.myshopify.com/admin/api/2025-01/customers.json`;

  try {
    const response = await axios.post(
      shopifyUrl,
      {
        customer: {
          first_name: name,
          email: email,
          verified_email: true,
          tags: "OTP Verified",
        },
      },
      {
        headers: {
          "X-Shopify-Access-Token": process.env.SHOPIFY_ACCESS_TOKEN,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Shopify Response:", JSON.stringify(response.data, null, 2));

    if (response.data.customer) {
      console.log(`✅ Successfully created new customer:`, response.data.customer);
      return response.data.customer;
    } else {
      console.error("❌ Unexpected response from Shopify when creating customer:", response.data);
      return null;
    }
  } catch (error) {
    console.error("❌ Error creating Shopify customer:", 
      error.response ? error.response.data : error
    );
    return null;
  }
};





// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  
});

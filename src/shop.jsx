import React, { useState, useEffect } from 'react';
import './shop.css';

// Menu Functions
function showSidebar() {
  document.querySelector('#navbar_2').style.display = 'flex';
}

function hideSidebar() {
  document.querySelector('#navbar_2').style.display = 'none';
}

function showAdminbar(){
  const sidebar = document.querySelector("#navbar_3")
  sidebar.style.display = "flex"
}
function hideAdminbar(){
  const sidebar = document.querySelector("#navbar_3")
  sidebar.style.display = "none"
}

function showFilterbar(){
  const sidebar = document.querySelector(".filter")
  sidebar.style.display = "flex"
}
function hideFilterbar(){
  const sidebar = document.querySelector(".filter")
  if (window.innerWidth < 600) {
    sidebar.style.display = "none";
  }
}
const getTagFromUrl = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get("tag"); // Extract the "tag" value from ?tag=shirt
};

// Ensure the filter is visible when the screen is resized above 600px
window.addEventListener("resize", () => {
  const sidebar = document.querySelector(".filter");

  if (window.innerWidth >= 600) {
    sidebar.style.display = "flex"; // Show filter when screen is large
  }
});


const SHOPIFY_STORE = 'h7h4c9-aj';  // Your Shopify store's subdomain
const ACCESS_TOKEN = '81e092b3726273186f5d50dfff4a1566';  // Your Storefront API Access Token

function Shop() {
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [availabilityFilter, setAvailabilityFilter] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [variantId, setVariantId] = useState(null);
  const [showAvailability, setShowAvailability] = useState(false);
  const [showPrice, setShowPrice] = useState(false);
  const [tagFilter, setTagFilter] = useState(""); // ✅ Store multiple selected types

  const toggleAvailability = () => {
    setShowAvailability((prev) => !prev); // Toggle availability
    setShowPrice(false); // Hide price when availability is opened
  };

  const togglePrice = () => {
    setShowPrice((prev) => !prev); // Toggle price
    setShowAvailability(false); // Hide availability when price is opened
  };


  const handleLogout = () => {
    localStorage.removeItem("shopifyCustomerId"); // Remove stored customer ID
    window.location.href = "/"; // Redirect to login page
  };
  
  
  
  useEffect(() => {
    const customerId = localStorage.getItem("shopifyCustomerId");
    const userIcon = document.getElementById("userIcon");
    const adminIcon = document.getElementById("adminIcon");
  
    if (customerId) {
      if (userIcon) userIcon.style.display = "none"; // Hide login button
      if (adminIcon) adminIcon.style.display = "inline-flex"; // Show admin button
    } else {3
      if (userIcon) userIcon.style.display = "inline-flex"; // Show login button
      if (adminIcon) adminIcon.style.display = "none"; // Hide admin button
    }
  }, []);

  

  useEffect(() => {
    if (products.length === 0) return; // ✅ Prevent filtering before products exist

    let updatedProducts = [...products];
    
    // Filter by Availability
    if (availabilityFilter) {
      updatedProducts = updatedProducts.filter((product) =>
        availabilityFilter === "available"
          ? product.node.availableForSale // Product is available
          : !product.node.availableForSale // Product is out of stock
      );
    }
    
    // Filter by Tag (e.g., "shirt", "hoodie", etc.)
  
  
    
    if (tagFilter.length > 0) {
      updatedProducts = updatedProducts.filter((product) =>
        tagFilter.every(tag => product.node.tags.includes(tag)) // Filter products by all selected tags
      );
    }
  
    // Filter by Price Range
    const minPrice = parseFloat(priceFilter.min) || 0;
    const maxPrice = parseFloat(priceFilter.max) || Infinity;
    updatedProducts = updatedProducts.filter((product) => {
      const price = parseFloat(product.node.variants.edges[0]?.node.priceV2.amount);
      return price >= minPrice && price <= maxPrice;
    });
  
    // Sort products
    switch (sortOrder) {
      case "opt1": // Price, Low-High
        updatedProducts.sort((a, b) => 
          parseFloat(a.node.variants.edges[0]?.node.priceV2.amount) - 
          parseFloat(b.node.variants.edges[0]?.node.priceV2.amount)
        );
        break;
      case "opt2": // Price, High-Low
        updatedProducts.sort((a, b) => 
          parseFloat(b.node.variants.edges[0]?.node.priceV2.amount) - 
          parseFloat(a.node.variants.edges[0]?.node.priceV2.amount)
        );
        break;
      case "opt3": // Alphabetically, A-Z
        updatedProducts.sort((a, b) => a.node.title.localeCompare(b.node.title));
        break;
      case "opt4": // Alphabetically, Z-A
        updatedProducts.sort((a, b) => b.node.title.localeCompare(a.node.title));
        break;
      default:
        break;
    }
  
    setFilteredProducts(updatedProducts);

    
  }, [availabilityFilter, priceFilter, sortOrder, products, tagFilter]);
  

  useEffect(() => {
      const initialTag = getTagFromUrl(); // Get the tag from the URL on load
    
      if (initialTag) {
        setTagFilter([initialTag]); // ✅ Immediately apply filter on load
      }
    }, []);
    
  useEffect(() => {
    const fetchProducts = async () => {
      const query = `{
        products(first: 100) {
          edges {
            node {
              id
              title
              handle
              availableForSale
              tags
              featuredImage {
                url
                altText
              }
              variants(first: 10) {
                edges {
                  node {
                    id             
                    priceV2 {
                      amount
                      currencyCode
                    }
                  }
                }
              }
            }
          }
        }
      }`;
  
      try {
        const response = await fetch(`https://${SHOPIFY_STORE}.myshopify.com/api/2025-01/graphql.json`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Storefront-Access-Token': ACCESS_TOKEN,
          },
          body: JSON.stringify({ query }),
        });
  
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
  
        const data = await response.json();
        if (!data?.data?.products) throw new Error("Invalid response structure");
        
        let productsList = data.data.products.edges;

        // ✅ Step 3: Apply stored tag filter BEFORE updating state
        const initialTag = getTagFromUrl();
          if (initialTag) {
            productsList = productsList.filter(product =>
              product.node.tags.includes(initialTag)
            );
          }
        
        // Extract the variant ID of the first variant of the first product
        const firstVariantId = data.data.products.edges[0].node.variants.edges[0].node.id;

        // Store it in state
        setVariantId(firstVariantId); // Save the variant ID in the state

        setProducts(data.data.products.edges);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError("Failed to load products. Please try again later.");
      }
    };
  
    fetchProducts(); // Fetch products when component mounts
  }, []); // Run only on mount

  




  useEffect(() => {
    console.log("Products:", products);
    console.log("Filtered Products:", filteredProducts);

    if (searchTerm) {
      setFilteredProducts(
        products.filter((product) =>
          product.node.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredProducts(products);
    }
  }, [searchTerm, products]);


  useEffect(() => {

    function initializeShopifyBuy() {
      if (!window.ShopifyBuy) {
        console.error("ShopifyBuy failed to load.");
        return;
      }
  
      const client = window.ShopifyBuy.buildClient({
        domain: 'h7h4c9-aj.myshopify.com',
        storefrontAccessToken: '818c74748e2ba54039f3cde7710c4d8d',
      });
  
      window.ShopifyBuy.UI.onReady(client).then((ui) => {
        window.shopifyUI = ui;
  
        filteredProducts.forEach((product) => {
          const container = document.getElementById(`product-${product.node.id}`);
          if (container) {
            container.innerHTML = ""; // Clear previous buttons to prevent duplication
            ui.createComponent("product", {
              id: product.node.id.replace("gid://shopify/Product/", ""),
              node: container,
              moneyFormat: '%C2%A3%7B%7Bamount%7D%7D',
              options: {
                "product": {
                  "styles": {
                    "product": {
                      "@media (min-width: 601px)": {
                        "max-width": "calc(33.33333% - 30px)",
                        "margin-left": "30px",
                        "margin-bottom": "50px",
                        "width": "calc(33.33333% - 30px)"
                      },
                      "text-align": "left",
                      "img": {
                        "left": "0",
                        "top": "0",

                        "width": "100%",

                      },
                      "imgWrapper": {
                        
                        "position": "relative"
                      },
                      "title": {
                        "display":"none"
                      },
                    },
                    "button": {
                      "font-family": "Quantico, sans-serif",
                      ":hover": {
                        "background-color": "transparent"
                      },
                      "background-color": "transparent",
                      ":focus": {
                        "background-color": "transparent"
                      },
                      "padding-left": "45px",
                      "padding-right": "45px",
                      "position":"absolute",
                      "top":"0",
                      "left":"0",
                      "z-index":"2",
                      "height":"100%",
                      "width":"100%"
                    },
                    "price": {
                      "display":"none"
                    },
                    "compareAt": {
                      "display":"none"
                    },
                    "unitPrice": {
                      "display":"none"
                    }

                  },
                  "buttonDestination": "modal",
                  "contents": {
                    "options": false
                  },
                  "text": {
                    "button": ""
                  },
                  
                  "googleFonts": [
                    "Quantico"
                  ]
                },
                "productSet": {
                  "styles": {
                    "products": {
                      "@media (min-width: 601px)": {
                        "margin-left": "-20px"
                      }
                    }
                  }
                },
                "modalProduct": {
                  "contents": {
                    "img": false,
                    "imgWithCarousel": true,
                    "button": false,
                    "buttonWithQuantity": true
                  },
                  "styles": {
                    "product": {
                      "@media (min-width: 601px)": {
                        "max-width": "100%",
                        "margin-left": "0px",
                        "margin-bottom": "0px"
                      }
                    },
                    "button": {
                      "font-family": "Quantico, sans-serif",
                      ":hover": {
                        "background-color": "#986866"
                      },
                      "background-color": "#a97371",
                      ":focus": {
                        "background-color": "#986866"
                      },
                      "border-radius": "6px",
                      "padding-left": "45px",
                      "padding-right": "45px"
                    }
                  },
                  "googleFonts": [
                    "Quantico"
                  ],
                  "text": {
                    "button": "Add to cart"
                  },
                  "events": {
                    addVariantToCart: async (variant) => {
                      console.log("Intercepted Add to Cart:", variant);
                      await createOrUpdateCart(variant.id); // Call cart function
                    },
                  },
                },
                "option": {},
                "cart": {
                  "popup":true,
                  "styles": {
                    "button": {
                      "font-family": "Quantico, sans-serif",
                      ":hover": {
                        "background-color": "#986866"
                      },
                      "background-color": "#a97371",
                      ":focus": {
                        "background-color": "#986866"
                      },
                      "border-radius": "6px"
                    }
                  },
                  "contents": {
                    "button": true, // Ensure cart button is enabled
                  },
                  "text": {
                    "total": "Subtotal",
                    "button": "Checkout"
                  },
                  "events": {
                    checkout: () => {
                      checkoutCart(); // Redirect to new checkout
                    },
                  },
                  "googleFonts": [
                    "Quantico"
                  ]
                },
                "toggle": {
                  "styles": {
                    "toggle": {
                      "font-family": "Quantico, sans-serif",
                      "background-color": "#a97371",
                      ":hover": {
                        "background-color": "#986866"
                      },
                      ":focus": {
                        "background-color": "#986866"
                      }
                    }
                  },
                  "googleFonts": [
                    "Quantico"
                  ]
                }
              },
            });
          }
        });
      }).catch(error => console.error("Shopify UI initialization error:", error));
    }

    
  const setupShopifyButtons = () => {
    if (!window.ShopifyBuy) {
      console.warn("ShopifyBuy not found. Loading script...");
      
      if (!document.querySelector("script[src='https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js']")) {
        const script = document.createElement("script");
        script.src = "https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js";
        script.async = true;
        script.onload = () => {
          console.log("ShopifyBuy script loaded.");
          initializeShopifyBuy();
        };
        script.onerror = () => console.error("Failed to load Shopify Buy Button script.");
        document.body.appendChild(script);
      }
    } else {
      console.log("ShopifyBuy already loaded. Initializing...");
      initializeShopifyBuy();
    }
  };
    if (filteredProducts.length === 0) return; // Ensure products exist before initializing buy buttons
    
      // Remove existing buy buttons before rendering new ones
      document.querySelectorAll(".shopify-buy-button").forEach((el) => el.remove());
    
      // Small delay to let React render the updated products
      setTimeout(() => {
        setupShopifyButtons(); 
      }, 100); 
  }, [filteredProducts]); // ✅ Now updates when filtering happens!
  


  return (
    <div className="P2">
      <div className="container">
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


        {/* Search Bar */}
        <div className="searching">
          <input 
            type="search" 
            id="search-input" 
            placeholder="Search..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="search"><i className='bx bx-search'></i></button>
        </div>

        {/* Filter product */}
        <button className='Filter_btn' onClick={showFilterbar}><i class='bx bx-filter' ></i> Filter and sort</button>
        <div className="filter">
          <div className="LS">
            <p className='title'><span>Filter:</span> <i onClick={hideFilterbar} className='bx bx-x'></i></p>
            <button className="availability" onClick={toggleAvailability}>
              Availability
              <div
                className="col_btn"
                style={{ display: showAvailability ? "block" : "none" }}
                onClick={(e) => e.stopPropagation()}
              >
                <h3>Reset</h3>
                <div>
                  <label>
                    <input
                      type="checkbox"
                      checked={availabilityFilter === "available"}
                      onChange={(e) =>
                        setAvailabilityFilter(e.target.checked ? "available" : "")
                      }
                    />
                    <span>In stock</span>
                  </label>
                </div>

                <div>
                  <label>
                    <input
                      type="checkbox"
                      checked={tagFilter.includes("Shirt")}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setTagFilter([...tagFilter, "Shirt"]);
                        } else {
                          setTagFilter(tagFilter.filter(tag => tag !== "Shirt"));
                        }
                      }}
                    />
                    <span>Shirt</span>
                  </label>
                </div>

                <div>
                  <label>
                    <input
                      type="checkbox"
                      checked={tagFilter.includes("Hoodie")}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setTagFilter([...tagFilter, "Hoodie"]);
                        } else {
                          setTagFilter(tagFilter.filter(tag => tag !== "Hoodie"));
                        }
                      }}
                    />
                    <span>Hoodie</span>
                  </label>
                </div>

                <div>
                  <label>
                    <input
                      type="checkbox"
                      checked={tagFilter.includes("Accessories")}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setTagFilter([...tagFilter, "Accessories"]);
                        } else {
                          setTagFilter(tagFilter.filter(tag => tag !== "Accessories"));
                        }
                      }}
                    />
                    <span>Accessories</span>
                  </label>
                </div>

                <div>
                  <label>
                    <input
                      type="checkbox"
                      checked={tagFilter.includes("Tobag")}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setTagFilter([...tagFilter, "Tobag"]);
                        } else {
                          setTagFilter(tagFilter.filter(tag => tag !== "Tobag"));
                        }
                      }}
                    />
                    <span>Tobags</span>
                  </label>
                </div>
                <div className="no2">
                  <label>
                    <input
                      type="checkbox"
                      
                    />
                    <span>Out of stock</span>
                  </label>
                </div>
              </div>
            
            </button>
            <i className="bx bx-chevron-down"></i>
            <br />
            <button className="price" onClick={togglePrice}>
              Price
              <div
                className="col_btn"
                style={{ display: showPrice ? "block" : "none" }}
                onClick={(e) => e.stopPropagation()}
              >
                <h3>Reset</h3>
                <div className="col_btn2">
                  <h2>£</h2>
                  <input
                    type="text"
                    className="box"
                    placeholder="From"
                    onChange={(e) =>
                      setPriceFilter({ ...priceFilter, min: e.target.value })
                    }
                  />
                  <h2>£</h2>
                  <input
                    type="text"
                    className="box"
                    placeholder="To"
                    onChange={(e) =>
                      setPriceFilter({ ...priceFilter, max: e.target.value })
                    }
                  />
                </div>
              </div>
            </button>
            <i className="bx bx-chevron-down"></i>
          </div>
          <div className="RS">
            <p>Sort by:</p>
            <select
              className="order"
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="opt1">Price, Low-High</option>
              <option value="opt2">Price, High-Low</option>
              <option value="opt3">Alphabetically, A-Z</option>
              <option value="opt4">Alphabetically, Z-A</option>
              <option value="opt5">Date, Old-New</option>
              <option value="opt6">Date, New-Old</option>
            </select>
            <p>{filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""}</p>
          </div>
        </div>


        {/* Display Products */}
        <div className="product-list">
          {error && <p className="error-message">{error}</p>}
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div key={product.node.id} className="product-card">
                <div id={`product-${product.node.id}`} className="buy-button-container" />
                <h3>{product.node.title}</h3>
                <p>
                  £
                  {new Intl.NumberFormat("en-GB", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(product.node.variants.edges[0]?.node.priceV2.amount)}
                </p>
              </div>
            ))
          ) : (
            <p style={{textAlign:"center"}}>No products found.</p> // Show message if nothing is displayed
          )}
        </div>
        
        
        {/* Footer */}
        <footer className="section-p1">     
          <div className="col">
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
            <img src="images/pay.png" alt="" width="260px"/>
          </div>
          <div className="copyright">
            <p>© Copyright 2024 HTML.am</p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Shop;
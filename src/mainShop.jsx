import { Component, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import Shop from './shop.jsx'



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Shop />
  </StrictMode>,
)

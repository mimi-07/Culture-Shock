import React, { useContext, useState } from "react"
import { ThemeContext } from "./ThemeContext.jsx"

export default function ThemeButton(){
    const {darkMode,setDarkMode} = useContext(ThemeContext);
    const [isAnimating, setIsAnimating] = useState(false);

    const handleTheme = () => {
        setIsAnimating(true); 
    
        // Store the new mode BEFORE re-render
        const newDarkMode = !darkMode;
        localStorage.setItem("darkMode", newDarkMode);
    
        setTimeout(() => {
            setDarkMode(newDarkMode);
        }, 800); 
    
        setTimeout(() => {
            setIsAnimating(false);
        }, 1600);
    };
    
    return (
        <>
            {isAnimating && <div className="animation_bg_4" />}

            <a className={darkMode ? "dark_light":"light_dark"}onClick={handleTheme}>
                <i className='bx bxs-moon' ></i>
                <i className='bx bxs-sun' ></i>       
            </a>
        </>
    );
}
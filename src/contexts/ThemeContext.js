import React from 'react'
import { useEffect } from 'react';
import { useContext } from 'react'
import { useState } from 'react';

const ThemeContext = React.createContext();

export function useTheme() {
    return useContext(ThemeContext)
}

export function ThemeProvider({ children }) {   
    const [theme, setTheme] = useState(localStorage.getItem('theme'));  // Theme of aplication    

    // Theme initialization
    const html = document.querySelectorAll('html')[0]
    html.classList.add(theme)

    const value = {
        theme, setTheme,
    }
    
    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    )
}
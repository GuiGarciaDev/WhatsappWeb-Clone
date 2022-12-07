import React from 'react'
import { useContext } from 'react'
import { useState } from 'react';

const DataContext = React.createContext(); // Change it for a better name (GlobalContext is a good idea?)

export function useData() {
    return useContext(DataContext)
}

export function DataProvider({ children }) {
    const [user, setUser] = useState([]);
    const [contact, setContact] = useState([]);
    const [sendContactModal, setSendContactModal] = useState(false); // Open Send Contact Modal in App.js
    const [repMessage, setRepMessage] = useState([false, {}]);
    const [error, setError] = useState();

    const value = {
        user, setUser,
        contact, setContact,
        repMessage, setRepMessage,
        error, setError,
        sendContactModal, setSendContactModal,
    }
    
    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    )
}
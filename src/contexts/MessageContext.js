import React from 'react'
import { useContext } from 'react'
import { useState } from 'react';

const DataContext = React.createContext(); // Change it for a better name (GlobalContext is a good idea?)

export function useData() {
    return useContext(DataContext)
}

export function DataProvider({ children }) {
    const [messagePage, setMessagePage] = useState(false) // State of <MessagePage/> component in App.js (chat page)
    const [chatId, setChatId] = useState('')              // Parameter of <MessagePage/> component in App.js (id of chat)
    const [cardActived, setCardActived] = useState('');   // Parameter of <MessagePage/> component in App.js (change bg of card in leftColumn)
    const [contact, setContact] = useState([]);           // Parameter of <MessagePage/> component in App.js (set contact data to chat page)


    const [user, setUser] = useState([]) // CurrentUser data
    const [repMessage, setRepMessage] = useState([false, {}]);
    const [error, setError] = useState();

    // Modals

    const [sendContactModal, setSendContactModal] = useState(false); // Open Send Contact Modal in App.js

    const value = {
        messagePage, setMessagePage,
        cardActived, setCardActived,
        chatId, setChatId,
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
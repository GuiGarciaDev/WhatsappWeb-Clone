import React from 'react'
import { useContext } from 'react'
import { useState } from 'react';

const DataContext = React.createContext();

export function useData() {
    return useContext(DataContext)
}

export function DataProvider({ children }) {
    const [repMessage, setRepMessage] = useState([false, {}]);

    const value = {
        repMessage, setRepMessage,
    }

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    )
}
import { doc, setDoc } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react'
import { auth, firedb } from '../firebase'

const AuthContext = React.createContext();

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState();
    const [loading, setLoading] = useState(true);

    async function signup(email, password) {
        return auth.createUserWithEmailAndPassword(email, password).then(() => {
            setDoc(doc(firedb, 'users', email), {
                id: Math.ceil(Math.random()*Date.now()), // Unique ID
                name: "DefaultName",
                status: "Change your status here!",
                online: false,
                email: email,
                last_connection: "00:00",
                group: [],
                contacts: []
            }) 
        })
    }

    function login(email, password) {
        return auth.signInWithEmailAndPassword(email, password)
    }

    function logout() {
        return auth.signOut()
    }

    function resetPassword(email) {
        return auth.sendPasswordResetEmail(email)
    }

    function updateEmail(email) {
        return currentUser.updateEmail(email)
    }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setCurrentUser(user)
            setLoading(false)
        })

        return unsubscribe
    }, [])
    

    const value = {
        currentUser,
        signup,
        login,
        logout,
        resetPassword,
        updateEmail
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}
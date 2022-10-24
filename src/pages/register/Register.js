import './style.scss';
import { useAuth } from '../../contexts/AuthContext';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { FaUser } from 'react-icons/fa';
import { BsWhatsapp } from 'react-icons/bs';
import { MdLock } from 'react-icons/md';

export default function Register() {
    const emailRef = useRef()
    const passwordRef = useRef()
    const passwordConfirmRef = useRef()
    const { signup } = useAuth()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    async function handleSubmit(event) {
        event.preventDefault()

        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
            return setError('Passwords do not match')
        } 

        try {
            setError('')
            setLoading(true)
            await signup(emailRef.current.value, passwordRef.current.value)
            navigate('/login')
        } catch {
            setError('Failed to create an account')
        }
        setLoading(false) 
    }

    return (
        <div className='register-page'>
            <div className='register-container'>
                <div className='register-image-holder'>
                    <BsWhatsapp/>
                </div>

                <h1>New Account</h1>

                { error &&  <span>{error}</span> }

                <form onSubmit={handleSubmit}>
                    <div className='email-holder'>
                        <div className='register-icon-holder'>
                            <FaUser/>
                        </div>
                        <input type='email' placeholder='Email' ref={emailRef}></input>
                    </div>

                    <div className='password-holder'>
                        <div className='register-icon-holder'>
                            <MdLock/>
                        </div>
                        <input type='password' placeholder='Password' ref={passwordRef}></input>
                    </div>

                    <div className='password-holder'>
                        <div className='register-icon-holder'>
                            <MdLock/>
                        </div>
                        <input type='password' placeholder='Confirm Password' ref={passwordConfirmRef}></input>
                    </div>

                    <button className='register-button' disabled={loading} type='submit'>REGISTER</button>
                </form>
            </div>
        </div>
    )
}
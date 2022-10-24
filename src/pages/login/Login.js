import './style.scss';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useRef, useState } from 'react';

import { FaUser } from 'react-icons/fa';
import { BsWhatsapp } from 'react-icons/bs';
import { MdLock } from 'react-icons/md';

export default function Login() {
    const emailRef = useRef()
    const passwordRef = useRef()
    const { login } = useAuth()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    async function handleSubmit(event) {
        event.preventDefault()

        try {
            setError('')
            setLoading(true)
            await login(emailRef.current.value, passwordRef.current.value)
            navigate('/')
        } catch {
            setError('Failed to log in')
        }
        setLoading(false) 
    }

    return (
        <div className='login-page'>
            <div className='login-container'>
                <div className='login-image-holder'>
                    <BsWhatsapp/>
                </div>

                <h1>Login</h1>

                { error &&  <span>{error}</span> }
                
                <form onSubmit={handleSubmit}>
                    <div className='email-holder'>
                        <div className='login-icon-holder'>
                            <FaUser/>
                        </div>
                        <input type='email' placeholder='Email' ref={emailRef}></input>
                    </div>

                    <div className='password-holder'>
                        <div className='login-icon-holder'>
                            <MdLock/>
                        </div>
                        <input type='password' placeholder='Password' ref={passwordRef}></input>
                    </div>

                    <Link to='/forgot-password'>Forgot password?</Link>

                    <button className='login-button' type='submit' disabled={loading}>LOGIN</button>
                    
                </form>
                <Link to='/register'>
                    <button className='register-button'>REGISTER</button>
                </Link>
            </div>
        </div>
    )
}
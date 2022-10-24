import './style.scss';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useRef, useState } from 'react';

import { FaUser } from 'react-icons/fa';
import { BsWhatsapp } from 'react-icons/bs';

export default function ForgotPassword() {
    const emailRef = useRef()
    const { resetPassword } = useAuth()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [sent, setSent] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault()

        try {
            setError('')
            setLoading(true)
            await resetPassword(emailRef.current.value)
            setSent(true)
        } catch {
            setError('Failed to send email')
        }
        setLoading(false) 
    }

    return (
        <div className='login-page'>
            <div className='login-container'>
                <div className='login-image-holder'>
                    <BsWhatsapp/>
                </div>

                <h1>Reset password</h1>

                { error &&  <span>{error}</span> }
                
                <form onSubmit={handleSubmit}>
                    {
                        sent ?
                        <p>Check your inbox for further instructions</p>
                        :
                        <div className='email-holder'>  
                            <div className='login-icon-holder'>
                                <FaUser/>
                            </div>
                            <input type='email' placeholder='Email' ref={emailRef}></input>
                        </div>
                    }
                    {
                        !sent && <button className='login-button' type='submit' disabled={loading}>RESET PASSWORD</button>
                    }
                    
                </form>
                
                <Link to='/login'>
                    <button className='register-button'>LOGIN</button>
                </Link>
                
            </div>
        </div>
    )
}
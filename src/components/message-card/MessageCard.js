import './style.scss';
import db from '../../db.json';

import { BsCheckAll } from 'react-icons/bs';
import { useEffect, useRef } from 'react';

export default function MessageCard({ id, content, time, isRead, children, isMy }) { 

    const lastMessageRef = useRef()

    useEffect(() => {
        lastMessageRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [])

    return (
        <>
            <div id={id} className="message-card" style={isMy ? {alignSelf: 'flex-end'} : {alignSelf: 'flex-start'}} ref={lastMessageRef}>
                <div className='message-card-content'>
                    <p>{content}</p>
                </div>
                <div className='time'>
                    <span id='message-card-time'>{time}</span>
                    <BsCheckAll style={isRead ? {color: "#53bdeb"} : {color: "white", opacity: "0.6"}}/>
                </div>
                
                {children}
            </div>
        </>
    )
}
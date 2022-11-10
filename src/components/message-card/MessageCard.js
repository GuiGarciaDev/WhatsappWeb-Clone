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
            <div id={id} className="message-card" 
            style={isMy ? {alignSelf: 'flex-end', borderRadius: '10px 0 10px 10px'} : {alignSelf: 'flex-start', borderRadius: '0 10px 10px 10px'}} 
            ref={lastMessageRef}
            >
                <div className='message-card-content'>
                    <p>{content}</p>
                    <label style={isMy ? {right: '-12px'} : {left: '-12px', transform: 'scale(-1, 1)'}}/>
                </div>
                <div className='time' style={!isMy ? {right: '0px'} : {right: '-9px'}}>
                    <span id='message-card-time' >{time}</span>
                    {
                        isMy ? <BsCheckAll style={isRead ? {color: "#53bdeb"} : {color: "white", opacity: "0.6"}}/> : <></>
                    }
                </div>
                
                {children}
            </div>
        </>
    )
}
import './style.scss';
import db from '../../db.json';

import { BsCheckAll } from 'react-icons/bs';

export default function MessageCard({ friendIndex, messageIndex, content, time, isRead, children }) { 
    const friend = db[friendIndex];
    const message = friend.messages[messageIndex];

    return (
        <>
            <div id={message.id} className="message-card" style={{alignSelf: 'flex-end'}}>
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
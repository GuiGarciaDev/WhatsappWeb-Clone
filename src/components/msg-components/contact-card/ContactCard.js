import './style.scss';

import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';

import DropMenu from '../../dropdown/dropmenu/DropMenu';

import { BsCheckAll } from 'react-icons/bs';
import { IoIosArrowDown } from 'react-icons/io';
import { getContactWithId } from '../../../API';
import { useData } from '../../../contexts/MessageContext';

export default function ContactCard({ el, id, chatId }) { 
    const lastMessageRef = useRef()
    const { openConversation } = useData()
    const { currentUser } = useAuth()
    const [data, setData] = useState([]);
    const [dropdown, setDropdown] = useState(false);
    const dropdownId = 'dd' + id;
    
    useEffect(() => {
        lastMessageRef.current?.scrollIntoView({ behavior: "smooth" })

        async function getData() {
            const contactData = await getContactWithId(el.contactId)
            setData(contactData)
        }

        getData()
    }, [])

    return (
        <div id={el.id} className="contact-card" key={el.id}
            style={el.autor === currentUser.email 
                ? {alignSelf: 'flex-end', borderRadius: '10px 0 10px 10px'} 
                : {alignSelf: 'flex-start', borderRadius: '0 10px 10px 10px'}} 
            ref={lastMessageRef}
        >
            <div className='contact-card-content'>
                <div className='contact-information'>
                    <img src={data.photoUrl}></img>
                    <div className='text-holder'>
                        <p>{data.name}</p>
                    </div>
                </div>
                <label style={el.autor === currentUser.email ? {right: '-12px'} : {left: '-12px', transform: 'scale(-1, 1)'}}/>
            </div>
            <div className='time' style={!(el.autor === currentUser.email) ? {right: '0px'} : {right: '-9px'}}>
                <span id='contact-card-time' >{el.time}</span>
                {
                    el.autor === currentUser.email 
                    ? <BsCheckAll style={el.isRead ? {color: "#53bdeb"} : {color: "white", opacity: "0.6"}}/> 
                    : <></>
                }
            </div>

            <div className='contact-buttons'>
                <button onClick={() => openConversation(el.contactId)}>Conversar</button>
            </div>
            
            {
                <>
                    <button className='contact-card-dropbutton' onClick={() => setDropdown(dropdownId)} 
                        style={ dropdown ? {display: "flex", opacity: '1'} : {}}
                    >
                    <IoIosArrowDown className='downArrow'/>
                    </button>
                    <DropMenu 
                        el={el} chatId={chatId}
                        classname={'contact-card-dropdown'} toggler={dropdown}
                        order={() => setDropdown()} id={dropdownId}
                        owner={el.autor === currentUser.email}
                    />
                </>
            }
        </div>
    )
}
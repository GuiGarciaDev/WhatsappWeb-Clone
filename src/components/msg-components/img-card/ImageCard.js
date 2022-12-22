import './style.scss';

import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';

import DropMenu from '../../dropdown/dropmenu/DropMenu';

import { BsCheckAll } from 'react-icons/bs';
import { IoIosArrowDown } from 'react-icons/io';
import { useData } from '../../../contexts/MessageContext';

export default function ImageCard({ el, id, chatId }) { 
    const lastMessageRef = useRef()
    const { currentUser } = useAuth()
    const { setImageSlider, setImage } = useData()
    const [dropdown, setDropdown] = useState(false);
    const dropdownId = 'dd' + id;

    useEffect(() => {
        lastMessageRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [])

    return (
        <div id={el.id} className="image-card"  key={id}
        style={el.autor === currentUser.email 
            ? {alignSelf: 'flex-end', borderRadius: '10px 0 10px 10px'} 
            : {alignSelf: 'flex-start', borderRadius: '0 10px 10px 10px'}}
        ref={lastMessageRef}
        >
            <button className='image-card-content' onClick={() => {setImageSlider(true); setImage(el.fileUrl)}}>
                <img src={el.fileUrl ?? el.fileUrl}></img>
                <label style={el.autor === currentUser.email ? {right: '-12px'} : {left: '-12px', transform: 'scale(-1, 1)'}}/>
            </button>
            <div className='time'>
                <span id='image-card-time' >{el.time}</span>
                {
                    el.autor === currentUser.email 
                    ? <BsCheckAll style={el.read ? {color: "#53bdeb"} : {color: "white", opacity: "0.6"}}/> 
                    : <></>
                }
            </div>
            <>
                <button className='image-card-dropbutton' onClick={() => setDropdown(dropdownId)} 
                    style={ dropdown ? {display: "flex", opacity: '1'} : {}}
                >
                <IoIosArrowDown className='downArrow'/>
                </button>
                <DropMenu 
                    el={el} chatId={chatId}
                    classname={'image-card-dropdown'} toggler={dropdown}
                    order={() => setDropdown()} id={dropdownId}
                    owner={el.autor === currentUser.email}
                />
            </>
            
        </div>
    )
}
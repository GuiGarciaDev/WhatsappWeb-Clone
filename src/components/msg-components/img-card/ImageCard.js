import './style.scss';

import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';

import DropMenu from '../../dropmenu/DropMenu';
import Modal from 'react-modal';
import { customStyles } from "../../../modalSettings";
import { clearMessage, deleteMessage } from '../../../API';

import { BsCheckAll } from 'react-icons/bs';
import { IoIosArrowDown } from 'react-icons/io';

export default function ImageCard({ el, id, chatId }) { 
    const lastMessageRef = useRef()
    const { currentUser } = useAuth()
    const [modalDelete, setModalDelete] = useState(false); // Modal for delete specific message
    const [dropdown, setDropdown] = useState(false);
    const dropdownId = 'dd' + id;

    useEffect(() => {
        lastMessageRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [])

    return (
        <>
            <div id={el.id} className="image-card" 
            style={el.autor === currentUser.email 
                ? {alignSelf: 'flex-end', borderRadius: '10px 0 10px 10px'} 
                : {alignSelf: 'flex-start', borderRadius: '0 10px 10px 10px'}}
            ref={lastMessageRef}
            >
                <div className='image-card-content'>
                    <img src={el.image ?? el.image}></img>
                    <label style={el.autor === currentUser.email ? {right: '-12px'} : {left: '-12px', transform: 'scale(-1, 1)'}}/>
                </div>
                <div className='time'>
                    <span id='image-card-time' >{el.time}</span>
                    {
                        el.autor === currentUser.email 
                        ? <BsCheckAll style={el.isRead ? {color: "#53bdeb"} : {color: "white", opacity: "0.6"}}/> 
                        : <></>
                    }
                </div>
                <>
                    <button className='image-card-dropbutton' onClick={() => setDropdown(dropdownId)} 
                        style={ dropdown ? {display: "flex", opacity: '1'} : {}}
                    >
                    <IoIosArrowDown className='downArrow'/>
                    </button>
                    <DropMenu classname={'image-card-dropdown'} toggler={dropdown}
                        order={() => setDropdown()} id={dropdownId}
                        isMy={el.autor === currentUser.email}
                    >
                        <button>Responder</button>
                        <button>Reagir à mensagem</button>
                        <button>Encaminhar mensagem</button>
                        <button>Favoritar mensagem</button>
                        <button>Denunciar</button>
                        <button 
                            onClick={() => {
                                if (el.autor === currentUser.email) {
                                setModalDelete(true)
                                } else {clearMessage(el.id, chatId, currentUser.email); setModalDelete(false)}
                            }}
                        >
                            Apagar mensagem
                        </button>
                    </DropMenu>
                </>
                
            </div>

            <Modal
                isOpen={modalDelete}
                onRequestClose={() => setModalDelete(false)}
                style={customStyles}
                contentLabel="Example Modal"
                shouldCloseOnOverlayClick={false}
                id="deleteModal"
                appElement={document.getElementById('root')}
            >
                <div className="deleteModal-content">
                    <span>Deseja apagar a mensagem?</span>
                    <div className="button-holder">
                        <button onClick={() => {deleteMessage(el.id, chatId); setModalDelete(false)}}>APAGAR PARA TODOS</button>
                        <button onClick={() => {clearMessage(el.id, chatId, currentUser.email); setModalDelete(false)}}>APAGAR PARA MIM</button>
                        <button onClick={() => setModalDelete(false)}>CANCELAR</button>
                    </div>
                </div>
            </Modal>
        </>
    )
}
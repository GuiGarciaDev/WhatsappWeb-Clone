import './style.scss'
import Modal from 'react-modal';
import SearchBar from '../../searchbar/SearchBar';
import { MdClose, IoMdSend } from '../../../icons'; 
import CustomCheckBox from '../../custom-checkbox/CustomCheckBox';
import { useState } from 'react';
import { useData } from '../../../contexts/MessageContext';
import { sendContacts } from '../../../API';
import { sendContactModalStyle } from '../../../modalSettings'
import { useAuth } from '../../../contexts/AuthContext';

export default function SendContactModal({ openState, contacts }) {
    const { currentUser } = useAuth()
    const { contact, setSendContactModal } = useData()
    const [checkedState, setCheckedState] = useState([]);

    function close() {
        setSendContactModal(false)
        setCheckedState([])
    }

    function handleChange(e) {
        const { value, checked } = e.target

        if (checked) {
            setCheckedState(prev => [...prev, value])
        } else {
            setCheckedState(prev => {
                return [...prev.filter(skill => skill!==value)]
            })
        }
    }

    return (
        <Modal
            isOpen={openState}
            onRequestClose={setSendContactModal}
            style={sendContactModalStyle}
            contentLabel="Example Modal"
            shouldCloseOnOverlayClick={false}
            id="SendContactModal"
            appElement={document.getElementById('root')}
        >
            <div className='send-contact-modal'>
                <section className='header'>
                    <button onClick={() => close()}><MdClose/></button>
                    <h1>Enviar contatos</h1>
                </section>

                <section className='mid'>
                    <div className='searchbar-holder'>
                        <SearchBar placeholder={"Pesquisar..."}
                            arrowId="SendModal-arrow" searchId="SendModal-search"
                        />
                    </div>
                    <span className='contact'>CONTATOS</span>
                    <div className='contacts-map'>
                        { contacts.map((contact, idx) => {
                            return (
                                <label className='contact-card-modal' htmlFor={`checkbox_${idx}`} key={idx}>
                                    <CustomCheckBox id={`checkbox_${idx}`} value={contact.email} onChange={handleChange}/>
                                    <img src={contact.photoUrl}></img>
                                    <div className='text-holder'>
                                        <p>{contact.name}</p>
                                        <span>{contact.status}</span>
                                    </div>
                                </label>
                            )
                        })}
                    </div>
                </section>

                <section className='bottom' style={checkedState.length > 0 ? {height: '80px'} : {height: 0}}>
                    <div className='contact-name-map'>
                        { checkedState.map((id) => {
                            return (
                                <p>{`${id},`}</p>
                            )
                        })
                        }
                    </div>
                    { checkedState.length > 0 
                        ? <button className='send-button' onClick={() => {
                            sendContacts(currentUser.email, contact, checkedState)
                            close()
                          }}>
                            <IoMdSend />
                        </button>
                        : <></>
                    }
                </section>
            </div>
        </Modal>
    )      
}
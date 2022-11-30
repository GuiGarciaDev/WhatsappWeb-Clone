import { useRef, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import Modal from 'react-modal';
import { customStyles } from "../../modalSettings";
import { clearMessage, deleteMessage, getMessageForReply } from '../../API';
import { useState } from "react";
import { useData } from "../../contexts/MessageContext";

export default function DropMenu({ el, chatId, classname, toggler, order, id, owner}) {
    const [modalDelete, setModalDelete] = useState(false); // Modal for delete specific message
    const wrapperRef = useRef(null);
    const { currentUser } = useAuth()
    const { setRepMessage } = useData()

    async function setRepState() {
        const repMessage = await getMessageForReply(el.id, chatId)
        setRepMessage([true, repMessage])
    }

    useEffect(() => {
        /**
         * Alert if clicked on outside of element
         */
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                if (event.path[0].tagName !== 'BUTTON' && event.path[0].tagName !== 'IMG') {
                    order(null); // Make it close when clicked in the svg of cardMessage
                }
            }
        }
        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef, order]);

    let styles = {}

    if (toggler === id) {
        if (!owner) {
            styles = {display: 'flex', left: '60px'}
        } else {
            styles = {display: 'flex', right: '20px'}
        }
    } else {
        styles = {display: 'none'}
    }
      
    return (
        <>
            <div className={classname} ref={wrapperRef} id={id} style={styles}>
                <button onClick={() => setRepState()}>Responder</button>
                <button>Reagir à mensagem</button>
                <button>Encaminhar mensagem</button>
                <button>Favoritar mensagem</button>
                <button>Denunciar</button>
                <button 
                    onClick={() => {
                        if (owner) {
                        setModalDelete(true)
                        } else {clearMessage(el.id, chatId, currentUser.email); setModalDelete(false)}
                    }}
                >
                    Apagar mensagem
                </button>
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
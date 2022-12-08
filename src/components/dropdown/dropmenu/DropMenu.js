import './style.scss'
import { useRef, useEffect } from "react";
import Modal from 'react-modal';
import { customStyles } from "../../../modalSettings";
import { clearMessage, deleteMessage, getMessageForReply } from '../../../API';
import { useState } from "react";

import { useAuth } from "../../../contexts/AuthContext";
import { useData } from "../../../contexts/MessageContext";
import { AnimatePresence, motion } from "framer-motion";

export default function DropMenu(props) {
    const [modalDelete, setModalDelete] = useState(false); // Modal for delete specific message
    const wrapperRef = useRef(null);
    const { currentUser } = useAuth()
    const { setRepMessage } = useData()

    async function setRepState() {
        const repMessage = await getMessageForReply(props.el.id, props.chatId)
        setRepMessage([true, repMessage])
    }

    useEffect(() => {
        /**
         * Alert if clicked on outside of element
         */
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                if (event.path[0].tagName !== 'BUTTON' && event.path[0].tagName !== 'IMG') {
                    props.order(null); // Make it close when clicked in the svg of cardMessage
                }
            }
        }
        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef, props.order]);

    let styles = {}

    if (props.toggler === props.id) {
        if (!props.owner) {
            styles = {display: 'flex', right: '-160px', transformOrigin: 'top left'}
        } else {
            styles = {display: 'flex', right: '20px', transformOrigin: 'top right'}
        }
    } else {
        styles = {display: 'none'}
    }
      
    return (
        <AnimatePresence key={'1'}>
            { props.toggler && (
                <motion.div className={'dropMenu'} ref={wrapperRef} id={props.id} style={styles} key={'2'}
                    initial={{scale: 0.3, opacity: 0}}
                    animate={{scale: 1, opacity: 1}}
                    exit={{scale: 0.3, opacity: 0}}
                >
                    <button onClick={() => setRepState()}>Responder</button>
                    <button>Reagir à mensagem</button>
                    <button>Encaminhar mensagem</button>
                    <button>Favoritar mensagem</button>
                    <button>Denunciar</button>
                    <button 
                        onClick={() => {
                            if (props.owner) {
                            setModalDelete(true)
                            } else {clearMessage(props.el.id, props.chatId, currentUser.email); setModalDelete(false)}
                        }}
                    >
                        Apagar mensagem
                    </button>
                </motion.div>
            )}

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
                        <button onClick={() => {deleteMessage(props.el.id, props.chatId); setModalDelete(false)}}>APAGAR PARA TODOS</button>
                        <button onClick={() => {clearMessage(props.el.id, props.chatId, currentUser.email); setModalDelete(false)}}>APAGAR PARA MIM</button>
                        <button onClick={() => setModalDelete(false)}>CANCELAR</button>
                    </div>
                </div>
            </Modal>
        </AnimatePresence>
    )
}
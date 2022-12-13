import './style.scss'
import { AnimatePresence, motion } from "framer-motion";
import { useRef, useEffect } from "react";
import { useData } from '../../../contexts/MessageContext';
import { toastEmiterError } from '../../../toastifyemiter';

const itemVariants = {
    closed: { opacity: 0, x: 40, },
    open: {
        opacity: 1,
        x: 0,
    }
}

const mainVariants = {
    closed: { opacity: 0, scale: 0.3 },
    open: {
        opacity: 1,
        scale: 1,
        transition: {
            when: 'beforeChildren',
            staggerChildren: 0.1,
        }
    }
}

export default function RightDropDown(props) {
    const wrapperRef = useRef(null);
    const { setMessagePage, setContact, setChatId, setCardActived } = useData()

    function closeConversation() { // Fechar conversa
        setContact(null)
        setMessagePage(false)
        setChatId('')
        setCardActived(null)
    }

    function deleteConversation() { // Deleter Conversa
        props.setModalDeleteConversation(true)
    }

    function denunce() { // Denunciar
        props.setModalDenunce(true)
    }

    function block() { // Bloquear
        props.setModalBlock(true)
    }

    useEffect(() => {
        /**
         * Alert if clicked on outside of element
         */
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                if (event.path[0].tagName !== 'BUTTON' && event.path[0].tagName !== 'IMG') {
                    //console.log(event.path);
                    props.setDropdown(null); // Make it close when clicked in the svg of cardMessage
                }
            }
        }
        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef, props.setDropdown]);
    
    return (
        <AnimatePresence>
            { props.toggler && (
                <motion.div className={'rightDropDown'} ref={wrapperRef} id={props.id}
                    initial={'closed'}
                    animate={'open'}
                    variants={mainVariants}
                    exit={{scale: 0.3, opacity: 0}}
                >
                    <motion.button variants={itemVariants} onClick={() => props.setRightMenu('friendMenu')}>Dados do contato</motion.button>
                    <motion.button variants={itemVariants} onClick={() => toastEmiterError('Undefined')}>Selecionar mensagens</motion.button>
                    <motion.button variants={itemVariants} onClick={closeConversation}>Fechar Conversa</motion.button>
                    <motion.button variants={itemVariants} onClick={() => toastEmiterError('Undefined')}>Silenciar notificações</motion.button>
                    <motion.button variants={itemVariants} onClick={() => toastEmiterError('Undefined')}>Mensagens temporárias</motion.button>
                    <motion.button variants={itemVariants} onClick={() => toastEmiterError('Undefined')}>Limpar mensagens</motion.button>
                    <motion.button variants={itemVariants} onClick={deleteConversation}>Apagar conversa</motion.button>
                    <motion.button variants={itemVariants} onClick={denunce}>Denunciar</motion.button>
                    <motion.button variants={itemVariants} onClick={block}>Bloquear</motion.button>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
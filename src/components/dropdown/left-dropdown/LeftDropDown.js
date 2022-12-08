import './style.scss'
import { AnimatePresence, motion } from "framer-motion";
import { useRef, useEffect } from "react";

export default function LeftDropDown(props) {
    const wrapperRef = useRef(null);

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
                <motion.div className={'leftDropDown'} ref={wrapperRef} id={props.id}
                    initial={{scale: 0.3, opacity: 0}}
                    animate={{scale: 1, opacity: 1}}
                    exit={{scale: 0.3, opacity: 0}}
                >
                    <button onClick={() => {props.setLeftMenu('joinGroup'); props.setDropdown(false)}}>
                        Novo grupo
                    </button>
                    <button onClick={() => {props.setLeftMenu('favoriteMessageMenu'); props.setDropdown(false)}}>
                        Mensagens favoritas
                    </button>
                    <button onClick={() => {props.setLeftMenu('config'); props.setDropdown(false)}}>
                        Configurações
                    </button>
                    <button onClick={() => {props.handleLogout(); props.setDropdown(false)}}>
                        Desconectar
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
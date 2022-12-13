import './style.scss'
import { AnimatePresence, motion } from "framer-motion";
import { useRef, useEffect } from "react";

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
                    initial={'closed'}
                    animate={'open'}
                    variants={mainVariants}
                    exit={{scale: 0.3, opacity: 0}}
                >
                    <motion.button variants={itemVariants} onClick={() => {props.setLeftMenu('joinGroup'); props.setDropdown(false)}}>
                        Novo grupo
                    </motion.button>
                    <motion.button variants={itemVariants} onClick={() => {props.setLeftMenu('favoriteMessageMenu'); props.setDropdown(false)}}>
                        Mensagens favoritas
                    </motion.button>
                    <motion.button variants={itemVariants} onClick={() => {props.setLeftMenu('config'); props.setDropdown(false)}}>
                        Configurações
                    </motion.button>
                    <motion.button variants={itemVariants} onClick={() => {props.handleLogout(); props.setDropdown(false)}}>
                        Desconectar
                    </motion.button>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
import "./style.scss";
import { HiArrowLeft } from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion'

export default function LeftSideMenu({ children, toggler, closeFunction, title, id }) { 
    return (
        <AnimatePresence>
            { toggler === id && (
                <motion.div className="sidebarLeft"
                 initial={{translateX: -500}}
                 animate={{translateX: 0}}
                 exit={{translateX: -500}}
                 transition={{duration: .2}}
                >
                    <div className="up">
                        <button id='animated' onClick={() => closeFunction(false)}>
                            <HiArrowLeft/>
                        </button>
                        <span>{title}</span>
                    </div>
                    <motion.div className="sidebarLeft-Content"
                        animate={{opacity: [0, 1], y: [-30, 0]}}
                        transition={{duration: .7}}
                    >
                        {children}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
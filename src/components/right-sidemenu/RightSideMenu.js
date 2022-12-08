import "./style.scss";
import { AiOutlineClose } from 'react-icons/ai';
import { AnimatePresence, motion } from "framer-motion";

export default function RightSideMenu({ children, toggler, closeFunction, title, id }) { 
    return (
        <AnimatePresence>
            { toggler === id && (
                <motion.div className="sidebarRight"
                    initial={{translateX: 500}}
                    animate={{translateX: 0}}
                    exit={{translateX: 500}}
                    transition={{duration: .3}}
                >
                    <section id="header"> 
                        <button onClick={() => closeFunction(false)}>
                            <AiOutlineClose/>
                        </button>
                        <span>{title}</span>
                    </section>
                    <motion.div className="sidebarRight-Content"
                        animate={{opacity: [0, 1], y: [-30, 0]}}
                        transition={{duration: .7, delay: .1}}
                    >
                        
                        {children}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
        
    )
}
import { AnimatePresence, motion } from 'framer-motion'
import React, { useEffect, useRef, useState } from 'react'

export default function AnimatedText({ text }) {
    const [innerText, setInnerText] = useState('');
    const [mounted, setMounted] = useState(true);

    useEffect(() => {
        console.log('component changed'); //TODO: Need to make the transition animation when text value changes
    }, [text])

    return (
        <AnimatePresence> 
            { mounted && (
                <motion.span
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    exit={{opacity: 0}}
                >
                    {text}
                </motion.span>
            )}
            
        </AnimatePresence>
    )
}
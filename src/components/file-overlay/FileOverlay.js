import { AnimatePresence, motion } from 'framer-motion';
import './style.scss';

export default function FileOverlay({ color, title }) {
    return (
        <div className='file-overlay-holder'>
            <div className='file-overlay' style={{backgroundColor: color}}>
                {title}
            </div>
        </div>
    )
}
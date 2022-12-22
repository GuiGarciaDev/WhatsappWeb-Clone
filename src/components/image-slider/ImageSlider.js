import { AnimatePresence, motion } from 'framer-motion'
import { MdClose } from 'react-icons/md'
import { useData } from '../../contexts/MessageContext'
import './style.scss'

export default function ImageSlider() {
    const { imageSlider, setImageSlider, image, contact } = useData()

    return (
        <AnimatePresence>
            { imageSlider && (
                <motion.div className="image_slider"
                    initial={{ opacity: 0}}
                    animate={{opacity: 1}}
                    exit={{opacity: 0}}
                    transition={{duration: .1}}
                >
                    <section className='image_slider-header'>
                        <div className='image_slider-header_contact'>
                            <img src={contact.photoUrl} alt=''></img>
                            <p>{contact.name}</p>
                        </div>

                        <button onClick={() => setImageSlider(false)}><MdClose /></button> 
                    </section>
                    <section className='image_slider-content'>
                        <motion.img src={image} alt=''
                            initial={{scale: 0.3, opacity: 0}}
                            animate={{scale: 1, opacity: 1}}
                            exit={{scale: 0.3, opacity: 0}}
                            transition={{duration: .3}}
                        />
                    </section>
                </motion.div>
            )}
        </AnimatePresence> 
    )
}
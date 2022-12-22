import './style.scss'
import FileOverlay from '../file-overlay/FileOverlay';
import { BsFillImageFill, BsCameraFill, IoMdDocument, HiUser, RiStickyNoteFill } from '../../icons'
import { AnimatePresence, motion } from 'framer-motion'
import { toastEmiterError } from '../../toastifyemiter';
 
const itemVariants = {
    closed: { opacity: 0, y: 30, },
    open: {
        opacity: 1,
        y: 0,
    }
}

const dropUpVariants = {
    closed: { 
        opacity: 0,
        y: 80,
        transition: {
            when: 'afterChildren',
        } 
    },
    open: {
        opacity: 1,
        y: 0,
        transition: {
            //when: 'beforeChildren',
            staggerChildren: 0.07,
            staggerDirection: -1,
        }
    }
}

export default function DropUp(props) {  

    return (
        <AnimatePresence> 
            { props.state && (
                <motion.div className="fileDropup" 
                    initial="closed"
                    animate="open"
                    exit="closed"
                    variants={dropUpVariants}
                >
                    <motion.button 
                        style={{backgroundColor: '#0795dc'}} 
                        variants={itemVariants}
                        onClick={() => {props.setSendContactModal(true); props.setState(false)}}
                    >
                        <span style={{backgroundColor: '#0eabf4'}}></span>
                        <HiUser/>
                        <FileOverlay color={'white'} title={'Contato'}/>
                    </motion.button>

                    <motion.label htmlFor='i-files' style={{backgroundColor: '#5157ae'}} variants={itemVariants}> 
                        <input id="i-files" type='file' 
                            multiple='multiple'
                            onInput={(e) => {
                                props.setPreviewSec(true); 
                                props.setDocType('doc'); 
                                props.setDocuments(e.target.files);
                                props.setState(false)
                            }}
                        />
                        <span style={{backgroundColor: '#5f66cd'}}></span>
                        <IoMdDocument/>
                        <FileOverlay color={'white'} title={'Documento'}/>
                    </motion.label>

                    <motion.button style={{backgroundColor: '#d3396d'}} variants={itemVariants}
                        onClick={() => toastEmiterError('Undefined')}
                    >
                        <span style={{backgroundColor: '#ec407a'}}></span>
                        <BsCameraFill/>
                        <FileOverlay color={'white'} title={'Câmera'}/>
                    </motion.button>

                    <motion.button style={{backgroundColor: '#0063cb'}} variants={itemVariants}
                         onClick={() => toastEmiterError('Undefined')}
                    >
                        <span style={{backgroundColor: '#0070e6'}}></span>
                        <RiStickyNoteFill/>
                        <FileOverlay color={'white'} title={'Figurinhas'}/>
                    </motion.button>

                    <motion.label htmlFor='i-images' style={{backgroundColor: '#bf59cf'}} variants={itemVariants}>
                        <input id="i-images" type='file' 
                            accept="image/png, image/gif, image/jpeg"
                            multiple='multiple'
                            onInput={(e) => {
                                props.setPreviewSec(true); 
                                props.setDocType('img'); 
                                props.setDocuments(e.target.files);
                                props.setState(false)
                            }}
                        />
                        <span style={{backgroundColor: '#ac44cf'}}></span>
                        <BsFillImageFill/>
                        <FileOverlay color={'white'} title={'Fotos e Vídeos'}/>
                    </motion.label>
                </motion.div> 
            )}
        </AnimatePresence> 
    )
    
}
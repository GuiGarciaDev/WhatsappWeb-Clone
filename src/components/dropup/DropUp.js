import './style.scss'
import FileOverlay from '../file-overlay/FileOverlay';
import { BsFillImageFill, BsCameraFill, IoMdDocument, HiUser, RiStickyNoteFill } from '../../icons'
import { AnimatePresence, motion } from 'framer-motion'
 
const sideVariants = {
    closed: {
        y: 200,
        opacity: 0,
        transition: {
            staggerChildren: 0.1,
            staggerDirection: 1,
            duration: .3
        }
    },
    open: {
        y: 0,
        opacity: 1,
        transition: { 
            //staggerChildren: 0.1,
            staggerDirection: -1,
            duration: .3
        }
    }
};

export default function DropUp(props) {  
    return (
        <AnimatePresence> 
            { props.state && (
                <motion.div className="fileDropup" 
                    initial="closed"
                    animate="open"
                    exit="closed"
                    variants={sideVariants}
                >
                    <motion.button style={{backgroundColor: '#0795dc'}}
                        onClick={() => props.setSendContactModal(true)}
                    >
                        <span style={{backgroundColor: '#0eabf4'}}></span>
                        <HiUser/>
                        <FileOverlay color={'white'} title={'Contato'}/>
                    </motion.button>

                    <motion.label htmlFor='i-files' style={{backgroundColor: '#5157ae'}}>
                        <input id="i-files" type='file' 
                            multiple='multiple'
                            onInput={(e) => {
                                props.setPreviewSec(true); 
                                props.setDocType('doc'); 
                                props.setDocuments(e.target.files);
                            }}
                        />
                        <span style={{backgroundColor: '#5f66cd'}}></span>
                        <IoMdDocument/>
                        <FileOverlay color={'white'} title={'Documento'}/>
                    </motion.label>

                    <motion.button style={{backgroundColor: '#d3396d'}}>
                        <span style={{backgroundColor: '#ec407a'}}></span>
                        <BsCameraFill/>
                        <FileOverlay color={'white'} title={'Câmera'}/>
                    </motion.button>

                    <motion.button style={{backgroundColor: '#0063cb'}}>
                        <span style={{backgroundColor: '#0070e6'}}></span>
                        <RiStickyNoteFill/>
                        <FileOverlay color={'white'} title={'Figurinhas'}/>
                    </motion.button>

                    <motion.label htmlFor='i-images' style={{backgroundColor: '#bf59cf'}}>
                        <input id="i-images" type='file' 
                            accept="image/png, image/gif, image/jpeg"
                            multiple='multiple'
                            onInput={(e) => {
                                props.setPreviewSec(true); 
                                props.setDocType('img'); 
                                props.setDocuments(e.target.files);
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
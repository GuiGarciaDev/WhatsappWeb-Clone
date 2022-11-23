import { useRef } from 'react';
import { useEffect, useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { BiSticker, BiText } from 'react-icons/bi';
import { BsArrowReturnLeft, BsArrowReturnRight, BsEmojiSmile, BsPlusLg } from 'react-icons/bs'
import { FaChessBoard } from 'react-icons/fa';
import { MdCropRotate, MdModeEditOutline, MdSend } from 'react-icons/md';
import './style.scss'

export default function PrevImgSection({docs, state}) {
    const [documents, setDocuments] = useState([]);
    const [currentDoc, setCurrentDoc] = useState(null);
    const addInput = useRef()

    function getUrl(array) {
        let files = Object.values(array)
        let filesArray = []
        files.forEach(file => {
            let url = URL.createObjectURL(file)
            filesArray.push(url)
        })
        return filesArray
    }

    function removeUrl(url) {
        let array = documents
        let filteredArray = array.filter(item => item !== url)
        setDocuments(filteredArray)

        if (documents.length - 1 === 0) {
            state(false)
        }
    }

    useEffect(() => {
        setCurrentDoc(getUrl(docs)[0])
        setDocuments(getUrl(docs))
    }, [])

    return (
        <div className="img-preview-section">
            <section id='img-preview-content'>
                <button id='closeButton' onClick={() => state(false)}><AiOutlineClose/></button>
                <div className='icons-holder'>
                    <button><BsEmojiSmile/></button>
                    <button><BiSticker/></button>
                    <button><BiText/></button>
                    <button><FaChessBoard/></button>
                    <button><MdModeEditOutline/></button>
                    <button><MdCropRotate/></button>
                    <button><BsArrowReturnLeft/></button>
                    <button><BsArrowReturnRight/></button>
                </div>
                <img src={currentDoc} alt='kct'></img>
                <div className="messageBar-holder">
                    <input id="messageBar" 
                        placeholder="Digite uma mensagem..."
                        onChange={() => {}} autoComplete='off'
                    />
                </div>
            </section>
            <section id='more-images'>
                <div className='map-holder'>
                    {
                        documents.map((doc, idx) => {
                            return (
                                <button className='img-holder' onClick={() => setCurrentDoc(doc)}>
                                    <img src={doc}></img>
                                    <div id='closeButton-holder'>
                                        <button onClick={() => removeUrl(doc)}><AiOutlineClose/></button>
                                    </div>
                                </button>
                            )
                        })
                    }
                    
                </div>
                <label id='input-holder' htmlFor='new-img'>
                    <BsPlusLg />
                    <input id='new-img' type='file' 
                        accept="image/png, image/gif, image/jpeg" 
                        multiple='multiple'
                        ref={addInput}
                        onInput={(e) => {
                            getUrl(e.target.files).forEach(doc => {
                                setDocuments((prev) => [...prev, doc])
                            })
                        }}
                    />
                </label>

                <button id='submit-images'><MdSend/></button>
            </section>
        </div>
    )
}
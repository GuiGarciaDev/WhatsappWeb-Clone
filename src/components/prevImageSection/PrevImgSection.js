import { useRef } from 'react';
import { useEffect, useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { BiSticker, BiText } from 'react-icons/bi';
import { BsArrowReturnLeft, BsArrowReturnRight, BsEmojiSmile, BsPlusLg } from 'react-icons/bs'
import { FaChessBoard } from 'react-icons/fa';
import { MdCropRotate, MdModeEditOutline, MdSend } from 'react-icons/md';
import { sendFile } from '../../API';
import './style.scss'

export default function PrevImgSection({docs, state, userEmail, contact}) {
    const [currentDoc, setCurrentDoc] = useState(docs[0]);
    const [files, setFiles] = useState(Array.from(docs));

    function getUrl(file) {
        let url = URL.createObjectURL(file)

        return url
    }

    function removeUrl(file) {
        if (files.length === 1) {
            state(false)
        } else {
            let array = files
            let filteredArray = array.filter(item => item !== file)
            setFiles(filteredArray)
        }
    }

    function uploadImages(images) {
        console.log(images);
        images.forEach(image => {
            console.log(image);
            sendFile(image, userEmail, contact, 'img')
        })
        state(false)
    }

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
                <img src={getUrl(currentDoc)} alt='kct'></img>
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
                        files.map((file) => {
                            return (
                                <div className='map-item'>
                                    <button className='img-holder' onClick={() => {setCurrentDoc(file)}}>
                                        <img src={getUrl(file)}></img>
                                    </button>
                                    <div id='closeButton-holder'>
                                        <button onClick={() => removeUrl(file)}>
                                            <AiOutlineClose/>
                                        </button>
                                    </div>
                                </div> 
                            )
                        })
                    }
                    
                </div>
                <label id='input-holder' htmlFor='new-img'>
                    <BsPlusLg />
                    <input id='new-img' type='file' 
                        accept="image/png, image/gif, image/jpeg" 
                        multiple='multiple'
                        onInput={(e) => {
                            Array.from(e.target.files).forEach(doc => {
                                setFiles(prev => [...prev, doc])
                            })
                        }}
                    />
                </label>

                <button id='submit-images' onClick={() => uploadImages(files)}><MdSend/></button>
            </section>
        </div>
    )
}
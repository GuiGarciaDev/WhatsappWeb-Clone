import { useRef } from 'react';
import { useEffect, useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { BsPlusLg } from 'react-icons/bs'
import { HiDocument } from 'react-icons/hi'
import { MdSend } from 'react-icons/md';
import Pdf from '../pdf-component/Pdf';
import './style.scss'

export default function PrevDocSection({docs, state}) {
    const [documents, setDocuments] = useState(getUrl(docs));
    const [currentDoc, setCurrentDoc] = useState(getUrl(docs)[0]);
    const [files, setFiles] = useState(docs);
    const [fileIdx, setFileIdx] = useState(0);
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

    function removeUrl(url, file) {
        try {
            if (documents.length === 1) {
                state(false)
            } else {
                let array = documents
                let filteredArray = array.filter(item => item !== url)
                setDocuments(filteredArray)
        
                let arrayFiles = files
                let filteredArrayFiles = arrayFiles.filter(item => item !== file)
                setFiles(filteredArrayFiles)
            }
        } catch {}
    }

    console.log(files);

    return (
        <div className="docs-preview-section">
            <section id='docs-preview-content'>
                <button id='closeButton' onClick={() => state(false)}><AiOutlineClose/></button>
                {
                    files[fileIdx].type === 'application/pdf' 
                    ? <Pdf docUrl={currentDoc} files={files} idx={fileIdx}/>
                    : <div id='other-file-type'>
                        <p>{files[fileIdx].name}</p>
                        <HiDocument />
                        <span className='text'>Pré-visualização indisponível</span>
                        <span className='sizeType'>
                            {`${(files[fileIdx].size / (Math.pow(2, 20))).toPrecision(3)} MB - ${files[fileIdx].type}`}
                        </span>
                    </div>
                }
                <div className="messageBar-holder">
                    <input id="messageBar" 
                        placeholder="Digite uma mensagem..."
                        onChange={() => {}} autoComplete='off'
                    />
                </div>
            </section>
            <section id='more-docs'>
                <div className='map-holder'>
                    {
                        documents.map((doc, idx) => {
                            return (
                                <div className='map-item'>
                                    <button className='doc-holder' onClick={() => {setCurrentDoc(doc); setFileIdx(idx)}}>
                                        <p>{`Documento ${idx + 1}`}</p>
                                    </button>
                                    <div id='closeButton-holder'>
                                        <button onClick={() => {
                                            setCurrentDoc(documents[0])
                                            setFileIdx(0)
                                            removeUrl(doc, files[idx])
                                        }}>
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
                        multiple='multiple'
                        ref={addInput}
                        onInput={(e) => {
                            getUrl(e.target.files).forEach(doc => {
                                setDocuments((prev) => [...prev, doc])
                            });
                            for (let i = 0; i < e.target.files.length; i++) {
                                setFiles((prev) => [...prev, e.target.files[i]]) 
                            }
                        }}
                    />
                </label>

                <button id='submit-docs'><MdSend/></button>
            </section>
        </div>
    )
}
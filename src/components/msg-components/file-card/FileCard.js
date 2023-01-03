import './style.scss';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';

import DropMenu from '../../dropdown/dropmenu/DropMenu';

import { BsCheckAll } from 'react-icons/bs';
import { HiDocument } from 'react-icons/hi'
import { IoIosArrowDown } from 'react-icons/io';
import { MdDownload } from 'react-icons/md';
import { toastEmiterError } from '../../../utils/toastifyemiter';
//import Pdf from '../../pdf-component/Pdf';

export default function FileCard({ el, id, chatId, type }) { 
    const lastMessageRef = useRef()
    const { currentUser } = useAuth()
    const [dropdown, setDropdown] = useState(false);
    const dropdownId = 'dd' + id;

    useEffect(() => {
        lastMessageRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [])

    function downloadFile() {
        toastEmiterError('Not fineshed yet')
    }

    return (
        <div id={el.id} className="document-card" key={id}
            style={el.autor === currentUser.email 
                ? {alignSelf: 'flex-end', borderRadius: '10px 0 10px 10px'} 
                : {alignSelf: 'flex-start', borderRadius: '0 10px 10px 10px'}}
            ref={lastMessageRef}
        >
            {/* {type === 'pdf'         **** PDF PREVIEW NOT WORKING YET ****
                ? <div className='pdf-preview-holder'>
                    <Pdf docUrl={getBlob(x)} preview={true}/>
                </div>
                : <></>
            } */}
            <div className='document-card-content' style={type === 'pdf' ? {borderRadius: '0 0 8px 8px'} : {borderRadius: '8px'}}>
                <HiDocument/>
                <div className='doc-text'>
                    <span className='title'>{el.fileName}</span>
                    <span>{el.fileSizeType}</span>
                </div>
                <button onClick={() => {downloadFile(el.fileUrl)}}>
                    <MdDownload/>
                </button>
                <label style={el.autor === currentUser.email ? {right: '-12px'} : {left: '-12px', transform: 'scale(-1, 1)'}}/>
            </div>
            <div className='time'>
                <span id='document-card-time' >{el.time}</span>
                {
                    el.autor === currentUser.email 
                    ? <BsCheckAll style={el.read ? {color: "#53bdeb"} : {color: 'var(--icon-fixed)'}}/> 
                    : <></>
                }
            </div>
            <>
                <button className='document-card-dropbutton' onClick={() => setDropdown(dropdownId)} 
                    style={ dropdown ? {display: "flex", opacity: '1'} : {}}
                >
                <IoIosArrowDown className='downArrow'/>
                </button>
                <DropMenu 
                    el={el} chatId={chatId}
                    classname={'document-card-dropdown'} toggler={dropdown}
                    order={() => setDropdown()} id={dropdownId}
                    owner={el.autor === currentUser.email}
                />
            </>
            
        </div>
    )
}
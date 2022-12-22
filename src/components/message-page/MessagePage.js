import "../message-page/style.scss";
import { firedb as db } from "../../firebase";
import React, { useEffect, useRef, useState } from "react";
import { denunceTextModal } from "../../modalSettings";
import { collection, doc, onSnapshot, orderBy, query, updateDoc, where, getDocs } from "firebase/firestore";
import { uploadMessage, uploadRepMessage } from "../../API";
import { useData } from "../../contexts/MessageContext";
import { useAuth } from "../../contexts/AuthContext";

import DropUp from "../dropup/DropUp";
import SearchBar from "../searchbar/SearchBar";
import ProfileButton from "../profile-button/ProfileButton";
import MessageDate from "../message-date/MessageDate";
import RightSideMenu from "../right-sidemenu/RightSideMenu";
import TwoOptionsModal from "../modals/2opt-modal/TwoOptionsModal";
import EmojiPicker from "emoji-picker-react";
// import data from '@emoji-mart/data'
// import Picker from '@emoji-mart/react'
import MsgType from "../msg-components/MsgType";
import PrevDocSection from "../prevDocumentSection/PrevDocSection";
import PrevImgSection from "../prevImageSection/PrevImgSection";
import Replied from "../replied/Replied";

import {
    BiSticker, BsEmojiSmile, HiArrowLeft, RiCloseFill, FaArrowRight,
    FaMicrophone, AiOutlineGif, AiOutlinePaperClip, BsThreeDotsVertical, BsSearch
} from '../../icons'
import RightDropDown from "../dropdown/right-dropdown/RightDropDown";
import { toastEmiterError } from "../../toastifyemiter";

export default function MessagePage({ currentContact, chatId, closeFunction }) { 
    const [rightmenu, setRightMenu] = useState(null);
    const [emojiSec, setEmojiSec] = useState(false);
    const [previewSec, setPreviewSec] = useState(false)
    const [docType, setDocType] = useState('');
    const [documents, setDocuments] = useState(null)

    const [filedropup, setFileDropup] = useState(false);
    const [searchbarlength, setSearchBarLength] = useState(0); // Control the toggle of mic button and send button

    const [msgDropdown, setMsgDropdown] = useState(null);
    const toggleDropdown = (id) => id === msgDropdown ? setMsgDropdown(null) : setMsgDropdown(id);

    const [modalBlock, setModalBlock] = useState(false); // Modal for delete all messages
    const [modalDenunce, setModalDenunce] = useState(false); // Modal for delete all messages
    const [modalDeleteConversation, setModalDeleteConversation] = useState(false); // Modal for delete all messages

    const { currentUser } = useAuth()
    const { repMessage, setRepMessage, setSendContactModal, setImage, setImageSlider } = useData()
    const chatboxInput = useRef();

    const [messages, setMessages] = useState([])
    const [messageDate, setMessageDate] = useState([])

    useEffect(() => { // Get enter key event
        const keyDownHandler = event => {     
            if (event.key === 'Enter') {
              event.preventDefault();
              document.getElementById('sendMessageButton').click()
            }
          };
      
          document.addEventListener('keydown', keyDownHandler);
      
          return () => {
            document.removeEventListener('keydown', keyDownHandler);
          };
    }, [])

    // const pickerHolder = useRef()  // Responsivity of component EmojiPicker 
    // const [pickerWidth, setPickerWidth] = useState(null);

    // useEffect(() => {
    //     function handlePickerResize() {
    //         setPickerWidth(pickerHolder.current.offsetWidth)
    //     }
   
    //     window.addEventListener('resize', handlePickerResize)
   
    //     return () => {
    //         window.removeEventListener('resize', handlePickerResize)
    //     }
    //  }, [])

    useEffect(() => {
        const userRef = doc(db, 'users', currentUser.email);
        const messagesRef = collection(db, "chat", chatId, 'messages')

        const allMessages = query(messagesRef, orderBy('date', 'asc'))

        onSnapshot(allMessages, (snapshot) => {
            let AllMessages = []
            snapshot.docs.map((message) => {
                if (message.data().clearedFor[currentUser.email] !== true) {
                    AllMessages.push(message.data())
                } 
            })
            setMessages(AllMessages);

            let MessageDate = []
            let prevDate = ''
            for (let i = 0; i < AllMessages.length; i++) {
                if (AllMessages[i].cardDate !== prevDate) {
                    MessageDate.push(AllMessages[i].cardDate)
                    prevDate = AllMessages[i].cardDate                
                } else {}
            }
            setMessageDate(MessageDate)
        })
    }, [currentContact])

    // Default image for all users
    //const user_image = currentContact.photoUrl ? currentContact.photoUrl : "noImage.png";
    const user_image = "noImage.png";
    async function sendMessage() { // Send message to your friend
        const searchbar = document.getElementById("bottom-messageBar")

        if (searchbar.value.length > 0) {
            if (repMessage[0]) {
                uploadRepMessage(currentUser.email, currentContact, searchbar.value, repMessage[1].id)
                setRepMessage(prev => [false, prev[1]])
            } else {
                uploadMessage(currentUser.email, currentContact, searchbar.value)
            }

            searchbar.value = "";
            setSearchBarLength(0);
        }
    }

    function changeDocType(type, docs, sectionState) {
        switch (type) {
            case 'doc':
                return <PrevDocSection docs={docs} state={sectionState} userEmail={currentUser.email} contact={currentContact}/>
            case 'img':
                return <PrevImgSection docs={docs} state={sectionState} userEmail={currentUser.email} contact={currentContact}/>
            default:
                break;
        }
    }

    return(
        <div className="message-page">
            <div className="message-content-holder">
                <section id="header">
                    <button className="header-button" onClick={() => setRightMenu('friendMenu')}>
                        <div className="block-start">
                            { window.innerWidth < 630 && <HiArrowLeft onClick={() => closeFunction(false)}/>}
                            <img src={user_image} alt=""></img>
                            <div className="text-holder">
                                <h1>{currentContact.name}</h1>
                                <span>
                                    {currentContact.online ? "online" : "visto por último online às " + currentContact.last_connection}
                                </span>
                            </div>
                        </div>
                    </button>

                    <div className="block-end">
                        <button onClick={() => setRightMenu('searchMessage')}>
                            <BsSearch/>
                        </button>
                        <div className='rightDropdown-holder'>
                            <button id='rightDropdown-button' onClick={() => toggleDropdown('rightDropdown')}
                                style={msgDropdown === 'rightDropdown' ? {backgroundColor: "hsla(0,0%,100%,0.1)"} : {backgroundColor: "transparent"}}
                            >
                                <BsThreeDotsVertical />
                            </button>
                            <RightDropDown
                                id={'rightDropdown'} 
                                toggler={msgDropdown} 
                                order={() => setMsgDropdown()}
                                setRightMenu={setRightMenu} 
                                setModalBlock={setModalBlock}
                                setModalDenunce={setModalDenunce}
                                setModalDeleteConversation={setModalDeleteConversation}
                            />
                        </div>
                    </div>
                </section>

                { previewSec 
                    ? changeDocType(docType, documents, setPreviewSec)
                    : <>
                        <section id="chatbox">
                            {messageDate.map((date) => {
                                    return (
                                        <>
                                            <MessageDate date={date}/>
                                            { messages.map((message, idx) => {
                                                    if (message.cardDate === date) {
                                                        return (
                                                            <MsgType el={message} id={idx} chatId={chatId} key={message.id}/>
                                                        )
                                                    }
                                                })
                                            }
                                        </>
                                    )
                                })
                            }
                        </section>
                        
                        <section className="bottom">
                            <EmojiPicker // Default emoji picker, responsible but the have high delay on picking emoji
                                width={'100%'} height={emojiSec? '300px' : '0px'} 
                                theme={'dark'} 
                                previewConfig={{showPreview: false}}
                                onEmojiClick={(emoji) =>  {chatboxInput.current.value += emoji.emoji}}
                            />
                            {/* <div id="emoji-picker-holder" style={emojiSec ? {height: '300px'} : {height: '0px'}} ref={pickerHolder}>
                                <Picker 
                                    data={data} 
                                    onEmojiSelect={(emoji) => chatboxInput.current.value += emoji.native} 
                                    previewPosition={'none'}
                                    styles
                                    perLine={Math.ceil(pickerWidth / 38) ? Math.ceil(pickerWidth / 38) : 22}
                                />
                            </div> */}
                            <Replied/>
                            <div className="bottom-content">
                                <div className="bottom-start">
                                    <button onClick={() => setEmojiSec(prev => !prev)}>
                                        { emojiSec ? <RiCloseFill /> : <BsEmojiSmile id="emoji"/> }
                                    </button>
                                    <div className="other-icons" style={emojiSec ? {width: '147px'} : {width: '0px'}}>
                                        <div className="translate-content" 
                                        style={emojiSec ? {transform: 'translateX(0px)'} : {transform: 'translateX(-250px)'}}
                                        >
                                            <button>
                                                {<BsEmojiSmile id="emojiActived"/>}
                                            </button>
                                            <button>
                                                {<AiOutlineGif/>}
                                            </button>
                                            <button>
                                                {<BiSticker/>}
                                            </button>
                                        </div>                               
                                    </div>
                                
                                    <div className="fileDropup-holder">
                                        <button onClick={() => setFileDropup(prev => !prev)}
                                            style={filedropup ? {backgroundColor: "hsla(0,0%,100%,0.1)"} : {backgroundColor: "transparent"}}
                                        >
                                            <AiOutlinePaperClip id="upFile"/>
                                        </button>
                                        <DropUp state={filedropup}
                                            setState={setFileDropup} 
                                            setPreviewSec={setPreviewSec} 
                                            setDocType={setDocType}
                                            setDocuments={setDocuments}
                                            setSendContactModal={setSendContactModal}
                                        />
                                    </div>
                                </div>

                                <div className="bottom-messageBar-holder">
                                    <input id="bottom-messageBar" placeholder="Digite uma mensagem..."
                                    onChange={() => setSearchBarLength(chatboxInput.current.value.length)} 
                                    autoComplete='off' ref={chatboxInput}
                                    >  
                                    </input>
                                </div>

                                <div className="bottom-end">
                                    <button id='sendMessageButton' 
                                    style={{marginRight: '10px'}}
                                    onClick={() =>  sendMessage()}
                                    >
                                        { searchbarlength > 0 
                                            ? <FaArrowRight/>
                                            : <FaMicrophone/>
                                        }   
                                    </button>
                                </div>
                            </div>
                        </section>
                    </> }
            </div>

            <RightSideMenu id={'friendMenu'} title={'Dados do Contato'} toggler={rightmenu} closeFunction={() => setRightMenu()}>
                <section id="friend-Mid">
                    <div className="profile-image-name">
                        <button onClick={() => {setImageSlider(true); setImage(user_image)}}><img src={user_image} alt=""></img></button>
                        <h2>{currentContact.name}</h2>
                        <span>{currentContact.email}</span>
                    </div>
                    <div className="profile-message">
                        <span>Recado</span>
                        <span className="profile-text">{currentContact.status}</span>
                    </div>
                    <div className="profile-files">
                        <button className="file-frow">
                            <span>Arquivos de mídia, links e docs</span>
                            <div className="frow-end">
                                <span>0</span>
                                <img src="right-harrow.svg" alt=""></img>
                            </div>
                        </button>
                    </div>
                    <div className="profile-button-holder">
                        <ProfileButton icon={"star"} title="Mensagens Favoritas"
                            lasticon={true}
                            funct={() => toastEmiterError('undefined')}
                        />
                        <ProfileButton icon="bell" title="Silenciar Notificações"
                            funct={() => toastEmiterError('undefined')}
                            
                        />
                        <ProfileButton icon="tempmess" title="Mensagens Temporárias"
                            subtitle="Desativadas" lasticon={true}
                            funct={() => toastEmiterError('undefined')}
                        />
                        <ProfileButton icon="keylock" title="Criptografia"
                            subtitle="As mensagens são protegidas com a criptografia de ponta a ponta.
                            Clique para confirmar"
                            funct={() => toastEmiterError('undefined')}
                        />
                        <ProfileButton icon="denied" title={"Bloquear " + currentContact.name} red={true} name={'red'}
                            funct={() => setModalBlock(true)}
                        />
                        <ProfileButton icon="dislike" title={"Denunciar " + currentContact.name} red={true} name={"red"}
                            funct={() => setModalDenunce(true)}
                        />
                        <ProfileButton icon="trash" title={"Apagar Conversa"} red={true} name={'red'}
                            funct={() => setModalDeleteConversation(true)}
                        />
                    </div>
                </section>
            </RightSideMenu>                  

            <RightSideMenu id={'searchMessage'} title={'Pesquisar Mensagens'} toggler={rightmenu} 
                closeFunction={() => setRightMenu()}
            >
                <section id="search-Mid">
                    <div className="search-searchbar-holder">
                        <SearchBar placeholder="Pesquisar..."
                            arrowId={"rightC-arrow"} searchId={"rightC-search"}
                        />
                    </div>
                    <span className="search-span">Pesquisar mensagens com {currentContact.name}</span>
                </section>
            </RightSideMenu>

            <TwoOptionsModal 
                title={'Deseja apagar esta conversa?'} 
                confirmButton={'APAGAR CONVERSA'} 
                cancelButton={'CANCELAR'}
                text={'As mensagens serão removidas somente deste aparelho e dos seus aparelhos que usam versões mais recentes do WhatsApp.'}
                state={modalDeleteConversation} 
                closeFunction={() => setModalDeleteConversation(false)} 
            />

            <TwoOptionsModal 
                title={`Deseja denunciar este contato ao WhatsApp?`} 
                confirmButton={'DENUNCIAR'} cancelButton={'CANCELAR'}
                state={modalDenunce} closeFunction={() => setModalDenunce(false)} 
                text={denunceTextModal} check={true}
            />

            <TwoOptionsModal 
                title={`Deseja bloquear ${currentContact.name}?`}
                confirmButton={'BLOQUEAR'} cancelButton={'CANCELAR'}
                text={'Contatos bloqueados não poderão mais fazer chamadas nem enviar mensagens para você.'}
                state={modalBlock} closeFunction={() => setModalBlock(false)} 
            />
        </div>
    )
}
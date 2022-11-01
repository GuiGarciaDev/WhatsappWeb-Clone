import "../message-page/style.scss";
import { firedb as db } from "../../firebase";
import React, { useEffect, useState } from "react";
import Modal from 'react-modal';
import { customStyles } from "../../modalSettings";
import { denunceTextModal } from "../../modalSettings";
import { addDoc, collection, doc, onSnapshot, orderBy, query, updateDoc, limit, getDoc } from "firebase/firestore";

import SearchBar from "../searchbar/SearchBar";
import ProfileButton from "../profile-button/ProfileButton";
import MessageDate from "../message-date/MessageDate";
import MessageCard from "../message-card/MessageCard";
import DropMenu from "../dropmenu/DropMenu";
import RightSideMenu from "../right-sidemenu/RightSideMenu";
import FileOverlay from "../file-overlay/FileOverlay";

import { BsFillImageFill, BsCameraFill } from 'react-icons/bs';
import { IoMdDocument, IoIosArrowDown } from 'react-icons/io';
import { HiUser, HiArrowLeft } from 'react-icons/hi';
import { RiStickyNoteFill } from 'react-icons/ri';
import { FaArrowRight, FaMicrophone } from 'react-icons/fa';
import TwoOptionsModal from "../2opt-modal/TwoOptionsModal";
import { useAuth } from "../../contexts/AuthContext";

export default function MessagePage({ id, chatId, closeFunction }) { 
    const [rightmenu, setRightMenu] = useState(null);

    const [filedropup, setFileDropup] = useState(false);
    const [searchbarlength, setSearchBarLength] = useState(0); // Control the toggle of mic button and send button

    const [dropdown, setDropdown] = useState(null);

    const toggleDropdown = (id) => id === dropdown ? setDropdown(null) : setDropdown(id);
    const toggleFileDropup = () => setFileDropup(!filedropup);

    const [modalDelete, setModalDelete] = useState(false); // Modal for delete specific message
    const [modalBlock, setModalBlock] = useState(false); // Modal for delete all messages
    const [modalDenunce, setModalDenunce] = useState(false); // Modal for delete all messages
    const [modalDeleteConversation, setModalDeleteConversation] = useState(false); // Modal for delete all messages

    const { currentUser } = useAuth()
  
    const [contact, setContact] = useState('')
    const [messages, setMessages] = useState([])
    const [messageDate, setMessageDate] = useState([])

    useEffect(() => {
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

    useEffect(() => {
        const userRef = doc(db, 'users', currentUser.email);
        const contactRef = doc(db, "users", id)
        const messagesRef = collection(db, "chat", chatId, 'messages')

        async function updateLastMessageIn(doc, email, lastMessage) {
            const ref = await getDoc(doc)
            const data = ref.data()

            await updateDoc(doc, {
                "last_message": {
                    ...data.last_message,
                    [email]: [lastMessage[0].content, lastMessage[0].cardDate]
                }
            })
        }

        onSnapshot(contactRef, orderBy('time', 'desc'), (snapshot) => {
          setContact(snapshot.data());
        })

        const allMessages = query(messagesRef, orderBy('date', 'asc'))

        onSnapshot(allMessages, (snapshot) => { // To implement delete message just for current user try to use where(cleared = true) in query
            setMessages(snapshot.docs.map((message) => (message.data())));

            let AllMessages = snapshot.docs.map((message) => (message.data()))
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

        const lastMessage = query(messagesRef, orderBy('date', 'desc'), limit(1))

        onSnapshot(lastMessage, (snapshot) => {
            try {
                let lastMessage = snapshot.docs.map((lastmessage) => (lastmessage.data()))
                updateLastMessageIn(contactRef, currentUser.email, lastMessage)
                updateLastMessageIn(userRef, id, lastMessage)
            } catch (error) {console.log(error);}
        })
    }, [id])

    // Default image for all users
    const user_image = contact.photoUrl ? contact.photoUrl : "noImage.png";

    function sendMessage( chatId ) { // Send message to your friend
        const dateC = new Date();

        const seconds = ("0" + dateC.getSeconds()).slice(-2)
        const minutes = ("0" + dateC.getMinutes()).slice(-2) + ":"
        const hours = ("0" + dateC.getHours()).slice(-2) + ":"
        const day = ("0" + dateC.getDate()).slice(-2) + "/"
        const month = ("0" + (dateC.getMonth() + 1)).slice(-2) + "/"
        const year = dateC.getFullYear() + "/"

        const time = (hours + minutes).slice(0, -1)
        const date = (day + month + year).slice(0, -1)
        const long_date = year + month + day + hours + minutes + seconds

        const chatMessages = collection(db, "chat", chatId, 'messages')

        const searchbar = document.getElementById("bottom-messageBar")

        if (searchbar.value.length > 0) {
            addDoc(chatMessages, { // Message sent to chatId room
                "content": searchbar.value,
                "time": time,
                //"id": this.id, ADD UNIQUE ID for each message, because we have this for delete it
                "date": long_date,
                "cardDate": date,
                "read": true, // Default value for now
                "autor": currentUser.email,
                "for": id,
            })

            searchbar.value = "";
            setSearchBarLength(0);
        }
    }

    function inputControler() {
        let seachbar = document.getElementById("bottom-messageBar");
        let searchbarLength = seachbar.value.length;

        setSearchBarLength(searchbarLength);
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
                                <h1>{contact.name}</h1>
                                <span>
                                    {
                                        contact.online ? "online" : "visto por último online às " + contact.last_connection
                                    }
                                </span>
                            </div>
                        </div>
                    </button>

                    <div className="block-end">
                        <button onClick={() => setRightMenu('searchMessage')}>
                            <img id="srch"src="search-icon.svg" alt=""></img>
                        </button>
                        <div className='rightDropdown-holder'>
                            <button id='rightDropdown-button' onClick={() => toggleDropdown('rightDropdown')}
                                style={dropdown === 'rightDropdown' ? {backgroundColor: "hsla(0,0%,100%,0.1)"} : {backgroundColor: "transparent"}}
                            >
                                <img src="3dots.svg" alt='' id="icon3"></img>
                            </button>
                            <DropMenu id={'rightDropdown'} classname={'dropdown'} toggler={dropdown} order={() => setDropdown()}>
                                <button onClick={() => setRightMenu('friendMenu')}>Dados do contato</button>
                                <button>Selecionar mensagens</button>
                                <button>Silenciar notificações</button>
                                <button>Limpar mensagens</button>
                                <button>Sair do grupo</button>
                            </DropMenu>
                        </div>
                    </div>
                </section>

                <section id="chatbox">
                    {
                        messageDate.map((date) => {
                            return (
                                <>
                                    <MessageDate date={date}/>
                                    {
                                        messages.map((message, idx) => {
                                            const dropdownId = 'mdd'+idx;
                                            if (message.cardDate == date) {
                                                return (
                                                    <MessageCard id={idx} content={message.content} 
                                                        time={message.time} isRead={message.read} 
                                                        key={idx} isMy={message.autor === currentUser.email}
                                                    >
                                                        <button className='message-card-dropbutton' onClick={() => setDropdown(dropdownId)} 
                                                            style={ dropdown === dropdownId ? {display: "flex", opacity: '1'} : {}}
                                                        >
                                                        <IoIosArrowDown className='downArrow'/>
                                                        </button>
                                                        <DropMenu classname={'message-card-dropdown'} toggler={dropdown} 
                                                            order={() => setDropdown()} id={dropdownId}
                                                        >
                                                            <button>Responder</button>
                                                            <button>Reagir à mensagem</button>
                                                            <button>Encaminhar mensagem</button>
                                                            <button>Favoritar mensagem</button>
                                                            <button>Denunciar</button>
                                                            <button 
                                                                onClick={() => {setModalDelete(true); setDropdown(null)}}
                                                            >
                                                                Apagar mensagem
                                                            </button>
                                                        </DropMenu>
                                                    </MessageCard>
                                                )
                                            }
                                        })
                                    }
                                
                                </>
                            )
                        })
                    }
                    
                    {
                        
                    }
                </section>
                
                <section className="bottom">
                    <div className="bottom-start">
                        <button>
                            <img id="emoji" src="emoji.svg" alt=""></img>
                        </button>
                        <div className="fileDropup-holder">
                            <button onClick={() => toggleFileDropup()} onBlur={() => setFileDropup(false)}
                                style={filedropup ? {backgroundColor: "hsla(0,0%,100%,0.1)"} : {backgroundColor: "transparent"}}
                            >
                                <img id="upFile" src="clip.svg" alt=""></img>
                            </button>
                            { filedropup ? 
                                <div className="fileDropup">
                                    <button style={{backgroundColor: '#0795dc'}}>
                                        <span style={{backgroundColor: '#0eabf4'}}></span>
                                        <HiUser/>
                                        <FileOverlay color={'white'} title={'Contato'}/>
                                    </button>
                                    <button style={{backgroundColor: '#5157ae'}}>
                                        <span style={{backgroundColor: '#5f66cd'}}></span>
                                        <IoMdDocument/>
                                        <FileOverlay color={'white'} title={'Documento'}/>
                                    </button>
                                    <button style={{backgroundColor: '#d3396d'}}>
                                        <span style={{backgroundColor: '#ec407a'}}></span>
                                        <BsCameraFill/>
                                        <FileOverlay color={'white'} title={'Câmera'}/>
                                    </button>
                                    <button style={{backgroundColor: '#0063cb'}}>
                                        <span style={{backgroundColor: '#0070e6'}}></span>
                                        <RiStickyNoteFill/>
                                        <FileOverlay color={'white'} title={'Figurinhas'}/>
                                    </button>
                                    <button style={{backgroundColor: '#bf59cf'}}>
                                        <span style={{backgroundColor: '#ac44cf'}}></span>
                                        <BsFillImageFill/>
                                        <FileOverlay color={'white'} title={'Fotos e Vídeos'}/>
                                    </button>
                                </div>
                                : <></> 
                            }
                        </div>
                    </div>

                    <div className="bottom-messageBar-holder">
                        <input id="bottom-messageBar" placeholder="Digite uma mensagem..."
                          onChange={() => inputControler()}
                        >  
                        </input>
                    </div>

                    <div className="bottom-end">
                        <button id='sendMessageButton' 
                         style={{marginRight: '10px'}}
                         onClick={() => sendMessage(chatId)}
                        >
                            {
                                searchbarlength > 0 ?
                                <FaArrowRight/>
                                :
                                <FaMicrophone/>
                            }   
                        </button>
                    </div>
                </section>
            </div>

            <RightSideMenu id={'friendMenu'} title={'Dados do Contato'} toggler={rightmenu} closeFunction={() => setRightMenu()}>
                <section id="friend-Mid">
                    <div className="profile-image-name">
                        <img src={user_image} alt=""></img>
                        <h2>{contact.name}</h2>
                        <span>{contact.email}</span>
                    </div>
                    <div className="profile-message">
                        <span>Recado</span>
                        <span className="profile-text">{contact.status}</span>
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
                        <ProfileButton icon="star.svg" title="Mensagens Favoritas"
                            lasticon="right-harrow.svg"
                        />
                        <ProfileButton icon="bell.svg" title="Silenciar Notificações"
                            
                        />
                        <ProfileButton icon="tempmess.svg" title="Mensagens Temporárias"
                            subtitle="Desativadas" lasticon="right-harrow.svg"
                        />
                        <ProfileButton icon="keylock.svg" title="Criptografia"
                            subtitle="As mensagens são protegidas com a criptografia de ponta a ponta.
                            Clique para confirmar"
                        />
                        <ProfileButton icon="denied.svg" title={"Bloquear " + contact.name} red={true} name={'red'}
                            funct={() => setModalBlock(true)}
                        />
                        <ProfileButton icon="dislike.svg" title={"Denunciar " + contact.name} red={true} name={"red"}
                            funct={() => setModalDenunce(true)}
                        />
                        <ProfileButton icon="trash.svg" title={"Apagar Conversa"} red={true} name={'red'}
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
                    <span className="search-span">Pesquisar mensagens com {contact.name}</span>
                </section>
            </RightSideMenu>

            <Modal
                isOpen={modalDelete}
                onRequestClose={() => setModalDelete(false)}
                style={customStyles}
                contentLabel="Example Modal"
                shouldCloseOnOverlayClick={false}
                id="deleteModal"
            >
                <div className="deleteModal-content">
                    <span>Deseja apagar a mensagem?</span>
                    <div className="button-holder">
                        <button>APAGAR PARA TODOS</button>
                        <button>APAGAR PARA MIM</button>
                        <button onClick={() => setModalDelete(false)}>CANCELAR</button>
                    </div>
                </div>
            </Modal>

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
                title={`Deseja bloquear ${contact.name}?`}
                confirmButton={'BLOQUEAR'} cancelButton={'CANCELAR'}
                text={'Contatos bloqueados não poderão mais fazer chamadas nem enviar mensagens para você.'}
                state={modalBlock} closeFunction={() => setModalBlock(false)} 
            />
        </div>
    )
}
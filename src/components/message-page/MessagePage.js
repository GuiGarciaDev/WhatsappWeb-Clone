import "../message-page/style.scss";

import db from '../../db.json';
import React, { useState } from "react";
import Modal from 'react-modal';

import SearchBar from "../searchbar/SearchBar";
import ProfileButton from "../profile-button/ProfileButton";
import MessageDate from "../message-date/MessageDate";
import MessageCard from "../message-card/MessageCard";
import DropMenu from "../dropmenu/DropMenu";
import RightSideMenu from "../right-sidemenu/RightSideMenu";

import { BsFillImageFill, BsCameraFill } from 'react-icons/bs';
import { IoMdDocument, IoIosArrowDown } from 'react-icons/io';
import { HiUser } from 'react-icons/hi';
import { RiStickyNoteFill } from 'react-icons/ri';
import { FaArrowRight, FaMicrophone } from 'react-icons/fa';
import FileOverlay from "../file-overlay/FileOverlay";

// TODO: Aperfeiçoar o chat de mensagens
// Fazer com que o MessageDate seja automático
// Implementar funções que façam o projeto funcionar
// dentre elas: adicionar mensagens, etc

// Default image for all users
let user_image = "cute-cat.jpg";

const customStyles = {
    overlay: {
        backgroundColor: 'var(--modal-backdrop)',
    },

    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      border: 0,
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: 'var(--modal-background)',
    },
  };

export default function MessagePage({ idx }) {
    const [searchmessageMenu, setSearchMessageMenu] = useState(false);
    const [friendMenu, setFriendMenu] = useState(false);  

    const [filedropup, setFileDropup] = useState(false);
    const [searchbarlength, setSearchBarLength] = useState(0); // Control the toggle of mic button and send button
    const [modalDelete, setModalDelete] = useState(false);

    const [dropdown, setDropdown] = useState(null);

    const toggleDropdown = (id) => id === dropdown ? setDropdown(null) : setDropdown(id);
    
    const toggleFileDropup = () => setFileDropup(!filedropup);

    const openModal = () => setModalDelete(true);
    const closeModal = () => setModalDelete(false);

    const friend = db[idx];

      function sendMessage() { // Send message to your friend
        const today = new Date();
        const time = today.getHours() + ":" + today.getMinutes();

        const searchbar = document.getElementById("bottom-messageBar");

        const newMessage = {
            "id": "m" + friend.messages.length,
            "content": searchbar.value,
            "time": time,
            "read": true
        }

        if (searchbar.value.length > 0) {
            friend.messages.push(newMessage);
            searchbar.value = "";
            setSearchBarLength(0);
        }
      }

      function inputControler() {
        let seachbar = document.getElementById("bottom-messageBar");
        let searchbarLength = seachbar.value.length;

        if (searchbarLength > 0) {
            seachbar.addEventListener("keydown", (e) => {
                if (e.key === 'Enter') {
                    sendMessage();
                }
            });
        }

        setSearchBarLength(searchbarLength);
      }

    return(
        <div className="message-page">
            <div className="message-content-holder">
                <section id="header">
                    <button className="header-button" onClick={() => setFriendMenu(true)}>
                        <div className="block-start">
                            <img src={user_image} alt=""></img>
                            <div className="text-holder">
                                <h1>{friend.name}</h1>
                                <span>
                                    {
                                        friend.online ? "online" : "visto por último online às " + friend.last_connection
                                    }
                                </span>
                            </div>
                        </div>
                    </button>

                    <div className="block-end">
                        <button onClick={() => setSearchMessageMenu(true)}>
                            <img id="srch"src="search-icon.svg" alt=""></img>
                        </button>
                        <div className='rightDropdown-holder'>
                            <button id='rightDropdown-button' onClick={() => toggleDropdown('rightDropdown')}
                                style={dropdown === 'rightDropdown' ? {backgroundColor: "hsla(0,0%,100%,0.1)"} : {backgroundColor: "transparent"}}
                            >
                                <img src="3dots.svg" alt='' id="icon3"></img>
                            </button>
                            <DropMenu id={'rightDropdown'} classname={'dropdown'} toggler={dropdown} order={() => setDropdown()}>
                                <button>Dados do contato</button>
                                <button>Selecionar mensagens</button>
                                <button>Silenciar notificações</button>
                                <button>Limpar mensagens</button>
                                <button>Sair do grupo</button>
                            </DropMenu>
                        </div>
                    </div>
                </section>

                <section id="chatbox">
                    <MessageDate date={'today'}/>
                    {
                        db[idx].messages.map((message, messageIdx) => {
                            const dropdownId = 'mdd'+messageIdx;
                            return (
                                <MessageCard friendIndex={idx} messageIndex={messageIdx} content={message.content} 
                                    time={message.time} isRead={message.read} key={messageIdx}
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
                                        <button onClick={() => {openModal(); setDropdown(null)}}>Apagar mensagem</button>
                                    </DropMenu>
                                </MessageCard>
                            )
                        })
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
                        <button style={{marginRight: '10px'}}
                            onClick={() => sendMessage()}
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

            <RightSideMenu title={'Dados do Contato'} toggler={friendMenu} closeFunction={() => setFriendMenu()}>
                <section id="friend-Mid">
                    <div className="profile-image-name">
                        <img src={user_image} alt=""></img>
                        <h2>{friend.name}</h2>
                        <span>{friend.number}</span>
                    </div>
                    <div className="profile-message">
                        <span>Recado</span>
                        <span className="profile-text">{friend.status}</span>
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
                        <ProfileButton icon="denied.svg" title={"Bloquear " + friend.name} red={true} name={'red'}
                        />
                        <ProfileButton icon="dislike.svg" title={"Denunciar " + friend.name} red={true} name={"red"}
                        />
                        <ProfileButton icon="trash.svg" title={"Apagar Conversa"} red={true} name={'red'}
                        />
                    </div>
                </section>
            </RightSideMenu>                  

            <RightSideMenu title={'Pesquisar Mensagens'} toggler={searchmessageMenu} closeFunction={() => setSearchMessageMenu()}>
                <section id="search-Mid">
                    <div className="search-searchbar-holder">
                        <SearchBar placeholder="Pesquisar..."
                            arrowId={"rightC-arrow"} searchId={"rightC-search"}
                        />
                    </div>
                    <span className="search-span">Pesquisar mensagens com {friend.name}</span>
                </section>
            </RightSideMenu>

            <Modal
                isOpen={modalDelete}
                onRequestClose={closeModal}
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
                        <button onClick={() => closeModal()}>CANCELAR</button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}
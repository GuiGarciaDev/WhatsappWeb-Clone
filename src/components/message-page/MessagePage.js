import { useState } from "react";
import "../message-page/style.scss";
import ProfileButton from "../profile-button/ProfileButton";
import SearchBar from "../searchbar/SearchBar";

import { BsFillImageFill, BsCameraFill } from 'react-icons/bs';
import { IoMdDocument } from 'react-icons/io';
import { HiUser } from 'react-icons/hi';
import { RiStickyNoteFill } from 'react-icons/ri';



let user_profile_name = "Cattotas";
let user_last_connection = "19:54";
let user_number = "+55 21 99999-9999"
let user_image = "cute-cat.jpg"
let user_message = "I hope this will work"

export default function MessagePage() {

    const [searchmess, setSearchMess] = useState(true);
    const [profilepage, setProfilePage] = useState(true);
    const [rightdropdown, setRightDropdown] = useState(false);
    const [filedropup, setFileDropup] = useState(false);

    const toggleRightDropdown = () => setRightDropdown(!rightdropdown);
    const toggleFileDropup = () => setFileDropup(!filedropup);

    function showSearchMessagePage() {
        setSearchMess(!searchmess);
        if (searchmess) {
          document.getElementById("search-message-page").style.transform = "translateX(0px)";
        } else {
          document.getElementById("search-message-page").style.transform = "translateX(400px)";
        }
      }

      function showFriendProfilePage() {
        setProfilePage(!profilepage);
        if (profilepage) {
          document.getElementById("friend-profile-page").style.transform = "translateX(0px)";
        } else {
          document.getElementById("friend-profile-page").style.transform = "translateX(400px)";
        }
      }

    return(
        <div className="message-page">
            <div className="message-content-holder">
                <section id="header">
                    <button className="header-button" onClick={() => showFriendProfilePage()}>
                        <div className="block-start">
                            <img src={user_image} alt=""></img>
                            <div className="text-holder">
                                <h1>{user_profile_name}</h1>
                                <span>visto por último online às {user_last_connection}</span>
                            </div>
                        </div>
                    </button>

                    <div className="block-end">
                        <button onClick={() => showSearchMessagePage()}>
                            <img id="srch"src="search-icon.svg" alt=""></img>
                        </button>
                        <div className='rightDropdown-holder'>
                            <button id='rightDropdown-button' onClick={() => toggleRightDropdown()} onBlur={() => setRightDropdown(false)}
                                style={rightdropdown ? {backgroundColor: "hsla(0,0%,100%,0.1)"} : {backgroundColor: "transparent"}}
                            >
                                <img src="3dots.svg" alt='' id="icon3"></img>
                            </button>
                            <div className='dropdown' style={rightdropdown ? {display: "flex"} : {display: "none"}}>
                            <button>Dados do contato</button>
                            <button>Selecionar mensagens</button>
                            <button>Silenciar notificações</button>
                            <button>Limpar mensagens</button>
                            <button>Sair do grupo</button>
                        </div>
            </div>
                    </div>
                </section>

                <section className="mid">

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
                                    </button>
                                    <button style={{backgroundColor: '#5157ae'}}>
                                        <span style={{backgroundColor: '#5f66cd'}}></span>
                                        <IoMdDocument/>
                                    </button>
                                    <button style={{backgroundColor: '#d3396d'}}>
                                        <span style={{backgroundColor: '#ec407a'}}></span>
                                        <BsCameraFill/>
                                    </button>
                                    <button style={{backgroundColor: '#0063cb'}}>
                                        <span style={{backgroundColor: '#0070e6'}}></span>
                                        <RiStickyNoteFill/>
                                    </button>
                                    <button style={{backgroundColor: '#bf59cf'}}>
                                        <span style={{backgroundColor: '#ac44cf'}}></span>
                                        <BsFillImageFill/>
                                    </button>
                                </div>
                                : <></> 
                            }
                        </div>
                    </div>

                    <div className="bottom-messageBar-holder">
                        <input id="bottom-messageBar" placeholder="Digite uma mensagem..."></input>
                    </div>

                    <div className="bottom-end">
                        <button style={{marginRight: '10px'}}>
                            <img id="audio" src="mic.svg" alt=""></img>
                        </button>
                    </div>
                </section>
            </div>
            

            <div id="friend-profile-page" className="rightBar"> {/* Friend Profile */}
                <section id="friend-Header"> 
                    <button onClick={() => showFriendProfilePage()}>
                        <img src="close.svg" alt=""></img> 
                    </button>
                    <span>Dados do Contato</span>
                </section>
                <section id="friend-Mid">
                    <div className="profile-image-name">
                        <img src={user_image} alt=""></img>
                        <h2>{user_profile_name}</h2>
                        <span>{user_number}</span>
                    </div>
                    <div className="profile-message">
                        <span>Recado</span>
                        <span className="profile-text">{user_message}</span>
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
                        <ProfileButton icon="denied.svg" title={"Bloquear " + user_profile_name} red={true} name={'red'}
                        />
                        <ProfileButton icon="dislike.svg" title={"Denunciar " + user_profile_name} red={true} name={"red"}
                        />
                        <ProfileButton icon="trash.svg" title={"Apagar Conversa"} red={true} name={'red'}
                        />
                    </div>
                </section>
            </div>

            <div id="search-message-page" className="rightBar"> {/* Search Message in messagePage */}
                <section id="search-Header"> 
                    <button onClick={() => showSearchMessagePage()}>
                        <img src="close.svg" alt=""></img>
                    </button>
                    <span>Pesquisar Mensagens</span>
                </section>
                <section id="search-Mid">
                    <div className="search-searchbar-holder">
                        <SearchBar placeholder="Pesquisar..."
                            arrowId={"rightC-arrow"} searchId={"rightC-search"}
                        />
                    </div>
                    <span className="search-span">Pesquisar mensagens com {user_profile_name}</span>
                </section>
            </div>
        </div>
    )
}
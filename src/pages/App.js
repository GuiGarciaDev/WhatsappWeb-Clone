import './style.scss'
import db from '../db.json';
import Card from '../components/card'
import { useState } from 'react'
import DefaultPage from '../components/default-page/DefautlPage';
import MessagePage from '../components/message-page/MessagePage';
import SearchBar from '../components/searchbar/SearchBar';

import { AiOutlineUserAdd, AiFillBell  } from 'react-icons/ai';
import { BiShieldQuarter } from 'react-icons/bi';
import { HiDocumentText } from 'react-icons/hi'; 
import { IoMdHelpCircle } from 'react-icons/io'; 
import { MdGroup, MdLock, MdBrightnessMedium } from 'react-icons/md'; 
import { RiImageEditFill } from 'react-icons/ri'; 
import { VscSymbolKey } from 'react-icons/vsc'; 

import DropMenu from '../components/dropmenu/DropMenu'; 
import LeftSideMenu from '../components/left-sidemenu/LeftSideMenu';
import DividerLetter from '../components/divider-letter/DividerLetter';
import ConfigCard from '../components/config-card/ConfigCard';

const alphabet = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];

export default function App() {

  const [messagePage, setMessagePage] = useState(false); // Controls the right column -> Talk page
  const [leftmenu, setLeftMenu] = useState(null);        // Controls the state of left menus
  const [friendIndex, setFriendIndex] = useState(0);     // Send index of friend in db to talk page

  const [edit, setEdit] = useState(false);
  const [name, setName] = useState(false);
  const [filter, setFilter] = useState(true);
  const [hasFavorite, setHasFavorite] = useState(false);

  const [dropdown, setDropdown] = useState(null);
  
  const editMessage = () => setEdit(!edit);
  const editName = () => setName(!name);

  const toggleDropdown = (id) => id === dropdown ? setDropdown(null) : setDropdown(id);
  
  let numSaved = 0;
  let myImg = "pato.jpg";
  let myName = 'Guilherme';
  let myText = '1/8';

  function changePage(idx) { // Search for better way to do this...
    setFriendIndex(idx);
    setMessagePage(true);

    const otherCards = document.getElementsByName("recentTalks"); // Picking all recent cards

    for (let i = 0; i < db.length; i++) { // Restarting all cards ClassNames for "card"
      otherCards[i].className = "card";
    }

    const card = document.getElementById("p"+idx); // Picking all recent cards of new talk
    card.className = "card-active"; // The select card will have this className
  }

  function addConversation(idx) {
    // TODO: 
  }

  function previewImage() {
    let file = document.getElementById("file").files;

    if (file.length > 0) {
      let fileReader = new FileReader();

      fileReader.onload = function(event) {
        document.getElementById("preview").setAttribute("src", event.target.result);
      };

      fileReader.readAsDataURL(file[0]);
    }
  }

  function toggleFilter() {
    setFilter(!filter);

    if (filter) {
      document.getElementById("filterButton").name = "filterActived";
    } else {
      document.getElementById("filterButton").name = "";
    }

  }

  return (
    <div id="page">
      <div className={"left-column"}>

        <div className="left-up">
          <button onClick={() => setLeftMenu('perfilMenu')}>
            <img src="pato.jpg" alt='' className="user-img"></img>
          </button>
          <div className='up-icon-holder'>
            <button>
              <img src="status-icon.svg" alt='' id="icon1"></img>
            </button>
            <button onClick={() => setLeftMenu('newMessageMenu')}>
              <img src='message-icon.svg' alt='' id="icon2"></img>
            </button>
            <div className='leftDropdown-holder'>
              <button id='leftDropdown-button' onClick={() => toggleDropdown('leftDropdown')}
                style={dropdown ? {backgroundColor: "hsla(0,0%,100%,0.1)"} : {backgroundColor: "transparent"}}
              >
                <img src="3dots.svg" alt='' id="icon3"></img>
              </button>
                <DropMenu id={'leftDropdown'} classname={'dropdown'} toggler={dropdown} order={() => setDropdown()}>
                  <button onClick={() => setLeftMenu('joinGroup')}>Novo grupo</button>
                  <button onClick={() => setLeftMenu('favoriteMessageMenu')}>Mensagens favoritas</button>
                  <button onClick={() => setLeftMenu('config')}>Configurações</button>
                  <button>Desconectar</button>
                </DropMenu>
            </div>
          </div>
        </div>

        <div className="left-sub">
          <div className="searchbar-filter">
            <div className="searchbar-holder">
              <SearchBar placeholder={"Pesquisar ou começar uma nova conversa"}
                arrowId="leftC-arrow" searchId="leftC-search"
              />
            </div>
            <button id='filterButton' onClick={() => toggleFilter()}>
              <img src='filter.svg' alt='' id='filter'></img>
            </button>
          </div>
          
          <div className="content-holder">
            { filter ? 
                <>
                  {
                    db.map((friend, idx) => {
                      return (
                        <Card title={friend.name} content={friend.last_message} id={friend.id}
                          date="Ontem" image="cute-cat.jpg" key={idx} name={"recentTalks"}
                          order={() => changePage(idx)}
                        />
                      )
                    })
                  }
                </>
              :  
              <div className='filter-content-holder'>
                <div className='filter-main'>
                  <span>Nenhuma conversa não lida</span>
                  <button onClick={() => toggleFilter()}>Limpar Filtro</button>
                </div>
                <div className='filter-bottom'>
                  <img src='lock.svg' alt=''></img>
                  <span>
                    Suas mensagens pessoais são protegidas com a 
                    <a href='https://github.com/Guilherme-ds-Garcia'> criptografia de ponta a ponta</a>
                  </span>
                </div>
              </div>
            }
          </div>
        </div>

        <LeftSideMenu id={'perfilMenu'} title={'Perfil'} toggler={leftmenu} closeFunction={() => setLeftMenu()}>
          <div id="inputImg-holder"> 
            <img id="preview" src={myImg} alt=""></img>
            <input
              type="file"
              onChange={() => previewImage()}
              accept=".png, image/jpeg"
              id="file"
            />
            <label htmlFor="file"></label>
          </div>

          <div className='sub'>
            <span>Seu nome</span>

            <div className='input-holder'>
              <input className={name ? "name-edit" : "name"}
                defaultValue={myName}
                type="text"
                readOnly={!name}
                >
              </input>
              <button onClick={() => editName()}>
                <img src='edit.svg' alt=''></img>
              </button>
            </div>

            <span className='txt'>
              Esse não é seu nome de usuário e nem seu PIN. 
              Esse nome será visível para seus contatos do WhatsApp.
            </span>

            <span>Recado</span>

            <div className='input-holder'>
              <input className={edit ? "message-edit" : "message"} 
                defaultValue={myText}
                type="text"
                readOnly={!edit}
                >
                </input>
              <button onClick={() => editMessage()}>
                <img src='edit.svg' alt=''></img>
              </button>
            </div>
          </div>
        </LeftSideMenu>

        <LeftSideMenu id={'newMessageMenu'} title={'Nova Mensagem'} toggler={leftmenu} closeFunction={() => setLeftMenu()}>
          <div className='nMessage-content-holder'>
            <div className='nMessage-seachBar-holder'>
              <SearchBar placeholder={"Pesquisar contatos"} 
                arrowId={"nMessage-arrow"} searchId={"nMessage-search"}
              /> 
            </div>

            <button className='nMessage-groupCard-holder'>
              <div className='groupCard-image-holder'>
                <MdGroup/>
              </div>
              <span>Novo Grupo</span>
            </button>
            <button className='nMessage-groupCard-holder'>
              <div className='groupCard-image-holder'>
                <AiOutlineUserAdd/>
              </div>
              <span>Adicionar novo contato</span>
            </button>

            <div className='nMessage-cards-map'>
              {
                numSaved === 1 ? 
                <span>
                  Você ainda não tem contatos, tente 
                  <a href='https://github.com/Guilherme-ds-Garcia'> adicionar </a> 
                  alguns.
                  </span> 
                : 
                alphabet.map((letter) => {
                  return (
                  <>
                    <DividerLetter letter={letter}/>
                    {
                      db.map((friend, idx) => {
                        return (
                          <>
                            {
                              friend.name[0] === letter ?
                              <Card title={friend.name} content={friend.status} id={"n"+friend.id}
                                image="cute-cat.jpg" key={idx} 
                                order={() => addConversation(idx)}
                              /> : <></>
                            }
                          </>
                        )
                      })
                    }
                  </>
                  )
                })
              }
            </div>
          </div>
        </LeftSideMenu>

        <LeftSideMenu id={'favoriteMessageMenu'} title={'Mensagens Favoritas'} toggler={leftmenu} closeFunction={() => setLeftMenu()}>
          <div className='favoriteMessage-content'>
            {
              hasFavorite ?
              <></>
              : 
              <>
                <span>Nenhuma mensagem favorita</span>
                <div className='favorite-endMessage'>
                  <p>
                    Use o WhatsApp no seu celular para ver conversas e mensagens mais antigas.
                  </p> 
                </div>
              </>
            }
          </div>
        </LeftSideMenu>

        <LeftSideMenu id={'joinGroup'} title={'Adicionar participantes ao grupo'} toggler={leftmenu} 
          closeFunction={() => setLeftMenu()}
        >
          <div className="jGroup-searchbar-holder">
            <SearchBar placeholder={"Digite o nome do contato"} 
              arrowId={"jGroup-arrow"} searchId={"jGroup-search"}
            />
          </div>
          <div className='jGroup-content'>
            {
              alphabet.map((letter) => {
                return (
                <>
                  {
                     <DividerLetter letter={letter}/>
                  }
                  {
                    db.map((friend, idx) => {
                      return (
                        <>
                          {
                            friend.name[0] === letter ?
                            <Card title={friend.name} content={friend.status} id={"n"+friend.id}
                              image="cute-cat.jpg" key={idx} 
                            /> : <></>
                          }
                        </>
                      )
                    })
                  }
                </>
                )
              })
            }
          </div>
        </LeftSideMenu>

        <LeftSideMenu id={'config'} title={'Configurações'} toggler={leftmenu} closeFunction={() => setLeftMenu()}>
          <button className='perfilButton' onClick={() => setLeftMenu('perfilMenu')}>
            <img src={myImg} alt=''></img>
            <div className='texts'>
              <h3>{myName}</h3>
              <span>{myText}</span>
            </div>
          </button>
          <ConfigCard title={'Notificações'}>
            <AiFillBell/>
          </ConfigCard>
          <ConfigCard title={'Privacidade'}>
            <MdLock/>
          </ConfigCard>
          <ConfigCard title={'Segurança'}>
            <BiShieldQuarter/>
          </ConfigCard>
          <ConfigCard title={'Tema'}>
            <MdBrightnessMedium/>
          </ConfigCard>
          <ConfigCard title={'Papel de parede da conversa'}>
            <RiImageEditFill/>
          </ConfigCard>
          <ConfigCard title={'Solicitar dados da conta'}>
            <HiDocumentText/>
          </ConfigCard>
          <ConfigCard title={'Atalhos do teclado'}>
            <VscSymbolKey/>
          </ConfigCard>
          <ConfigCard title={'Ajuda'}>
            <IoMdHelpCircle/>
          </ConfigCard>
        </LeftSideMenu>
      </div>

      <div id="right-column">
        {
          messagePage ? <MessagePage idx={friendIndex}/> : <DefaultPage/>
        }
      </div>
    </div>
  )
}

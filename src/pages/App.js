import './style.scss'
import Card from '../components/card'
import { useState } from 'react'
import DefaultPage from '../components/default-page/DefautlPage';
import MessagePage from '../components/message-page/MessagePage';
import SearchBar from '../components/searchbar/SearchBar';

import { MdGroup } from 'react-icons/md';
import { AiOutlineUserAdd } from 'react-icons/ai';

export default function App() {
  const [perfilPage, setPerfilPage] = useState(true);
  const [messagePage, setMessagePage] = useState(false);
  const [newMessagePage, setNewMessagePage] = useState(true);
  const [edit, setEdit] = useState(false);
  const [name, setName] = useState(false);
  const [filter, setFilter] = useState(true);
  const [leftdropdown, setLeftDropdown] = useState(false);
  
  const editMessage = () => setEdit(!edit);
  const editName = () => setName(!name);
  const toggleLeftDropdown = () => setLeftDropdown(!leftdropdown);
  
  let numSaved = 0;
  let userImg = "pato.jpg";
  let user_profile_name = "Cattotas";

  function changePage() {
    setMessagePage(!messagePage);

    if (!messagePage) {
      document.getElementById(user_profile_name).style.backgroundColor="var(--card-focus)";
    } else {
      document.getElementById(user_profile_name).style.backgroundColor="var(--card)";
    }
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

  function showPerfilPage() {
    setPerfilPage(!perfilPage);
    if (perfilPage) {
      document.getElementById("perfilPage").style.transform = "translateX(0px)";
      document.getElementById("inputImg-holder").style.transform = "scale(1)";
    } else {
      document.getElementById("perfilPage").style.transform = "translateX(-500px)";
      document.getElementById("inputImg-holder").style.transform = "scale(0)";
    }
  }

  function showNewMessagePage() {
    setNewMessagePage(!newMessagePage);
    if (newMessagePage) {
      document.getElementById("newMessagePage").style.transform = "translateX(0px)";
    } else {
      document.getElementById("newMessagePage").style.transform = "translateX(-500px)";
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
          <button onClick={() => showPerfilPage()}>
            <img src="pato.jpg" alt='' className="user-img"></img>
          </button>
          <div className='up-icon-holder'>
            <button>
              <img src="status-icon.svg" alt='' id="icon1"></img>
            </button>
            <button onClick={() => showNewMessagePage()}>
              <img src='message-icon.svg' alt='' id="icon2"></img>
            </button>
            <div className='leftDropdown-holder'>
              <button id='leftDropdown-button' onClick={() => toggleLeftDropdown()} onBlur={() => setLeftDropdown(false)}
                style={leftdropdown ? {backgroundColor: "hsla(0,0%,100%,0.1)"} : {backgroundColor: "transparent"}}
              >
                <img src="3dots.svg" alt='' id="icon3"></img>
              </button>
                <div className='dropdown' style={leftdropdown ? {display: "flex"} : {display: "none"}}>
                  <button>Novo grupo</button>
                  <button>Mensagens favoritas</button>
                  <button>Configurações</button>
                  <button>Desconectar</button>
                </div>
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
                <Card name={user_profile_name} lastMessage="So cute!" id={user_profile_name}
                date="Ontem" image="cute-cat.jpg"
                order={() => changePage()}
                />
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

        <div id= "perfilPage"> {/*Right side bar profile*/}
          <div className="up">
            <button id='animated' onClick={() => showPerfilPage()}>
              <img src='left-arrow.svg' alt=''></img>
            </button>
            <span>Perfil</span>
          </div>

          <div id="inputImg-holder"> 
            <img id="preview" src={userImg} alt=""></img>
            <input
              type="file"
              onChange={previewImage}
              accept=".png, image/jpeg"
              id="file"
            />
            <label htmlFor="file"></label>
          </div>

          <div className='sub'>
            <span>Seu nome</span>

            <div className='input-holder'>
              <input className={name ? "name-edit" : "name"}
                defaultValue="Guilherme"
                type="text"
                readOnly={!name}
                >
              </input>
              <button onClick={editName}>
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
                defaultValue="6/10"
                type="text"
                readOnly={!edit}
                >
                </input>
              <button onClick={editMessage}>
                <img src='edit.svg' alt=''></img>
              </button>
            </div>
          </div>
        </div>

        <div id='newMessagePage'> {/* New Message Page */}
          <div className="up">
              <button onClick={() => showNewMessagePage()}>
                <img src='left-arrow.svg' alt=''></img>
              </button>
              <span>Nova Mensagem</span>
          </div>
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
                numSaved === 0 ? 
                <span>
                  Você ainda não tem contatos, tente 
                  <a href='https://github.com/Guilherme-ds-Garcia'> adicionar </a> 
                  alguns.
                  </span> 
                : 
                <div></div>
              }
            </div>
          </div>
        </div>
      </div>

      <div id="right-column">
        {
          messagePage ? <MessagePage/> : <DefaultPage/>
        }
      </div>
    </div>
  )
}

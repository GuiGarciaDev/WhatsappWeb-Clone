import './style.scss'

import Card from '../components/card';
import DefaultPage from '../components/default-page/DefautlPage';
import MessagePage from '../components/message-page/MessagePage';
import SearchBar from '../components/searchbar/SearchBar';
import LeftSideMenu from '../components/left-sidemenu/LeftSideMenu';
import DividerLetter from '../components/divider-letter/DividerLetter';
import ConfigCard from '../components/config-card/ConfigCard';
import NewContactModal from '../components/new-contact-modal/NewContactModal';
import SendContactModal from '../components/modals/send-contact-modal/SendContactModal';
import LeftDropDown from '../components/dropdown/left-dropdown/LeftDropDown';

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/MessageContext';
import { firedb as db, storage } from '../firebase'
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, doc, getDocs, onSnapshot, query, setDoc, updateDoc, where } from 'firebase/firestore'
import { generateId, getContactWithId } from '../API';
import { getFullDateWithSpace } from '../date';
import { AnimatePresence, motion } from 'framer-motion';
import { toastEmiter, toastEmiterError } from '../toastifyemiter';
import {
  AiOutlineUserAdd, AiFillBell, AiOutlineCheck,
  BiShieldQuarter, BsFilter, BsThreeDotsVertical, BsChatLeftTextFill,
  HiDocumentText, IoMdHelpCircle, MdGroup, MdLock, MdBrightnessMedium, 
  MdModeEdit, RiImageEditFill, SiStatuspage, VscSymbolKey
} from '../icons'

const alphabet = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];

export default function App() {
  // Front end

  const { 
    messagePage, setMessagePage,
    cardActived, setCardActived, 
    sendContactModal, chatId, setChatId
  } = useData()

  const [leftmenu, setLeftMenu] = useState(null);        // Controls the state of left menus
  const [editName, setEditName] = useState(false);
  const [editEmail, setEditEmail] = useState(false);
  const [editStatus, setEditStatus] = useState(false);
  const [filter, setFilter] = useState(false);

  const [newContactModal, setNewContactModal] = useState(false) // Open / close modal for add new contact
  
  //const [hasFavorite, setHasFavorite] = useState(false);
  let hasFavorite = false; // Just for stop advice about non use setHasFavorite yet

  const [dropdown, setDropdown] = useState(null);
  
  const toggleDropdown = (id) => id === dropdown ? setDropdown(null) : setDropdown(id);

  function changePage(contact, idx) { // Search for better way to do this...
    setContact(contact)
    setMessagePage(true)
    setChatId(generateId(currentUser.email, contact.email))
    setCardActived(idx)
  }

  function addConversation(email) {
    const contact = getContactWithId(email)
    setContact(contact)
    setMessagePage(true);
    setChatId(generateId(currentUser.email, contact.email))
    setLeftMenu(false)
  }

  function previewImage(file) { // handleUpload()
    const storageRef = ref(storage, `/user-image/${file.name}`)
    const uploadTask = uploadBytesResumable(storageRef, file)

    uploadTask.on(
      "state_changed",
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          updateDoc(userRef, {
            photoUrl: url
          })
        })
      }
    )
  }

  // Responsive width
  const [windowSize, setWindowSize] = useState(getWindowSize());

  function getWindowSize() {
     const {innerWidth, innerHeight} = window
     return {innerWidth, innerHeight}
  }

  useEffect(() => {
     function handleWindowResize() {
         setWindowSize(getWindowSize())
     }

     window.addEventListener('resize', handleWindowResize)

     return () => {
         window.removeEventListener('resize', handleWindowResize)
     }
  }, [])

  // Back end
  const [error, setError] = useState('')
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()
  
  const { user, setUser, contact, setContact } = useData()
  const [contacts, setContacts] = useState([]) // users/user => other users tha you have added

  const [email, setEmail] = useState('')

  const userRef = doc(db, 'users', currentUser.email);
  //const chatRef = collection(db, "chat")
  const contactsRef = collection(db, "users")

  useEffect(() => {
    async function putContact(contacts) {
      setContacts([])
      let contactsArray = []
      for (let i = 0; i < contacts.length; i++) { // Picking all users inside current user contact list
        const q = query(contactsRef, where('email', '==', contacts[i]))
        const data = await getDocs(q)
        data.forEach((contact) => {
          contactsArray.push(contact.data())
          setContacts(contactsArray.map((contact) => contact))
        })
      }
    }
    onSnapshot(userRef, (snapshot) => {
      setUser(snapshot.data());

      let contactsList = snapshot.data().contacts ?? snapshot.data().contacts
      putContact(contactsList)
    })   
  }, [])

  let user_image = user.photoUrl ? user.photoUrl : 'noImage.png'

  async function addContact (email) {
    setError('')
    if (!(currentUser.email === email)) {
      try {

        updateDoc(userRef, {
          "contacts": [
            ...user.contacts,
            email
          ],
        })
  
      } catch (error) {
        console.log(error);
      }  
    } else {
      setError('Cannot add yourself!')
      console.log('Cannot add yourself!');
    }
    setNewContactModal(false)
  }
    
  const updateUser = async () => {
    setDoc(userRef, {
      ...user
    }) 
  }

  async function handleLogout() {
    setError('')

    try {
      await logout()
      updateDoc(userRef, {
        "last_connection": getFullDateWithSpace()
      })
      navigate('/login')
    } catch {
      setError('Failed to log out')
    }
  }

  return (
    <div id="page">
      <div className={"left-column"} style={messagePage && windowSize.innerWidth <= 630 ? {width: '0'} : {}}>
        <div className="left-up">
          <button onClick={() => setLeftMenu('perfilMenu')}>
            <img src={user_image} alt='' className="user-img"></img>
          </button>
          <div className='up-icon-holder'>
            <button onClick={() => {toastEmiter('Not working'); console.log('a');}}>
              <SiStatuspage />
            </button>
            <button onClick={() => setLeftMenu('newMessageMenu')}>
              <BsChatLeftTextFill />
            </button>
            <div className='leftDropdown-holder'>
              <button id='leftDropdown-button' onClick={() => toggleDropdown('leftDropdown')}
                style={dropdown ? {backgroundColor: "hsla(0,0%,100%,0.1)"} : {backgroundColor: "transparent"}}
              >
                <BsThreeDotsVertical />
              </button>
                <LeftDropDown 
                  id={'leftDropdown'} 
                  toggler={dropdown} 
                  setDropdown={setDropdown}
                  setLeftMenu={setLeftMenu}
                  handleLogout={handleLogout}
                />
            </div>
          </div>
        </div>

        <div className="left-sub">
          <div className="searchbar-filter">
            <div className="searchbar-holder">
              <SearchBar placeholder={"Pesquisar ou começar uma nova conversa"}
                arrowId="leftC-arrow" searchId="leftC-search"
                order={changePage}
              />
            </div>
            <button id='filterButton' 
              onClick={() => setFilter(prev => !prev)}
              style={filter ? {backgroundColor: 'var(--down-border)'} : {backgroundColor: 'transparent'}}
            >
              <BsFilter />
            </button>
          </div>
          
          <div className="content-holder">
            { !filter 
              ? contacts.map((contact, idx) => {
                try {
                  return (
                    <Card 
                      title={contact.name} 
                      content={user.last_message[contact.email][0]} 
                      id={idx}
                      date={user.last_message[contact.email][1]} 
                      image={contact.photoUrl ? contact.photoUrl : 'noImage.png'} 
                      key={idx} 
                      active={cardActived} 
                      read={user.last_message[contact.email][2]}
                      order={() => changePage(contact, idx)}
                      isMy={!(user.last_message[contact.email][3] === contact.email)}
                      notReaded={user.messages_not_readed[contact.email]}
                    />
                  )
                } catch (error) {}
              }) 
              : <AnimatePresence>
                { filter && (
                  <motion.div className='filter-content-holder'
                    initial={{scale: 0.7, opacity: 0}}
                    animate={{scale: 1, opacity: 1}}
                    exit={{scale: 0.7, opacity: 0}}
                  >
                    <div className='filter-main'>
                      <span>Nenhuma conversa não lida</span>
                      <button onClick={() => setFilter(false)}>Limpar Filtro</button>
                    </div>
                    <div className='filter-bottom'>
                      <img src='lock.svg' alt=''></img>
                      <span>
                        Suas mensagens pessoais são protegidas com a 
                        <a href='https://github.com/Guilherme-ds-Garcia'> criptografia de ponta a ponta</a>
                      </span>
                    </div>
                  </motion.div>
                )}
            </AnimatePresence> 
            }
          </div>
        </div>

        <LeftSideMenu id={'perfilMenu'} title={'Perfil'} toggler={leftmenu} closeFunction={() => setLeftMenu()}>
          <AnimatePresence>
            {leftmenu === 'perfilMenu' && (
              <motion.div id="inputImg-holder"
                initial={{scale: 0}}
                animate={{scale: 1}}
                exit={{scale: 0}}
                transition={{duration: 0.05}}
              > 
                <img id="preview" src={user_image} alt=""/>
                <input
                  type="file"
                  onChange={(e) => previewImage(e.target.files[0])}
                  accept="/image/*"
                  id="file"
                  autoComplete='off'
                />
                <label htmlFor="file"></label>
            </motion.div>
            )}
          </AnimatePresence>

          <div className='sub'>
            <span>Seu nome</span>

            <div className='input-holder'>
              <input className={editName ? "property-edit" : "property"}
                onChange={(e) => user.name = e.target.value}
                defaultValue={user.name}
                type="text"
                readOnly={!editName}
                >
              </input>
              {
                editName ? 
                <button onClick={() => {updateUser(); setEditName(false)}}><AiOutlineCheck/></button> 
                : 
                <button onClick={() => setEditName(true)}><MdModeEdit/></button>
              }
            </div>

            <span>Seu email</span>

            <div className='input-holder'>
              <input className={editEmail ? "property-edit" : "property"}
                onChange={(e) => user.email = e.target.value}
                defaultValue={user.email}
                type="text"
                readOnly={!editEmail}
                >
              </input>
              {
                editEmail ? 
                <button onClick={() => {updateUser(); setEditEmail(false)}}><AiOutlineCheck/></button>
                : 
                <button disabled={true} onClick={() => setEditEmail(true)}><MdModeEdit/></button>
              }
            </div>

            <span className='txt'>
              Esse não é seu nome de usuário e nem seu PIN. 
              Esse nome será visível para seus contatos do WhatsApp.
            </span>

            <span>Recado</span>

            <div className='input-holder'>
              <input className={editStatus ? "property-edit" : "property"} 
                onChange={(e) => user.status = e.target.value}
                defaultValue={user.status}
                type="text"
                readOnly={!editStatus}
                >
                </input>
                {
                  editStatus ? 
                  <button onClick={() => {updateUser(); setEditStatus(false)}}><AiOutlineCheck/></button> 
                  : 
                  <button onClick={() => setEditStatus(true)}><MdModeEdit/></button>
                }
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
            <button className='nMessage-groupCard-holder' onClick={() => setNewContactModal(true)}>
              <div className='groupCard-image-holder'>
                <AiOutlineUserAdd/>
              </div>
              <span>Adicionar novo contato</span>
            </button>

            <div className='nMessage-cards-map'>
              {
                contacts.length === 0 ? 
                  <span>
                    Você ainda não tem contatos, tente 
                    <a href='https://github.com/Guilherme-ds-Garcia'> adicionar </a> 
                    alguns.
                  </span> 
                : 
                alphabet.map((letter, idx) => {
                  return (
                  <>
                    <DividerLetter letter={letter} key={idx}/>
                    {
                      contacts.map((contact, idx) => {
                        if (contact.name[0] === letter) {
                          return (
                            <Card title={contact.name} content={contact.status} 
                              id={"n"+idx}
                              image={contact.photoUrl ? contact.photoUrl : 'noImage.png'} 
                              order={() => addConversation(contact.email)}
                            />
                          )
                        }
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
              alphabet.map((letter, idx) => {
                return (
                <>
                  {
                    <DividerLetter letter={letter} key={idx}/>
                  }
                  {
                    contacts.map((contact, idx) => {
                      return (
                        <>
                          {
                            contact.name[0] === letter &&
                            <Card title={contact.name} content={contact.status} id={"n"+idx}
                              image="cute-cat.jpg" key={idx} 
                            />
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
            <img src={user_image} alt=''></img>
            <div className='texts'>
              <h3>{user.name}</h3>
              <span>{user.status}</span>
            </div>
          </button>
          <ConfigCard title={'Notificações'} action={toastEmiterError}>
            <AiFillBell/>
          </ConfigCard>
          <ConfigCard title={'Privacidade'} action={toastEmiterError}>
            <MdLock/>
          </ConfigCard>
          <ConfigCard title={'Segurança'} action={toastEmiterError}>
            <BiShieldQuarter/>
          </ConfigCard>
          <ConfigCard title={'Tema'} action={toastEmiterError}>
            <MdBrightnessMedium/>
          </ConfigCard>
          <ConfigCard title={'Papel de parede da conversa'} action={toastEmiterError}>
            <RiImageEditFill/>
          </ConfigCard>
          <ConfigCard title={'Solicitar dados da conta'} action={toastEmiterError}>
            <HiDocumentText/>
          </ConfigCard>
          <ConfigCard title={'Atalhos do teclado'} action={toastEmiterError}>
            <VscSymbolKey/>
          </ConfigCard>
          <ConfigCard title={'Ajuda'} action={toastEmiterError}>
            <IoMdHelpCircle/>
          </ConfigCard>
        </LeftSideMenu>
      </div>

      <div id="right-column" style={messagePage && windowSize.innerWidth < 630 ? {width: '100%'} : windowSize.innerWidth > 630 ? {width: '100%'} : {width: '0'}}>
        {
          messagePage ? <MessagePage currentContact={contact} chatId={chatId} closeFunction={setMessagePage}/> : <DefaultPage/>
        }
      </div>

      <NewContactModal 
        state={newContactModal} 
        closeFunction={() => setNewContactModal(false)} 
      >
        <div className='email-holder'>
            <input placeholder='Friend Email' type='email' autoComplete='off' onChange={(e) => setEmail(e.target.value)}/>
        </div>
        <div className="button-holder">
            <button onClick={() => setNewContactModal(false)}>CANCELAR</button>
            <button className='confirmButton' onClick={() => addContact(email)}>ADICIONAR</button>
        </div>
      </NewContactModal>

      <SendContactModal openState={sendContactModal} contacts={contacts}/>
    </div>
  )
}

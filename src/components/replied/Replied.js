import { AiOutlineClose, AiFillCamera, HiDocument  } from '../../icons'
import { useAuth } from '../../contexts/AuthContext'
import { useData } from '../../contexts/MessageContext'
import'./style.scss'

export default function Replied () {
    const { currentUser } = useAuth()
    const { repMessage, setRepMessage } = useData()

    const state = repMessage[0]                 // 0: state -> true | false  boolean
    const autor = repMessage[1].autor           // 1: autor -> string
    const content = repMessage[1].content       // 2: content -> string
    const type = repMessage[1].type             // 3: type -> txt | doc | img  string
    const src = repMessage[1].photoUrl          // 4: src -> img src in case of type img
    const fileName = repMessage[1].fileName     // 5: fileName -> string

    return (
        <div className="rep-all" style={state ? {height: '70px'} : {height: '0px'}}>
            <div className='message'>
                <span></span>
                <div className='autorContent'>
                    <p className='autor'>{autor  === currentUser.email ? 'Você' : repMessage[2]}</p>
                    <div>
                    { type === 'img'
                        ? <p><AiFillCamera/>Foto</p>
                        : (type === ('pdf') || type === 'doc')
                            ? <div className='file-description'><HiDocument/>{`${fileName}`}</div>
                            : <p>{content}</p>
                    }
                    </div>
                </div>
                { type === 'img' 
                    ? <img src={src}></img>
                    : <></>
                }
            </div>
            <button id='closeButton' onClick={() => setRepMessage([false, {}])}><AiOutlineClose/></button>
        </div>
    )
     
}
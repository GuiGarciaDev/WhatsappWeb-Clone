import "./style.scss";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { collection, limit, onSnapshot, orderBy, query, where } from "@firebase/firestore";
import { firedb as db} from "../firebase";
import { generateId, updateReadStatus } from "../API";
import { useData } from "../contexts/MessageContext";
import { useState } from "react";
import { AiFillCamera, HiDocument, HiUser } from '../icons'

export default function Card(props) {
    const { user } = useData()
    const [lastMessageData, setLastMessageData] = useState([]);
    const [msgNotReaded, setMsgNotReaded] = useState(0);

    let MESSAGE_DATE = lastMessageData ? lastMessageData.cardDate : ''
    let MESSAGE_OWNER = lastMessageData ? lastMessageData.autor === user.email : ''
    let TYPE = lastMessageData ? lastMessageData.type : ''

    useEffect(() => {
        const messagesRef = collection(db, "chat", generateId(user.email, props.contactEmail), 'messages')
        const lastMessage = query(messagesRef, orderBy('date', 'desc'), limit(1))

        const messagesNotReaded = query(messagesRef, where('read', '==', false), where('autor', '!=', user.email))

        onSnapshot(lastMessage, (snapshot) => {
            setLastMessageData(snapshot.docs[0].data())
        })

        onSnapshot(messagesNotReaded, (snapshot) => {
            setMsgNotReaded(snapshot.docs.length)
        })
    }, [])

    async function updateRead() {
        const chatId = generateId(user.email, props.contactEmail)
        const messagesNotReaded = query(
            collection(db, "chat", chatId, 'messages'), 
            where('read', '==', false), where('autor', '!=', user.email)
        )
        await updateReadStatus(messagesNotReaded, chatId).then(
            setMsgNotReaded(0)
        )
    }

    return(
        <motion.button id={props.id} className={props.active === props.id ? 'card-active' : 'card'}
            key={props.id}
            onClick={() => {props.order(); updateRead()}}
            initial={{opacity: 0}}
            animate={{opacity: 1}}
        >
            <img src={props.image} alt=''></img>
            <div className="border-holder">
                <div className="mid">
                    <h1>{props.title}</h1>
                    <motion.span key={lastMessageData.content}
                        animate={{opacity: [0,1]}}
                    >
                        { (TYPE === 'text' || TYPE === 'rep') 
                            ? lastMessageData.content
                            : TYPE === 'img'
                                ? <><AiFillCamera/>Foto</>
                                : (TYPE === 'doc' || TYPE === 'pdf')
                                    ? <><HiDocument/>{lastMessageData.fileName}</>
                                    : TYPE === 'contact' 
                                        ? <><HiUser/>Contato</>
                                        : ''
                        }
                    </motion.span>
                </div>
                <div className="end">
                    <motion.span 
                        style={MESSAGE_OWNER ? {} : msgNotReaded ? {color: 'var(--primary-green)'} : {color: 'var(--text-secondary)'}}
                        animate={{opacity: [0,1]}}
                    >
                        {MESSAGE_DATE}
                    </motion.span>
                    <motion.span className="notReaded" 
                        style={msgNotReaded ? {display: 'flex'} : {display: 'none'}}
                        animate={{opacity: [0,1]}}
                    >
                        {msgNotReaded}
                    </motion.span>
                </div>
            </div>
        </motion.button>
    )
}
import "./style.scss";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { collection, limit, onSnapshot, orderBy, query } from "@firebase/firestore";
import { firedb as db} from "../firebase";
import { generateId } from "../API";
import { useData } from "../contexts/MessageContext";
import { useState } from "react";
import { AiFillCamera, HiDocument, HiUser } from '../icons'

export default function Card(props) {
    const { user } = useData()
    const [lastMessageData, setLastMessageData] = useState([]);

    let MESSAGE_DATE = lastMessageData ? lastMessageData.cardDate : ''
    let MESSAGE_READ = lastMessageData ? lastMessageData.read : ''
    let MESSAGE_OWNER = lastMessageData ? lastMessageData.autor === user.email : ''
    let TYPE = lastMessageData ? lastMessageData.type : ''

    useEffect(() => {
        const messagesRef = collection(db, "chat", generateId(user.email, props.contactEmail), 'messages')
        const lastMessage = query(messagesRef, orderBy('date', 'desc'), limit(1))

        onSnapshot(lastMessage, (snapshot) => {
            setLastMessageData(snapshot.docs[0].data())
        })
    }, [])

    return(
        <motion.button id={props.id} className={props.active === props.id ? 'card-active' : 'card'} 
            key={props.id}
            onClick={props.order}
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
                    <span style={MESSAGE_OWNER ? {} : MESSAGE_READ ? {color: 'var(--text-secondary)'} : {color: 'var(--primary-green)'}}>
                        {MESSAGE_DATE}
                    </span>
                    <span className="notReaded" style={props.notReaded > 0 ? {display: 'flex'} : {display: 'none'}}>
                        {props.notReaded ?? props.notReaded}
                    </span>
                </div>
            </div>
        </motion.button>
    )
}
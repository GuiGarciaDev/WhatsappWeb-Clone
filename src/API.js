import { addDoc, collection, deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { getDate, getFullDate, getTime } from "./date";
import { firedb as db} from "./firebase";


export function sendImage( chatId, userEmail, contact, src ) {
    const chatMessages = collection(db, "chat", chatId, 'messages')

    addDoc(chatMessages, { // Message type Image sent to chatId room
        "content": '',
        "time": getTime(),
        "date": getFullDate(),
        "cardDate": getDate(),
        "read": false,
        "autor": userEmail,
        "for": contact.email,
        "clearedFor": {},
        "photoUrl": src,
        "type": 'img',
    }).then(function (docRef) {
        updateDoc(doc(db, "chat", chatId, 'messages', docRef.id), {
            "id": docRef.id
        })
        updateDoc(doc(db, 'users', contact.email), {
            'messages_not_readed': {
                [userEmail]: (contact.messages_not_readed[userEmail] + 1)
            }
        })
    })
}

export function deleteMessage ( messageId, chatId ) {
    const messageRef = doc(db, "chat", chatId, 'messages', messageId)
   
    deleteDoc(messageRef)
}

export async function clearMessage ( messageId, chatId, userEmail ) {
    const messageRef = doc(db, "chat", chatId, 'messages', messageId)
    const prevInfo = await getDoc(messageRef)

    updateDoc(messageRef, {
        "clearedFor": {
            ...prevInfo.data().clearedFor,
            [userEmail]: true
        }
    })
}
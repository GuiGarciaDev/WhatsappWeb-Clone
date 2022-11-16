import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { firedb as db} from "./firebase";

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
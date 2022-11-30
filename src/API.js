import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable, getBlob } from "firebase/storage";
import { getDate, getFullDate, getTime } from "./date";
import { firedb as db, storage} from "./firebase";

export function generateId (userID, friendID) {
    const newChatId = userID > friendID 
      ? userID + friendID
      : friendID + userID

    return newChatId
}

export function generateSizeAndTypeString (size, type) {
    if (size < 104857) {
        return `${(size / 1024).toPrecision(3)} KB - ${type}`
    } else {
        return `${(size / (Math.pow(2, 20))).toPrecision(3)} MB - ${type}`
    }
}

export async function getRepliedMsg(repId, chatId) {
    const messagesRef = collection(db, "chat", chatId, 'messages')
    const repMessageRef = query(messagesRef, where('id', '==', repId))
    const repMessage = await getDocs(repMessageRef)

    return repMessage.docs[0].data()
}

export async function getMessageForReply(id, chatId) {
    const messagesRef = collection(db, "chat", chatId, 'messages')
    const repMessageRef = query(messagesRef, where('id', '==', id))
    const repMessage = await getDocs(repMessageRef)

    return repMessage.docs[0].data()
}

export async function getFile( path ) {
    // Not working yet, built for get preview of pdf document in message
    // return await getBlob(ref(storage, path))
    // const xhr = new XMLHttpRequest();
    // xhr.responseType = 'blob';
    // xhr.onload = (event) => {
    //   const blob = xhr.response;
    // };
    // xhr.open('GET', url);
    // xhr.send();
}

export function sendFile(file, userEmail, contact, type) { // handleUpload()
    const chatId = generateId(userEmail, contact.email)
    const chatMessages = collection(db, "chat", chatId, 'messages')

    const storageRef = ref(storage, `/files/${chatId}/${file.name}`)
    const uploadTask = uploadBytesResumable(storageRef, file)

    uploadTask.on(
      "state_changed",
       (snapshot) => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            addDoc(chatMessages, { // Message type Image sent to chatId room
                "content": '',
                "autor": userEmail,
                "for": contact.email,
                "read": false,
                "time": getTime(),
                "date": getFullDate(),
                "cardDate": getDate(),
                "fileUrl": url,
                "fileSizeType": generateSizeAndTypeString(file.size, file.type),
                "fileName": file.name,
                "type": type,
                "clearedFor": {},
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
        })
      }
    )
}

export async function uploadRepMessage( userEmail, contact, value, repId ) { // Send reply message to your friend
    /*  chatId: Id of chat
        UserEmail = user email
        contact = object with friend info  
        value = content of message picked by input */

    const chatId = generateId(userEmail, contact.email)   
    const chatMessages = collection(db, "chat", chatId, 'messages')

    addDoc(chatMessages, { // Message sent to chatId room
        "content": value,
        "time": getTime(),
        "date": getFullDate(),
        "cardDate": getDate(),
        "read": false,
        "autor": userEmail,
        "for": contact.email,
        "clearedFor": {},
        "type": 'rep',
        "repId": repId,
    }).then(function (docRef) {
        updateDoc(doc(db, "chat", chatId, 'messages', docRef.id), {
            "id": docRef.id
        })
        updateDoc(doc(db, 'users', contact.email), {
            'messages_not_readed': {
                [userEmail]: (contact.messages_not_readed[userEmail] + 1)
            }
        })
        updateLastMessageIn(userEmail, contact.email, docRef)
        updateLastMessageIn(userEmail, contact.email, docRef)
    })
    
}

export async function uploadMessage( userEmail, contact, value ) { // Send message to your friend
    /*  chatId: Id of chat
        UserEmail = user email
        contact = object with friend info  
        value = content of message picked by input */

    const chatId = generateId(userEmail, contact.email)   
    const chatMessages = collection(db, "chat", chatId, 'messages')

    addDoc(chatMessages, { // Message sent to chatId room
        "content": value,
        "time": getTime(),
        "date": getFullDate(),
        "cardDate": getDate(),
        "read": false,
        "autor": userEmail,
        "for": contact.email,
        "clearedFor": {},
        "type": 'text',
    }).then(function (docRef) {
        updateDoc(doc(db, "chat", chatId, 'messages', docRef.id), {
            "id": docRef.id
        })
        updateDoc(doc(db, 'users', contact.email), {
            'messages_not_readed': {
                [userEmail]: (contact.messages_not_readed[userEmail] + 1)
            }
        })
        updateLastMessageIn(userEmail, contact.email, docRef)
        updateLastMessageIn(userEmail, contact.email, docRef)
    })
    
}

async function updateLastMessageIn(userEmail, friendEmail, docRef) {
    // Params:
    const ref = await getDoc(doc(db, 'users', userEmail))
    const data = ref.data()

    const lastMessage = await getDoc(docRef)
    const lastMessageData = lastMessage.data()

    try {
        await updateDoc(doc(db, 'users', userEmail), {
            "last_message": {
                ...data.last_message,
                [friendEmail]: [
                    lastMessageData[0].content, 
                    lastMessageData[0].cardDate, 
                    lastMessageData[0].read, 
                    lastMessageData[0].autor,
                ]
            }
        })
    } catch (error) {}
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
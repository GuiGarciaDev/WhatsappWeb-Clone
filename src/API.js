import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
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

export async function getContactWithId(id) {
    const userRef = collection(db, 'users')
    const contactRef = query(userRef, where('id', '==', id))
    const contact = await getDocs(contactRef)

    return contact.docs[0].data()
}

export async function sendContacts( userEmail, contact, contacts ) { // Send contact message to your friend
    const chatId = generateId(userEmail, contact.email)   
    const chatMessages = collection(db, "chat", chatId, 'messages')

    for (let i = 0; i < contacts.length; i++) {   
        addDoc(chatMessages, { // Message sent to chatId room
            "content": '',
            "time": getTime(),
            "date": getFullDate(),
            "cardDate": getDate(),
            "read": false,
            "autor": userEmail,
            "for": contact.email,
            "clearedFor": {},
            "type": 'contact',
            "contactId": contacts[i],
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
    })
    
}

export async function uploadMessage( userEmail, contact, value ) { // Send message to your friend
    /*  chatId: Id of chat
        UserEmail = user email
        contact = object with friend info  
        value = content of message picked by input */

    const chatId = generateId(userEmail, contact.email)   
    const chatMessages = collection(db, "chat", chatId, 'messages')
    console.log(contact.messages_not_readed);

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
    })
    
}

// export async function updateLastMessageIn(userEmail, friendEmail, docRef) {
//     // Params:

//     const ref = await getDoc(doc(db, 'users', userEmail))
//     const userData = ref.data()
//     const lastMessage = await getDoc(docRef)
//     const lastMessageData = lastMessage.data()

//     try {
//         switch (lastMessageData.type) {
//             case 'text':
//                 await updateDoc(doc(db, 'users', userEmail), {
//                     "last_message": {
//                         ...userData.last_message,
//                         [friendEmail]: [
//                             lastMessageData.content, 
//                             lastMessageData.cardDate, 
//                             lastMessageData.read, 
//                             lastMessageData.autor,
//                         ]
//                     }
//                 })
//                 break;
//             case 'img':
                
//                 break;
        
//             default:
//                 break;
//         }
        
//     } catch (error) {console.log(error);}
// }

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
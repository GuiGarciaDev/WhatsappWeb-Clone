import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { getDate, getFullDate, getTime } from "./date";
import { firedb as db, storage} from "./firebase";
import { toastEmiterError, toastEmiterSuccess } from "./toastifyemiter";

export function generateId (userID, friendID) {
    const newChatId = `${userID}` > `${friendID}` 
      ? `${userID}` + `${friendID}`
      : `${friendID}` + `${userID}`

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

export async function getContactWithId(id) {
    let data;
    const userRef = collection(db, 'users')
    const contactRef = query(userRef, where('id', '==', id))
    await getDocs(contactRef).then(x => {
        data = x.docs[0].data()
    })
    return data
}

export async function getContactWithEmail(email) {
    let data;
    const userRef = collection(db, 'users')
    const contactRef = query(userRef, where('email', '==', email))
    await getDocs(contactRef).then(x => {
        data = x.docs[0].data()
    })
    return data
}

export async function updateReadStatus(ref, chatId) {
    await getDocs(ref).then(docs => {
        docs.forEach(document => {
            updateDoc(doc(db, 'chat', chatId, 'messages', document.id), {
                'read': true
            })
        })
    })  
}

export async function addContact( userEmail, contactEmail ) { // onSnapshot have to update this collection when new chat id is generated
    if (!(userEmail === contactEmail)) {
        try {
          setDoc(doc(db, 'users', userEmail, 'recents', contactEmail), {
            'added': true,
            'email': contactEmail
          }).then(
            toastEmiterSuccess('Amigo adicionado com sucesso!')
          )
        } catch (error) {
          console.log(error);
        }  
      } else {
        toastEmiterError('Você não pode se adicionar')
      }
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
            "contactId": parseInt(contacts[i]),
        }).then(function (docRef) {
            updateDoc(doc(db, "chat", chatId, 'messages', docRef.id), {
                "id": docRef.id
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
        null,
        null,
        () => { // After complete, this function is called
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
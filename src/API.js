import { collection, doc, getDoc, onSnapshot, query, where } from "firebase/firestore";
import { useState } from "react";
import { firedb as db} from "./firebase";


// export async function getUserContacts(email) { // Require currentUser email
//     const [data, setData] = useState([]);

//     const userRef = doc(db, 'users', email)
//     const contactsRef = collection(db, 'users')

//     const userContacts = await getDoc(userRef)

//     let userContactsList = userContacts.data().contacts ?? userContacts.data().contacts
//     let contactsArray = []
//     for (let i = 0; i < userContactsList.length; i++) { // Picking all users inside current user contact list
//       const q = query(contactsRef, where('email', '==', userContactsList[i]))
//       onSnapshot(q, (snapshot) => {
//         contactsArray.push(snapshot.docs.map((contact) => ({...contact.data()})))
//         setData (contactsArray.map((contact) => contact[0]))
//       })
//     }
//     return (data)
// }

// async function getData() {
//     setData([])
//     let array = []
//     //const contacts = query(userRef, )
//     const q = query(ref, where('name', '>=', value))
//     const querySnapshot = await getDocs(q)
//     querySnapshot.forEach((doc) => {
//         array.push(doc.data())
//         setData(array)
//         setHeight((array.length)*75)
//     })   
// }
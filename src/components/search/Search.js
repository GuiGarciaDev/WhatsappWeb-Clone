import './style.scss'
import { collection, doc, getDocs, onSnapshot, query, where } from "firebase/firestore"
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { firedb as db } from "../../firebase"
import SearchCard from '../search-card/SearchCard';


export default function Search({value, order}) {
    const [data, setData] = useState([])
    const [user, setUser] = useState();
    const [height, setHeight] = useState(0)
    const { currentUser } = useAuth()

    useEffect(() => {
        const ref = collection(db ,'users')
        const userRef = doc(db, 'users', currentUser.email)

        onSnapshot(userRef, (snapshot) => {
            setUser(snapshot.data());
        }) 

        async function getData( value ) {
            if (value !== '') {
                setData([])
                let array = []
                let contactsList = user.contacts ?? user.contacts
                const q = query(ref, where('name', '>=', value))
                const querySnapshot = await getDocs(q)
                querySnapshot.forEach((doc) => {
                    for (let i = 0; i < contactsList.length; i++) {
                        if (doc.data().email === contactsList[i]) {
                            array.push(doc.data())
                            setData(array)
                            setHeight((array.length)*80)
                        }
                    }
                })
            }
        }

        getData(value)
    }, [value])

    
    return (          
        <div id="search-result" style={value.length > 0 ? {height: height, paddingTop: '10px', marginBottom: '15px'} : {height: 0}}>
            {
                data.length > 0 &&
                data.map((contact, idx) => {
                    return( 
                        <SearchCard name={contact.name} id={idx}
                            photoUrl={contact.photoUrl ? contact.photoUrl : 'noImage.png'} 
                            key={idx}
                            order={() => order(contact.email, idx)}
                        />
                    )
                })
            }
        </div>
    )
}


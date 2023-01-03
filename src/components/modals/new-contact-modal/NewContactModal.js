import './NewContactModal.scss';

import Modal from 'react-modal';
import { useState } from 'react';
import { useData } from '../../../contexts/MessageContext';
import { addContact, userExists } from '../../../API';
import { toastEmiterError } from '../../../utils/toastifyemiter';


const customStyles = {
    overlay: {
        backgroundColor: 'var(--modal-backdrop)',
        zIndex: 10,
    },

    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      border: 0,
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: 'var(--modal-background)',
    },
};

export default function NewContactModal({ state, closeFunction }) {
    const [email, setEmail] = useState('');
    const { user } = useData()

    async function handleSubmit(event) {
        event.preventDefault()

        userExists(email).then(res => {
            if (res) {
                addContact(user.email, email) 
                closeFunction(false)
            } else {
                toastEmiterError('Usuário não encontrado!')
            }
        })
    }

    return (
        <Modal
            isOpen={state}
            onRequestClose={closeFunction}
            style={customStyles}
            contentLabel="Example Modal"
            shouldCloseOnOverlayClick={false}
            id="newContactModal"
            appElement={document.getElementById('root')}
        >
            <div className="newContactModal-content">
                <form onSubmit={handleSubmit}>
                    <h2>Adicionar contato</h2>
                    <div className='email-holder'>
                        <input placeholder='Friend Email' type='email' autoComplete='off' onChange={(e) => setEmail(e.target.value)}/>
                    </div>
                    <div className="button-holder">
                        <button onClick={() => closeFunction(false)}>CANCELAR</button>
                        <button className='confirmButton' type='submit'>ADICIONAR</button>
                    </div>
                </form>
            </div>
        </Modal>
    )
}
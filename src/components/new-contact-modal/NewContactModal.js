import './style.scss';

import Modal from 'react-modal';
import { useState } from 'react';
import { addContact } from '../../API';
import { useData } from '../../contexts/MessageContext';

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
            <div className="deleteModalConversation-content">
                <h2>Adicionar contato</h2>
                <div className='email-holder'>
                    <input placeholder='Friend Email' type='email' autoComplete='off' onChange={(e) => setEmail(e.target.value)}/>
                </div>
                <div className="button-holder">
                    <button onClick={() => closeFunction(false)}>CANCELAR</button>
                    <button className='confirmButton' onClick={() => {addContact(user.email, email); closeFunction(false)}}>ADICIONAR</button>
                </div>
            </div>
        </Modal>
    )
}
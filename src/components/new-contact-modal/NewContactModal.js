import './style.scss';

import Modal from 'react-modal';
import { useState } from 'react';

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

export default function NewContactModal({ state, closeFunction, children}) {

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
                {children}
            </div>
        </Modal>
    )
}
import './style.scss';

import Modal from 'react-modal';
import { customStyles } from '../../modalSettings';
import CustomCheckBox from '../custom-checkbox/CustomCheckBox';

export default function TwoOptionsModal(props) {

    const check = props.check ?? false;

    return (
        <Modal
            isOpen={props.state}
            onRequestClose={props.closeFunction}
            style={customStyles}
            contentLabel="Example Modal"
            shouldCloseOnOverlayClick={false}
            id="twoOptionModal"
            appElement={document.getElementById('root')}
        >
            <div className="deleteModalConversation-content">
                <h2>{props.title}</h2>
                <div className="checkdiv" style={check ? {display: 'flex'} : {display: 'none'}}>
                    <CustomCheckBox/>
                    Bloquear contato e limpar conversa
                </div>
                <span>{props.text}</span>
                <div className="button-holder">
                    <button onClick={() => props.closeFunction()}>{props.cancelButton}</button>
                    <button className='confirmButton'>{props.confirmButton}</button>
                </div>
            </div>
        </Modal>
    )
}
import "./style.scss";

import { MdLock } from 'react-icons/md'; 

export default function DefaultPage() {
    return(
        <div className="all">
            <img src='wppimg.svg' alt=''></img>
            <h1>WhatsApp Web</h1>
            <span>
                Envie e receba mensagens sem precisar manter seu celular conectado à internet.  
                <br></br>
                Use o WhatsApp em até quatro aparelhos conectados e um celular ao mesmo tempo.
            </span>
            <div className='down-advice'>
                <MdLock />
                <span>Protegido com criptografia de ponta a ponta</span>
            </div>
        </div>
    )
}
import "./ThemeModal.scss"

import Modal from 'react-modal'
import { customStyles } from '../../../modalSettings';
import { useState } from "react";
import { useTheme } from "../../../contexts/ThemeContext";

export default function ThemeModal({state, closeFunction}) {
    const { theme, setTheme } = useTheme()
    const [prevTheme, setPrevTheme] = useState(theme);

    function handleSubmit(event) {
        event.preventDefault()

        if (prevTheme !== theme) {
            const html = document.querySelectorAll('html')[0]
            html.classList.remove(theme)
            html.classList.add(prevTheme)
            localStorage.setItem('theme', prevTheme)
            setTheme(prevTheme)
        }
    }

    return (
        <Modal
            isOpen={state}
            onRequestClose={closeFunction}
            style={customStyles}
            contentLabel="Theme modal"
            shouldCloseOnOverlayClick={false}
            id={'themeModal'}
            appElement={document.getElementById('root')}
            closeTimeoutMS={150}
        >
            <div className="themeModal">
                <h2>Escolha um tema</h2>
                <form onSubmit={handleSubmit}>
                    <div className="input-holder">
                        <input type="radio" id="light" name="theme" value="light-mode" defaultChecked={theme === 'light-mode'}
                            onChange={e => setPrevTheme(e.target.value)}
                        />
                        <label htmlFor="light">Claro</label>
                    </div>
                    <div className="input-holder">
                        <input type="radio" id="dark" name="theme" value="dark-mode" defaultChecked={theme === 'dark-mode'}
                            onChange={e => setPrevTheme(e.target.value)}
                        />
                        <label htmlFor="dark">Escuro</label>
                    </div>

                    <div className="button-holder">
                        <button onClick={() => closeFunction(false)}>{'CANCELAR'}</button>
                        <button type="submit" className='confirmButton'>{'OK'}</button>
                    </div>
                </form>
            </div>
        </Modal>
    )
}
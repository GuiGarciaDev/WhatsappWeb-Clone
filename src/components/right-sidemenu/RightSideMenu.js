import "./style.scss";
import { AiOutlineClose } from 'react-icons/ai';

export default function RightSideMenu({ children, toggler, closeFunction, title }) { 
    return (
        <div className="sidebarRight"
            style={toggler ? {transform: 'translateX(0px)'} : {transform: 'translateX(500px)'}}
        >
            <section id="header"> 
                <button onClick={() => closeFunction(false)}>
                    <AiOutlineClose/>
                </button>
                <span>{title}</span>
            </section>
            <div className="sidebarRight-Content">
                {children}
            </div>
        </div>
    )
}
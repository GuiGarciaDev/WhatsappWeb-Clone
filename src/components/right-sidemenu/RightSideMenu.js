import "./style.scss";
import { AiOutlineClose } from 'react-icons/ai';

export default function RightSideMenu({ children, toggler, closeFunction, title, id }) { 
    return (
        <div className="sidebarRight"
            style={!(toggler === id) ? {width: '0'} : {}}
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
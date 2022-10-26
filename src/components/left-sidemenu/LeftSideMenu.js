import "./style.scss";
import { HiArrowLeft } from 'react-icons/hi';

//style={toggler === id ? {transform: 'translateX(0px)'} : {transform: 'translateX(-400px)'}}

export default function LeftSideMenu({ children, toggler, closeFunction, title, id }) { 
    return (
        <div className="sidebarLeft"
            style={toggler === id ? {width: '100%'} : {width: '0px'}}
        >
            <div className="up">
                <button id='animated' onClick={() => closeFunction(false)}>
                    <HiArrowLeft/>
                </button>
                <span>{title}</span>
            </div>
            <div className="sidebarLeft-Content">
                {children}
            </div>
        </div>
    )
}
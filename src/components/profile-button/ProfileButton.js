import { AiFillBell, AiFillDislike, AiFillStar, AiOutlineRight, BsClockHistory, FaTrash, MdLock, MdNotInterested } from "../../utils/icons";
import "../profile-button/style.scss"

export default function ProfileButton({icon, title, subtitle, lasticon, name, funct}) {
    function selectIcon(icon) {
        switch (icon) {
            case 'star':
                return <AiFillStar />
    
            case 'bell':
                return <AiFillBell />
    
            case 'tempmess':
                return <BsClockHistory />
    
            case 'keylock':
                return <MdLock style={{width: '35px', height: '20px'}}/>
    
            case 'denied':
                return <MdNotInterested />
    
            case 'dislike':
                return <AiFillDislike />
    
            case 'trash':
                return <FaTrash />
            default:
                break;
        }
    }
  
    return(
        <button className="profile-button" name={name} onClick={() => funct()}>
            <div id="button-frow">
                <div className="button-frow-start">
                    {selectIcon(icon)}
                    <div className="button-title-sub">
                        <h1 >{title}</h1>
                        <span>{subtitle}</span>
                    </div>
                </div>
                { lasticon && <AiOutlineRight />}
            </div>
        </button>
    )
}
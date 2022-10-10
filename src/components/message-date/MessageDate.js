
import './style.scss';

export default function MessageDate({date, children}) {
    return (
        <div className="date-holder">
            <span>
                {date}  
            </span>
            {children}
        </div>
    )
}
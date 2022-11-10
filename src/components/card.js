import "./style.scss";

export default function Card(props) {
    return(
        <button id={props.id} className={props.active === props.id ? 'card-active' : 'card'} onClick={props.order}>
            <img src={props.image} alt='' ></img>
            <div className="border-holder">
                <div className="mid">
                    <h1>{props.title}</h1>
                    <span>{props.content}</span>
                </div>
                <div className="end">
                    <span style={props.isMy ? {} : !props.read ? {color: 'var(--primary-green)'} : {}}>
                        {props.date}
                    </span>
                    <span className="notReaded" style={props.notReaded > 0 ? {display: 'flex'} : {display: 'none'}}>
                        {props.notReaded ?? props.notReaded}
                    </span>
                </div>
            </div>
        </button>
    )
}
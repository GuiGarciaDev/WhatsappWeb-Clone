import "./style.scss";

export default function Card({title, content, date, id, image, order, active }) {
    return(
        <button id={id} className={active === id ? 'card-active' : 'card'} onClick={order}>
            <img src={image} alt='' ></img>
            <div className="border-holder">
                <div className="mid">
                    <h1>{title}</h1>
                    <span>{content}</span>
                </div>
                <div className="end">
                    <span>{date}</span>
                </div>
            </div>
        </button>
    )
}
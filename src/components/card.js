import "./style.scss";

export default function Card({name, lastMessage, date, id, image, order}) {
    if (image === "Default") {
        image = "noImage.png";
    }

    return(
        <button id={id} className="card" onClick={order}>
            <img src={image} alt='' ></img>
            <div className="border-holder">
                <div className="mid">
                    <h1>{name}</h1>
                    <span>{lastMessage}</span>
                </div>
                <div className="end">
                    <span>{date}</span>
                </div>
            </div>
        </button>
    )
}
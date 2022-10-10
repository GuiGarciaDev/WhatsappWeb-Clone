import "./style.scss";

export default function Card({title, content, date, id, image, order, name }) {
    if (image === "Default") {
        image = "noImage.png";
    }

    return(
        <button id={id} className="card" onClick={order} name={name}>
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
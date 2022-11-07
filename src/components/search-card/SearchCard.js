import './style.scss'

export default function SearchCard({name, photoUrl, idx, order}) {
    return (
        <button id={idx} className={'search-card'} onClick={order}>
            <img src={photoUrl} alt='' ></img>
            <div className="border-holder">
                <div className="mid">
                    <h1>{name}</h1>
                </div>
            </div>
        </button>
    )
}
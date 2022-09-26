import "../profile-button/style.scss"

export default function ProfileButton({icon, title, subtitle, lasticon, red, name}) {
    const color = red ? "red" : "white";
    const opacity = red ? "0.7" : "1";
    const filter = red ? "invert(20%) sepia(85%) saturate(4295%) hue-rotate(1deg) brightness(91%) contrast(142%)" 
        : "invert(100%) sepia(0%) saturate(7484%) hue-rotate(184deg) brightness(112%) contrast(97%)";
     
    return(
        <button className="profile-button" name={name}>
            <div id="button-frow">
                <div className="button-frow-start">
                    <img src={icon} alt="" style={{filter: filter, opacity: opacity}}></img>
                    <div className="button-title-sub">
                        <h1 style={{color: color, opacity: opacity}}>{title}</h1>
                        <span>{subtitle}</span>
                    </div>
                </div>
                <img src={lasticon} alt="" style={{filter: filter}}></img>
            </div>
        </button>
    )
}
import { useState } from "react";
import "./style.scss";

export default function SearchBar({placeholder, arrowId, searchId}) {

    const [select, setSelect] = useState(true);

    function setFocus() {
        setSelect(!select);

        if (select) {
            document.getElementById(searchId).className = "hidden";
            document.getElementById(arrowId).className = "arrow-active";
        } else {
            document.getElementById(searchId).className = "search-icon-active";
            document.getElementById(arrowId).className = "hidden";
        } 
    }

    return(
        <div id="searchbar">
            <button>
                <img src="left-arrow.svg" alt=""  id={arrowId} className="hidden" onClick={() => setFocus()}></img>
            </button>
            <button id={searchId} className="active">
                <img src='search-icon.svg' alt='' onClick={() => setFocus()}></img>
            </button>
            <input id="search-input" placeholder={placeholder} onFocus={()=>setFocus()} onBlur={()=>setFocus()}></input>
        </div>
    )
}
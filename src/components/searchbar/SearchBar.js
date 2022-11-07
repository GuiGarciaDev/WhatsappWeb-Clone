import "./style.scss";
import { useState } from "react";

import { HiArrowLeft } from 'react-icons/hi';
import { BsSearch } from 'react-icons/bs';
import Search from "../search/Search";

export default function SearchBar({placeholder, arrowId, searchId, order}) {

    const [select, setSelect] = useState(false);
    const [value, setValue] = useState('')

    return(
        <>
            <div id="searchbar"> 
                <button id={arrowId} onClick={() => setSelect(false)} style={select ? {display: 'flex'} : {display: 'none'}}>
                    <HiArrowLeft className="arrow-icon"/>
                </button>
                
                <button id={searchId} onClick={() => setSelect(true)} style={select ? {display: 'none'} : {display: 'flex'}}>
                    <BsSearch className="search-icon"/>   
                </button>
                
                <input id="search-input" placeholder={placeholder} onFocus={()=>setSelect(true)} 
                onBlur={()=>setSelect(false)} autoComplete='off' onChange={(e) => setValue(e.target.value)}
                />
            </div>

            <Search value={value} order={order}/>
        </>
    )
}
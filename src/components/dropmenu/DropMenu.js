import { useRef, useEffect } from "react";

export default function DropMenu({classname, children, toggler, order, id}) {
    const wrapperRef = useRef(null);

    useEffect(() => {
        /**
         * Alert if clicked on outside of element
         */
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                if (event.path[0].tagName !== 'BUTTON' && event.path[0].tagName !== 'IMG') {
                    order(null); // Make it close when clicked in the svg of cardMessage
                }
            }
        }
        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef, order]);
      

    return (
        <div className={classname} ref={wrapperRef} id={id} style={toggler === id ? {display: 'flex'} : {display: 'none'}}>
            {children}
        </div>
    )
}
import "./style.scss";
import { motion } from "framer-motion";

export default function Contact(props) {
    return(
        <motion.button id={props.id} className={props.active === props.id ? 'card-active' : 'card'} 
            key={props.id}
            onClick={props.order}
            initial={{opacity: 0}}
            animate={{opacity: 1}}
        >
            <img src={props.image} alt='' ></img>
            <div className="border-holder">
                <div className="mid">
                    <h1>{props.title}</h1>
                    <span>{props.content}</span>
                </div>
            </div>
        </motion.button>
    )
}
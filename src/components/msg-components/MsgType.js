import MessageCard from "./message-card/MessageCard";


export default function MsgType ({ el, id, chatId }) {
    switch (el.type) {
        case 'text':
            return <MessageCard el={el} id={id} chatId={chatId}/>;
        case 'img':
            
        break;
        case 'rep':
        
        break;
    
        default:
            break;
    }
}
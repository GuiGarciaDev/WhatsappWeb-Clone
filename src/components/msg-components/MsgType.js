import ContactCard from "./contact-card/ContactCard";
import FileCard from "./file-card/FileCard";
import ImageCard from "./img-card/ImageCard";
import MessageCard from "./message-card/MessageCard";
import RepCard from "./rep-card/RepCard";


export default function MsgType ({ el, id, chatId }) {
    switch (el.type) {
        case 'text':
            return <MessageCard el={el} id={id} chatId={chatId}/>
        case 'img':
            return <ImageCard el={el} id={id} chatId={chatId}/>
        case 'pdf':
            return <FileCard el={el} id={id} chatId={chatId} type={'pdf'}/>
        case 'doc':
            return <FileCard el={el} id={id} chatId={chatId} type={'doc'}/>
        case 'rep':
            return <RepCard el={el} id={id} chatId={chatId}/>
        case 'contact':
            return <ContactCard el={el} id={id} chatId={chatId}/>
        case 'sticker':
            return <></>
        default:
            break;
    }
}

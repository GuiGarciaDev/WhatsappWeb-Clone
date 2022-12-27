import './style.scss';

export default function ConfigCard({ children, title, action }) {
    return (
        <button className='config-card' onClick={action}>
            {children}
            <span>{title}</span>
        </button>
    )
}
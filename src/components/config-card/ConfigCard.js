import './style.scss';

export default function ConfigCard({ children, title, action }) {
    return (
        <button className='config-card' onClick={() => action('Undefined')}>
            {children}
            <span>{title}</span>
        </button>
    )
}
import './style.scss';

export default function ConfigCard({ children, title }) {
    return (
        <div className='config-card'>
            {children}
            <span>{title}</span>
        </div>
    )
}
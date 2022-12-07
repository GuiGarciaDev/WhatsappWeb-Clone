import './style.scss';

export default function CustomCheckBox({id, value, onChange}) {
    return (
        <div className='checkbox-holder'>
            <input id={id} type="checkbox" value={value} onChange={onChange}></input>
        </div>
    )
}
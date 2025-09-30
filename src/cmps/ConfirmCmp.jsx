export function ConfirmCmp({ header = '', mainTxt = '', onSave = ()=>{}, onClose = ()=>{} }) {

    return (
        <div className="confirm-cmp">
            <header>{header}</header>
            <main>{mainTxt}</main>
            <button className="confirm" onClick={onSave}>Delete</button>
            <button className="un-confirm" onClick={onClose}>Cancel</button>
        </div>
    )
}
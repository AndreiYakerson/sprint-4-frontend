import { useEffect } from "react"
import { SvgIcon } from "./SvgIcon"

export function CmpList({ cmps, onAddColumn, onClose }) {

    const fullCmpList = ['status', 'members', 'priority', 'date']

    useEffect(() => {
        return () => onClose()
    }, [])

    function selectCmp(cmp) {
        onAddColumn(cmp)
        onClose()
    }

    if (cmps.length === fullCmpList.length) return <div className="cmp-list">No more columns to add</div>

    return (
        <div className="cmp-list">

            {fullCmpList.map(cmp => {
                if (cmps.includes(cmp)) return null

                return <button key={cmp} className="cmp-preview btn" onClick={() => selectCmp(cmp)}>

                    {cmp === 'priority' ? <img className="monday-column-icon-component__icon" src="https://files.monday.com/euc1/photos/10162286/original/app_version_10162286_photo_2023_10_26_13_37_04.png?1760734649366" alt=""></img>
                        : <SvgIcon
                            iconName={cmp}
                            size={20}
                            colorName={cmp}
                        />}
                    <p>{cmp}</p>
                </button>
            })}
        </div>
    )
}
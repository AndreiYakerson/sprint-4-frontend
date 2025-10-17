import { SvgIcon } from "./SvgIcon"

export function CmpList({ cmps, onClose }) {

    const fullCmpList = ['status', 'members', 'priority', 'due date']

    return (
        <div className="cmp-list">
            {fullCmpList.map(cmp => {
                if (cmps.includes(cmp)) return null

                return <div key={cmp} className="cmp-preview">
                    
                    <SvgIcon
						iconName='status'
						size={20}
                        colorName="status"
					/>
                    <p>{cmp}</p>
                </div>
            })}
        </div>
    )
}
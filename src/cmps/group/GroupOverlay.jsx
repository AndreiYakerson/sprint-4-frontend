import { SvgIcon } from "../SvgIcon";

export function GroupOverlay({ group }) {
    return <div className="group-overlay" style={{ ...group.style }}>
        <div className="collapse-group-toggle">
            <SvgIcon
                iconName="chevronRight"
                size={22}
                colorName={'currentColor'}
            />
        </div>
        <div className="group-title-wrapper" style={{...group.style}}>{group.title}</div>

    </div>
}
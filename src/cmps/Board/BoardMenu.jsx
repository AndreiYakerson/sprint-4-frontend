import { SvgIcon } from "../SvgIcon.jsx"

export function BoardMenu({
    style, menuRef, onCloseMenu, onOpenInNewTab, toggleIsStarred, isStarred, onRemoveBoard, onRenameBoard }) {

    return (<div className="board-menu" style={{ ...style }} ref={menuRef}>
        <ul className="actions-list">
            <li className="menu-action" onClick={() => { onCloseMenu(), onOpenInNewTab() }}>
                <SvgIcon iconName="newTab" size={18} colorName="secondaryText" />
                <span>open in new tab</span>
            </li>
            <div className="hr"></div>
            <li className="menu-action" onClick={() => { onCloseMenu(), onRenameBoard(true) }}>
                <SvgIcon iconName="pen" size={18} colorName="secondaryText" />
                <span>Rename</span>
            </li>
            <li className="menu-action" onClick={() => { onCloseMenu(), toggleIsStarred() }}>
                <SvgIcon iconName="star" size={18} colorName="secondaryText" />
                <span>{isStarred ? "Remove from favorites" : " Add to favorites"}</span>
            </li>
            <div className="hr"></div>
            <li className="menu-action" onClick={() => { onCloseMenu(), onRemoveBoard() }}>
                <SvgIcon iconName="trash" size={18} colorName="secondaryText" />
                <span>Delete</span>
            </li>
        </ul>
    </div >)
}
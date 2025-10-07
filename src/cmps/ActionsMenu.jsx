import { SvgIcon } from "./SvgIcon.jsx"

export function ActionsMenu({ style,
    menuRef,
    onCloseMenu,
    //
    onOpenInNewTab,
    onToggleIsItemOpen,
    isItemOpen,
    toggleIsStarred,
    isStarred,
    onRemoveItem,
    onDuplicateItem,
    onRenameBoard

}) {

    return (<div className="actions-menu" style={{ ...style }} ref={menuRef}>
        <ul className="actions-list">
            {onOpenInNewTab && <li className="menu-action" onClick={() => { onCloseMenu(), onOpenInNewTab() }}>
                <SvgIcon iconName="newTab" size={18} colorName="secondaryText" />
                <span>Open in new tab</span>
            </li>}
            {onToggleIsItemOpen && <li className="menu-action" onClick={() => { onCloseMenu(), onToggleIsItemOpen() }}>
                <SvgIcon iconName="open" size={18} colorName="secondaryText" />
                <span>{isItemOpen ? "Close item" : "Open item"}</span>
            </li>}

            <div className="hr"></div>

            {onRenameBoard && <li className="menu-action" onClick={() => { onCloseMenu(), onRenameBoard(true) }}>
                <SvgIcon iconName="pen" size={18} colorName="secondaryText" />
                <span>Rename</span>
            </li>}
            {toggleIsStarred && <li className="menu-action" onClick={() => { onCloseMenu(), toggleIsStarred() }}>
                <SvgIcon iconName="star" size={18} colorName="secondaryText" />
                <span>{isStarred ? "Remove from favorites" : " Add to favorites"}</span>
            </li>}
            {onDuplicateItem && <li className="menu-action" onClick={() => { onCloseMenu(), onDuplicateItem() }}>
                <SvgIcon iconName="pen" size={18} colorName="secondaryText" />
                <span>Duplicate</span>
            </li>}

            <div className="hr"></div>

            {onRemoveItem && <li className="menu-action" onClick={() => { onCloseMenu(), onRemoveItem() }}>
                <SvgIcon iconName="trash" size={18} colorName="secondaryText" />
                <span>Delete</span>
            </li>}
        </ul>
    </div >)
}
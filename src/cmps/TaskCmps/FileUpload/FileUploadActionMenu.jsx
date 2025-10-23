import { useEffect } from "react"
import { SvgIcon } from "../../SvgIcon"

export function FileUploadActionMenu({
    style,
    menuRef,
    onCloseMenu,
    //
    addFromFolder
    // isHrShown = false
}) {

    useEffect(() => {
        return () => onCloseMenu()
    }, [])


    return (<div className="actions-menu file-add" style={{ ...style }} ref={menuRef}>
        <ul className="actions-list">
            
         {addFromFolder &&  <li className="menu-action file-add" onClick={() => { onCloseMenu(), addFromFolder() }}>
                <SvgIcon iconName="paperClip" size={18} colorName="secondaryText" />
                <span>From Computer</span>
            </li>}

        </ul>
    </div >)
}
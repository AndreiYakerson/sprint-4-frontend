import { useState } from "react"
import person from '/icons/person.svg'
import { FloatingContainerCmp } from "../FloatingContainerCmp"



export function PeopleCmp() {
    const [anchorEl, setAnchorEl] = useState(null)
    console.log("🚀 ~ PeopleCmp ~ anchorEl:", anchorEl)

    return (
        <div onClick={(ev) => setAnchorEl(ev.currentTarget)} className="people-cmp">
            <img src={person} className="icon big hover-show" alt="person icon" />
            {anchorEl &&
                <FloatingContainerCmp
                    anchorEl={anchorEl}
                    onClose={() => setAnchorEl(null)}
                >
                </FloatingContainerCmp>}
        </div>
    )
}
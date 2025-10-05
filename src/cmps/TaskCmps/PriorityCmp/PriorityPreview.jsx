import { useState } from "react";
import { FloatingContainerCmp } from "../../FloatingContainerCmp";
import { PrioritySelect } from "./PrioritySelect";

export function PriorityPreview() {
    const [anchorEl, setAnchorEl] = useState()
    return (
        <div className="priority-preview"
            onClick={(ev) => setAnchorEl(ev.currentTarget)}>
            {anchorEl &&
                <FloatingContainerCmp
                    anchorEl={anchorEl}
                    onClose={() => setAnchorEl(null)}>
                    <PrioritySelect onClose={() => setAnchorEl(null)} />
                </FloatingContainerCmp>}
        </div>
    )

}
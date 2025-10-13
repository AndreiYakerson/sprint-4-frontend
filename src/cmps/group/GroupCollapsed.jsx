import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { SvgIcon } from "../SvgIcon"

export function GroupCollapsed({ group, groupsLength }) {

    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: group.id, disabled: groupsLength < 2 })

    const style = {
        transition: transition,
        transform: CSS.Transform.toString(transform),
    }

    return <div
        className="group-collapsed"
        ref={setNodeRef}
        {...attributes}
        style={{
            ...style,
            ...group.style,
            // opacity: isDragging ? 0.5 : 1,
            zIndex: isDragging ? 10 : 'auto',
        }}
    >
        <div className="group-collapsed-content">
            <div className="collapse-group-toggle">
                <SvgIcon
                    iconName="chevronRight"
                    size={22}
                    colorName={'currentColor'}
                />
            </div>
            <div className="group-info">
                <div className="group-title-wrapper">{group.title}</div>
                <div>{!group.tasks.length ? 'No' : group.tasks.length} Tasks</div>
            </div>
        </div>
    </div>
}
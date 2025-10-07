import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

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
            opacity: isDragging ? 0.7 : 1,
            zIndex: isDragging ? 10 : 'auto',
            translate: '20px'
        }}
    >
        <div className="group-collapsed-content">
            {/* <div className="fold-icon">{'>'}</div> */}
            <div className="group-title">{group.title}</div>
            <div>{!group.tasks.length ? 'No' : group.tasks.length} Tasks</div>
        </div>
    </div>
}
// dnd kit
import { useRef, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// cmps
import { SvgIcon } from "../SvgIcon";
import { TitleEditor } from "../Task/TitleEditor.jsx";
import { GroupTitleEditor } from "./GroupTitleEditor.jsx";
import { FloatingContainerCmp } from "../FloatingContainerCmp.jsx";
import { ActionsMenu } from "../ActionsMenu.jsx";

export function GroupPreview({ group, groupsLength, managingType, TaskList,
    onRemoveGroup, onUpdateGroup, onAddTask, onAddGroup, onOpenGroupEditor }) {

    // dnd kit
    const { attributes, listeners, setNodeRef,
        transform, transition, isDragging } = useSortable({ id: group.id, disabled: groupsLength < 2 })

    const style = {
        transition: transition,
        transform: CSS.Transform.toString(transform),
    }


    //menu 
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const btnRef = useRef(null)
    const menuRef = useRef(null)

    function toggleIsMenuOpen(ev) {
        ev.stopPropagation()
        setIsMenuOpen(!isMenuOpen)
    }

    function onCloseMenu() {
        setIsMenuOpen(false)
    }
    // crudl

    const demoColumns = ["Status", "Priority", "Members", "Date"];

    const [groupInfoToEdit, setGroupInfoToEdit] = useState({
        groupId: group?.id,
        title: group?.title,
        color: group?.style['--group-color'],
        style: group?.style
    })

    async function onSetGroupToUpdate(group, newVals) {
        const prevGroupInfo = { ...groupInfoToEdit }

        setGroupInfoToEdit(prev => ({ ...prev, ...newVals, color: style['--group-color'] }))

        const groupToUpdate = { ...structuredClone(group), ...newVals }

        try {
            await onUpdateGroup(groupToUpdate)
        } catch (err) {
            setGroupInfoToEdit(prevGroupInfo)
        }
    }



    return <div
        className="group-container"
        ref={setNodeRef}
        {...attributes}
        style={{
            ...style,
            ...groupInfoToEdit?.style,
            opacity: isDragging ? 0.5 : 1,
            zIndex: isDragging ? 10 : 'auto',
        }}
    >
        <header
            className="group-header"
        >
            <div className="group-title-row">
                <div className="group-menu-wrapper">
                    <button onClick={toggleIsMenuOpen} className={`white group-menu ${isMenuOpen ? "menu-open" : ""}`} ref={btnRef}>
                        <SvgIcon
                            iconName="dots"
                            size={22}
                            colorName={'primaryText'}
                        />
                    </button>

                    {isMenuOpen && <FloatingContainerCmp anchorEl={btnRef.current} onClose={onCloseMenu}>
                        <ActionsMenu
                            menuRef={menuRef}
                            onCloseMenu={onCloseMenu}
                            onRemoveGroup={() => onRemoveGroup(group?.id)}
                            groupsLength={groupsLength}
                            onAddGroup={onAddGroup}
                            onRenameGroup={() => onOpenGroupEditor(group?.id)}
                        />
                    </FloatingContainerCmp>}

                </div>
                <div className="collapse-group"></div>
                <div className="group-title-wrapper flex" >
                    <GroupTitleEditor
                        info={groupInfoToEdit}
                        onUpdate={(newVals) => onSetGroupToUpdate(group, newVals)}
                    />
                </div>
                <div className="task-count" {...listeners}>
                    {group?.tasks?.length > 0 ? `${group?.tasks?.length} Tasks`
                        : 'No Tasks'}
                </div>
                <div className="temporary-white-block" {...listeners}></div>
            </div>
            <div className="temporary-white-block" {...listeners}></div>




            <div className="table-row table-header">
                <div className="sticky-cell-wrapper">
                    <div className="task-menu-wrapper"></div>
                    <div className="table-border"></div>
                    <div className="task-select"></div>
                    <div className="task-title">{managingType}</div>
                </div>

                <div className="task-columns flex">
                    {demoColumns.map((colName) => {
                        return (
                            <div key={colName} className="column-cell">
                                <span>{colName}</span>
                            </div>
                        );
                    })}
                    <div className="column-cell full"></div>
                </div>

            </div>
        </header>

        <TaskList tasks={group.tasks} groupId={group.id} />

        <div className="table-row">
            <div className="sticky-cell-wrapper">
                <div className="task-menu-wrapper"></div>
                <div className="table-border"></div>
                <div className="task-select"></div>
                <div className="add-task-cell">
                    <TitleEditor info={{ label: 'Title:', propName: 'title', placeholder: `+ Add ${managingType}` }}
                        onUpdate={(title) => onAddTask(group?.id, title)} />
                </div>
            </div>

            <div className="task-columns flex">
                <div className="column-cell full"></div>
            </div>
        </div>

        <div className="table-row sum-row">
            <div className="sticky-cell-wrapper">
                <div className="border-radius-block">
                    <span></span>
                </div>
            </div>

            <div className="task-columns flex">
                {demoColumns.map(colName => {
                    return <div key={colName} className="column-cell">
                        <span></span>
                    </div>
                })}
                <div className="column-cell full"></div>
            </div>
        </div>

    </div>
}
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
import { LabelSum } from "../TaskCmps/SumCmps/LabelSum.Jsx";
import { DateSum } from "../TaskCmps/SumCmps/DateSum.jsx";

export function GroupPreview({ group, groupsLength, managingType, TaskList,
    onRemoveGroup, onUpdateGroup, onAddTask, onAddGroup, onOpenGroupEditor }) {

    // dnd kit
    const { attributes, listeners, setNodeRef,
        transform, transition, isDragging } = useSortable({ id: group.id, disabled: groupsLength < 2 })

    const style = {
        transition: transition,
        transform: CSS.Transform.toString(transform),
    }

    const [isCollapsed, setIscollapsed] = useState(group?.isCollapsed)

    async function onToggleCollapsed(isCollapsed) {

        setIscollapsed(isCollapsed)

        const groupToUpdate = { ...structuredClone(group), isCollapsed: isCollapsed }
        try {
            await onUpdateGroup(groupToUpdate)
        } catch (err) {
            setIscollapsed(!isCollapsed)
        }
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

    const demoColumns = ["Status", "Priority", "Members", "Due Date"];

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

    // sum data

    const statuses = group?.tasks.map(t => {
        if (!t?.status) {
            return { id: 'default', txt: 'Not Started', cssVar: '--group-title-clr18' }
        } else {
            return t.status
        }
    })


    const priorities = group?.tasks.map(t => {
        if (!t?.priority) {
            return { txt: 'Default Label', cssVar: '--group-title-clr18', id: 'Default' }
        } else {
            return t.priority
        }
    })

    const dates = group?.tasks.map(t => t?.dueDate?.date).filter(d => d).sort()


    /////  Collapsed group /////

    if (isCollapsed) return <section
        className="group-container individual-collapse"
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
            <div className="table-row table-header" {...listeners}>

                <div className="group-title-row" >
                    <div className="group-bar">
                        <div className="group-menu-wrapper">

                            <button onClick={toggleIsMenuOpen}
                                className={`white group-menu ${isMenuOpen ? "menu-open" : ""}`}
                                ref={btnRef}>

                                <SvgIcon
                                    iconName="dots"
                                    size={22}
                                    colorName={'primaryText'}
                                />

                            </button>

                            {isMenuOpen && <FloatingContainerCmp
                                anchorEl={btnRef.current}
                                onClose={onCloseMenu}
                                offsetX={40}
                                offsetY={35}
                                enforceLimit={true}
                            >
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
                    </div>
                    <div className="collapse-group-toggle" onClick={() => onToggleCollapsed(false)}>
                        <SvgIcon
                            iconName={isCollapsed ? "chevronRight" : "chevronDown"}
                            size={22}
                            colorName={'currentColor'}
                        />
                    </div>
                    <div className="group-title-wrapper flex" >
                        <GroupTitleEditor
                            info={groupInfoToEdit}
                            onUpdate={(newVals) => onSetGroupToUpdate(group, newVals)}
                        />
                    </div>

                    <div className="task-count-wrapper">
                        <div></div>
                        <span className="task-count" >
                            {group?.tasks?.length > 0 ? `${group?.tasks?.length} Tasks`
                                : 'No Tasks'}
                        </span>
                    </div>

                </div>

                <div className="task-columns flex">
                    {demoColumns.map(colName => {
                        if (colName === 'Due Date') {
                            return <div key={colName} className="column-cell">
                                <div>{colName}</div>
                                <DateSum dates={dates} />
                            </div>
                        } else if (colName === 'Status') {
                            return <div key={colName} className="column-cell">
                                <div>{colName}</div>
                                <LabelSum labels={statuses} />
                            </div>
                        } else if (colName === 'Priority') {
                            return <div key={colName} className="column-cell">
                                <div>{colName}</div>
                                <LabelSum labels={priorities} />
                            </div>
                        } else {
                            return <div key={colName} className="column-cell">
                                <div>{colName}</div>
                                <span></span>
                            </div>
                        }

                    })}
                    <div className="column-cell full"></div>
                </div>
            </div>
        </header>
    </section >

    /////  group  /////

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
            <div className="group-title-row" {...listeners}>
                <div className="group-menu-wrapper">
                    <button onClick={toggleIsMenuOpen} className={`white group-menu ${isMenuOpen ? "menu-open" : ""}`} ref={btnRef}>
                        <SvgIcon
                            iconName="dots"
                            size={22}
                            colorName={'primaryText'}
                        />
                    </button>

                    {isMenuOpen && <FloatingContainerCmp
                        anchorEl={btnRef.current}
                        onClose={onCloseMenu}
                        offsetX={40}
                        offsetY={35}
                        enforceLimit={true}
                    >
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
                <div className="collapse-group-toggle" onClick={() => onToggleCollapsed(true)}>
                    <SvgIcon
                        iconName={isCollapsed ? "chevronRight" : "chevronDown"}
                        size={22}
                        colorName={'currentColor'}
                    />
                </div>
                <div className="group-title-wrapper flex" >
                    <GroupTitleEditor
                        info={groupInfoToEdit}
                        onUpdate={(newVals) => onSetGroupToUpdate(group, newVals)}
                    />
                </div>
                <div className="task-count" >
                    {group?.tasks?.length > 0 ? `${group?.tasks?.length} Tasks`
                        : 'No Tasks'}
                </div>
                <div className="temporary-white-block" ></div>
            </div>
            <div className="temporary-white-block"></div>


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
                <div className="task-menu-wrapper"></div>
                <div className="border-radius-block">
                    <span></span>
                </div>
            </div>

            <div className="task-columns flex">
                {demoColumns.map(colName => {
                    if (colName === 'Due Date') {
                        return <div key={colName} className="column-cell">
                            <DateSum dates={dates} />
                        </div>
                    } else if (colName === 'Status') {
                        return <div key={colName} className="column-cell">
                            <LabelSum labels={statuses} />
                        </div>
                    } else if (colName === 'Priority') {
                        return <div key={colName} className="column-cell">
                            <LabelSum labels={priorities} />
                        </div>
                    } else {
                        return <div key={colName} className="column-cell">
                            <span></span>
                        </div>
                    }

                })}
                <div className="column-cell full"></div>
            </div>
        </div>

    </div>
}
// dnd kit
import { useEffect, useRef, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// cmps
import { SvgIcon } from "../SvgIcon";
import { TitleEditor } from "../Task/TitleEditor.jsx";
import { GroupTitleEditor } from "./GroupTitleEditor.jsx";
import { ActionsMenu } from "../ActionsMenu.jsx";
import { LabelSum } from "../TaskCmps/SumCmps/LabelSum.Jsx";
import { DateSum } from "../TaskCmps/SumCmps/DateSum.jsx";
import { getColumnType } from "../../services/util.service.js";
import { useSelector } from "react-redux";
import { CmpList } from "../CmpList.jsx";
import { IndividualGroupCollapse } from "./IndividualGroupCollapse.jsx";
import { useSearchParams } from "react-router-dom";
import { FloatingContainerCmp } from "../FloatingContainerCmp.jsx";

export function GroupPreview({ group, groupsLength, managingType, TaskList,
    onRemoveGroup, onUpdateGroup, onAddTask, onAddGroup, onOpenGroupEditor, onAddColumn, onRemoveColumn }) {

    const [searchParams] = useSearchParams();

    // dnd kit
    const { attributes, listeners, setNodeRef,
        transform, transition, isDragging } = useSortable({ id: group.id, disabled: searchParams.size > 0 })

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
    const [isGroupMenuOpen, setIsGroupMenuOpen] = useState(false)
    const [elColumnMenu, setIsElColumnMenu] = useState(null)
    const [columnType, setcolumnType] = useState('')
    const [anchorEl, setAnchorEl] = useState(null)


    const btnRef = useRef(null)
    const menuRef = useRef(null)
    const columnBtnRef = useRef(null)


    function toggleIsGroupMenuOpen(ev) {
        ev.stopPropagation()
        setIsGroupMenuOpen(!isGroupMenuOpen)
    }

    function toggleIsColumnMenuOpen(ev, colname) {
        ev.stopPropagation()
        setIsElColumnMenu(elColumnMenu ? null : ev.currentTarget)

        if (!columnType) {
            setcolumnType(colname)
        } else {
            setcolumnType('')
        }
    }

    function onCloseMenu() {
        if (isGroupMenuOpen) {
            setIsGroupMenuOpen(false)
        }
        if (elColumnMenu) {
            setIsElColumnMenu(null)
            setcolumnType('')
        }
    }

    function onCloseCmpList() {
        setAnchorEl(null)
    }
    // crudl

    const board = useSelector(state => state.boardModule.board)

    const cmpOrder = board.cmpOrder

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

    const groupCopy = structuredClone(group)

    const statuses = groupCopy?.tasks.map(t => {
        if (!t?.status) {
            return { id: 'default', txt: 'Not Started', cssVar: '--group-title-clr18' }
        } else {
            return t.status
        }
    })


    const priorities = groupCopy?.tasks.map(t => {
        if (!t?.priority) {
            return { txt: 'Default Label', cssVar: '--group-title-clr18', id: 'Default' }
        } else {
            return t.priority
        }
    })

    const dates = groupCopy?.tasks.map(t => t?.dueDate?.date).filter(d => d).sort()


    /// resize columns

    const isResizing = useRef(false)
    const startX = useRef(0)
    const startWidth = useRef(0)
    const currentColName = useRef("")

    useEffect(() => {
        return (() => {
            document.removeEventListener("mousemove", handleMouseMove)
            document.removeEventListener("mouseup", handleMouseUp)
        })
    }, [])

    function handleMouseDown(e, colName) {
        isResizing.current = true
        startX.current = e.pageX
        currentColName.current = colName === 'date' ? 'due-date' : colName

        if (colName === 'item') {
            document.querySelectorAll(`.sticky-cell-wrapper`)
                .forEach(el => el.classList.add("highlight"))
        } else {
            document.querySelectorAll(`.column-cell.${currentColName.current}`)
                .forEach(el => el.classList.add("highlight"))
        }

        const colElement = e.target.parentElement
        startWidth.current = colName === 'item' ? colElement.offsetWidth + 36 : colElement.offsetWidth

        console.log('colElement.offsetWidth:', colElement.offsetWidth)
        console.log('startWidth.current:', startWidth.current)

        document.addEventListener("mousemove", handleMouseMove)
        document.addEventListener("mouseup", handleMouseUp)
    }

    function handleMouseMove(e) {
        if (!isResizing.current) return

        const root = document.documentElement
        const newWidth = startWidth.current + (e.pageX - startX.current)
        const varName = `--${currentColName.current}-column`
        // console.log('after:', startWidth.current)
        // console.log('newWidth:', newWidth)

        if (newWidth <= 250 && currentColName.current === 'item') {
            console.log('stop:')
            return
        } else if (newWidth <= 60) {
            console.log('stop:')
            return
        }

        root.style.setProperty(varName, `${newWidth}px`)
    }

    function handleMouseUp() {
        isResizing.current = false

        if (currentColName.current === 'item') {
            document.querySelectorAll(`.sticky-cell-wrapper`)
                .forEach(el => el.classList.remove("highlight"))
        } else {
            document.querySelectorAll(`.column-cell.${currentColName.current}`)
                .forEach(el => el.classList.remove("highlight"))
        }

        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
    }


    ///////////////////////////////////  Collapsed group ///////////////////////////////


    if (isCollapsed)
        return (
            <IndividualGroupCollapse
                group={group}
                groupInfoToEdit={groupInfoToEdit}
                style={style}
                isDragging={isDragging}
                cmpOrder={cmpOrder}
                statuses={statuses}
                priorities={priorities}
                dates={dates}
                btnRef={btnRef}
                menuRef={menuRef}
                isGroupMenuOpen={isGroupMenuOpen}
                onCloseMenu={onCloseMenu}
                toggleIsGroupMenuOpen={toggleIsGroupMenuOpen}
                onOpenGroupEditor={onOpenGroupEditor}
                onRemoveGroup={onRemoveGroup}
                onAddGroup={onAddGroup}
                onToggleCollapsed={onToggleCollapsed}
                setNodeRef={setNodeRef}
                attributes={attributes}
                listeners={listeners}
                isCollapsed={isCollapsed}
                groupsLength={groupsLength}
                onSetGroupToUpdate={onSetGroupToUpdate}
            />
        )

    ///////////////////////////////  group  /////////////////////////////////

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
                    <button onClick={toggleIsGroupMenuOpen}
                        className={`white group-menu ${isGroupMenuOpen ? "menu-open" : ""}`}
                        ref={btnRef}>
                        <SvgIcon
                            iconName="dots"
                            size={22}
                            colorName={'primaryText'}
                        />
                    </button>

                    {isGroupMenuOpen && <FloatingContainerCmp
                        anchorEl={btnRef.current}
                        onClose={onCloseMenu}
                        offsetX={40}
                        offsetY={35}
                        enforceLimit={true}
                    >
                        <ActionsMenu
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
                    <div className="task-title">
                        <span>{managingType}</span>
                    </div>
                    <div
                        className="resize-btn"
                        onMouseDown={(ev) => handleMouseDown(ev, 'item')}
                    ></div>
                </div>

                <div className="task-columns flex">
                    {cmpOrder.map((colName) => (
                        <div key={colName} className={`column-cell ${getColumnType(colName)}`}>
                            <span>{colName}</span>

                            <button
                                className={` transparent column-menu-btn ${elColumnMenu && columnType === colName ? "open" : ""}`}
                                key={colName}
                                ref={columnBtnRef}
                                onClick={(ev) => toggleIsColumnMenuOpen(ev, colName)}>
                                <SvgIcon
                                    iconName="dots"
                                    size={22}
                                    colorName={'secondaryText'}
                                />
                            </button>

                            <div
                                className="resize-btn"
                                onMouseDown={(ev) => handleMouseDown(ev, colName)}
                            ></div>
                        </div>
                    ))}

                    <div className="column-cell full last-column">
                        <button
                            className={`add-column ${anchorEl ? 'rotate' : ''}`}
                            onClick={(ev) => setAnchorEl(ev.currentTarget)}

                        >
                            <SvgIcon
                                iconName="plus"
                                size={18}
                                colorName={'secondaryText'}
                            />
                        </button>
                        {anchorEl &&
                            <FloatingContainerCmp
                                anchorEl={anchorEl}
                                enforceLimit={true}
                                centeredX={true}
                                onClose={onCloseCmpList}
                            >
                                <CmpList
                                    cmps={board.cmpOrder}
                                    onClose={onCloseCmpList}
                                    onAddColumn={onAddColumn}
                                />

                            </FloatingContainerCmp>
                        }
                    </div>
                </div>

            </div>
        </header >

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
                {cmpOrder.map(colName => {
                    if (colName === 'date') {
                        return <div key={colName} className="column-cell due-date">
                            <DateSum dates={dates} />
                        </div>
                    } else if (colName === 'status') {
                        return <div key={colName} className="column-cell status">
                            <LabelSum info={{ labels: statuses, type: 'status' }} />
                        </div>
                    } else if (colName === 'priority') {
                        return <div key={colName} className="column-cell priority">
                            <LabelSum info={{ labels: priorities, type: 'priority' }} />
                        </div>
                    } else {
                        return <div key={colName} className={`column-cell ${getColumnType(colName)}`}>
                            <span></span>
                        </div>
                    }

                })}
                <div className="column-cell full"></div>
            </div>
        </div>


        {elColumnMenu && <FloatingContainerCmp
            anchorEl={elColumnMenu}
            onClose={onCloseMenu}
            offsetX={30}
            offsetY={45}
        >
            <ActionsMenu
                onCloseMenu={onCloseMenu}
                isHrShown={false}
                onRemoveItem={() => onRemoveColumn(columnType)}
            />
        </FloatingContainerCmp>
        }

    </div >
}


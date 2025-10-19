// cmps
import { SvgIcon } from "../SvgIcon"
import { FloatingContainerCmp } from "../FloatingContainerCmp.jsx"
import { ActionsMenu } from "../ActionsMenu.jsx"
import { GroupTitleEditor } from "./GroupTitleEditor.jsx"
import { LabelSum } from "../TaskCmps/SumCmps/LabelSum.jsx"
import { DateSum } from "../TaskCmps/SumCmps/DateSum.jsx"
import { getColumnType } from "../../services/util.service.js"

export function IndividualGroupCollapse({
    group,
    groupInfoToEdit,
    style,
    isDragging,
    cmpOrder,
    statuses,
    priorities,
    dates,
    btnRef,
    menuRef,
    isGroupMenuOpen,
    onCloseMenu,
    toggleIsGroupMenuOpen,
    onOpenGroupEditor,
    onRemoveGroup,
    onAddGroup,
    onToggleCollapsed,
    setNodeRef,
    attributes,
    listeners,
    isCollapsed,
    groupsLength,
    onSetGroupToUpdate
}) {
    return (
        <section
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
                        {cmpOrder.map(colName => {
                            if (colName === 'date') {
                                return <div key={colName} className="column-cell due-date">
                                    <div>{colName}</div>
                                    <DateSum dates={dates} />
                                </div>
                            } else if (colName === 'status') {
                                return <div key={colName} className="column-cell status">
                                    <div>{colName}</div>
                                    <LabelSum info={{ labels: statuses, type: 'status' }} />
                                </div>
                            } else if (colName === 'priority') {
                                return <div key={colName} className="column-cell priority">
                                    <div>{colName}</div>
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
            </header>
        </section >
    )
}
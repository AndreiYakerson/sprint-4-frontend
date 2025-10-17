
import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useSelector } from 'react-redux'

// services
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
import { addGroup, addTask, loadBoard, setBoardRemovedMsg } from '../store/actions/board.actions.js'

// cmps
import { GroupList } from '../cmps/group/GroupList.jsx'
import { TaskDetails } from '../cmps/Task/TaskDetails.jsx'
import { SvgIcon } from '../cmps/SvgIcon.jsx'
import { BoardRemovedMsg } from '../cmps/Board/BoardRemovedMsg.jsx'
import { AppLoader } from '../cmps/AppLoader.jsx'
import { MultiMemberImage } from '../cmps/MultiMemberImage.jsx'
import { HoveredTextCmp } from '../cmps/HoveredTextCmp.jsx'
import { FloatingContainerCmp } from '../cmps/FloatingContainerCmp.jsx'
import { onSetHighLightedTxt, onSetPopUp } from '../store/actions/system.actions.js'
import { FilterBy } from '../cmps/Board/filterCmps/FilterBy.jsx'
import { boardService } from '../services/board/index.js'
import { PersonFilter } from '../cmps/Board/filterCmps/PersonFilter.jsx'
import { InviteByMail } from '../cmps/BoardActionsNav/InviteByMail.jsx'
import { SortBy } from '../cmps/Board/filterCmps/SortBy.jsx'
<<<<<<< HEAD
import { PopUp } from '../cmps/PopUp.jsx'
=======
import { cleanSearchParams } from '../services/util.service.js'

// img
import noResults from '/img/no-results.svg'

>>>>>>> origin/main


export function BoardDetails() {
    const [anchorEl, setAnchorEl] = useState(false)
    const navigate = useNavigate()

    const { boardId, taskId } = useParams()

    const isAppLoading = useSelector(state => state.systemModule.isAppLoading)
    const board = useSelector(storeState => storeState.boardModule.board)
    const filterOptions = useSelector(storeState => storeState.boardModule.filterOptions)
    const boardRemovedMsg = useSelector(storeState => storeState.boardModule.boardRemovedMsg)

    const [searchAnchor, setSearchAnchor] = useState()
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [searchValues, setSearchValues] = useState(false)
    const [inputValue, setInputValue] = useState('')
    const [showPopUP, setShowPopUP] = useState(false)
    const [task, setTask] = useState(null)
    const [searchParams, setSearchParams] = useSearchParams()
    const [filterBy, setFilterBy] = useState(boardService.getFilterFromSearchParams(searchParams))
    const [isFilterOpen, setIsFilterOpen] = useState(false)
    const [isSortOpen, setIsSortOpen] = useState(false)
    const [isPersonFilterOpen, setIsPersonFilterOpen] = useState(false)

    const inputRef = useRef(null)
    const filterBtnRef = useRef(null)
    const personBtnRef = useRef(null)
    const sortByRef = useRef(null)

    useEffect(() => {
        if (inputValue) {
            onSetHighLightedTxt(inputValue)
        }
        return () => onSetHighLightedTxt('')
    }, [inputValue])


    useEffect(() => {
        if (taskId && taskId !== task?.id && board) {
            setTaskForDetails(taskId, board)
        } else if (!taskId && task) {
            setTask(null)
        } else {
            setFilterBy(boardService.getFilterFromSearchParams(searchParams))
            onLoadBoard(boardId, taskId, filterBy)
        }

    }, [boardId, taskId])

    useEffect(() => {
        setSearchParams(cleanSearchParams(filterBy))
        onLoadBoard(boardId, null, filterBy)
    }, [filterBy])

    async function onLoadBoard(boardId, taskId, filterBy) {
        try {
            if (boardRemovedMsg) setBoardRemovedMsg('')

            await loadBoard(boardId, filterBy)

            if (taskId && board) setTaskForDetails(taskId, board)
            else if (task) setTask(null)

        } catch (err) {
            console.log(err)
            showErrorMsg('faild to laod board')
        }
    }

    function setTaskForDetails(taskId, board) {

        var foundTask = null

        for (const group of board.groups) {
            const task = group.tasks.find(task => task.id === taskId)
            if (task) {
                foundTask = task
                break
            }
        }

        if (foundTask) {
            setTask(foundTask)
        }
    }

    function onCloseTaskDetails() {
        navigate(`/board/${boardId}`)
    }

    function onCloseMenu() {
        console.log('variable')
        
        setSearchAnchor(false)
        setShowPopUP(false)
    }


    /// filter fncs
    function onSetFilterBy(filterBy) {
        setFilterBy(prevFilter => ({ ...prevFilter, ...filterBy }))
    }


    function toggleIsFilterOpen() {
        setIsFilterOpen(!isFilterOpen)
    }

    function onCloseFilter() {
        setIsFilterOpen(false)
    }

    const filterByNum = Object.values(filterBy).filter(arr => Array.isArray(arr) && arr.length > 0)?.length

    /// person

    function toggleIsPersonFilterOpen() {
        setIsPersonFilterOpen(!isPersonFilterOpen)
    }

    function onClosePersonFilter() {
        setIsPersonFilterOpen(false)
    }

    /// sort by

    function toggleIsSortOpen() {
        setIsSortOpen(!isSortOpen)
    }

    function onCloseSortBy() {
        setIsSortOpen(false)
    }

    //

    function handelChange(ev) {
        const titleToSearch = ev.target.value
        requestAnimationFrame(() => inputRef.current?.focus())
        setInputValue(titleToSearch)
        const regex = new RegExp(titleToSearch, 'i')
        const matchingGroups = board.groups
            .map(group => ({
                ...group,
                tasks: group.tasks.filter(task => regex.test(task.title))
            }))
            .filter(group => group.tasks.length > 0)

        // if (!!matchingGroups.length) 
        setSearchValues(matchingGroups)

        setAnchorEl(ev.currentTarget)
    }

    function onClearInput() {
        setInputValue('')
        setIsSearchOpen(false)
    }

    function onOpenSearchBar() {
        requestAnimationFrame(() => inputRef.current?.focus())
        setIsSearchOpen(true)
    }

    function _onShowPopUp() {
        const content = <InviteByMail />
        onSetPopUp(content)
    }

    function isSearching() {
        if (!inputValue) {
            onClearInput()
        }
    }

    // Groups

    async function onAddGroup() {
        try {
            await addGroup(board?._id)
            showSuccessMsg('group added to the board')
        } catch (err) {
            console.log(err)
            showErrorMsg('cannot add group')
        }
    }

    // task


    async function onAddTask(groupId, title, method) {
        try {
            await addTask(boardId, groupId, title, method)
            showSuccessMsg('task added to the board')
        } catch (err) {
            console.log(err)
            showErrorMsg('cannot add task')
        }
    }


    if (isAppLoading) return <AppLoader />
    if (boardRemovedMsg && !board) return <BoardRemovedMsg removedMsg={boardRemovedMsg} />

    const { byGroups, byNames, byStatuses, byPriorities, byMembers, byDueDateOp, byPerson, sortBy, dir } = filterBy
    const boardGroupsToShow = !!inputValue.length ? searchValues : board?.groups

    return (
        <section className="board-details">
            <div className="board-details-container" >

                <header className='board-details-header'>

                    <div className='action-nav'>

                        <div className='activity-log'>

                            <button className='activity-log btn'>
                                {<HoveredTextCmp
                                    label="Board Members"
                                    position="down"
                                    onClick={(ev) => setAnchorEl(ev.currentTarget)}
                                >
                                    <MultiMemberImage members={board?.members} className='multi-members-img' />
                                </HoveredTextCmp>}
                            </button>
                        </div>

                        <div className='invite-users'>
<<<<<<< HEAD
                            <button className='invite' onClick={_onShowPopUp}>
                                {` Invite / ${board?.members.length}`}
=======
                            <button className='invite' onClick={() => _onShowPopUp(true)}>
                                {` Invite / ${board?.members?.length}`}
>>>>>>> origin/main
                            </button>

                            <span className='copy-link'>

                                {<HoveredTextCmp
                                    label="Copy Link"
                                    position="down"
                                    onClick={(ev) => setAnchorEl(ev.currentTarget)}>

                                    <SvgIcon iconName='sink' className='icon' size={20} />

                                </HoveredTextCmp>}
                            </span>

                        </div>

                        <button className='more-btn'>
                            {<HoveredTextCmp
                                label="Options"
                                position="down"
                                onClick={(ev) => setAnchorEl(ev.currentTarget)}>
                                <SvgIcon iconName='dots' size={24} />
                            </HoveredTextCmp>}
                        </button>
                    </div>

                    <div className='board-title'>{board?.title}</div>

                    <div className='board-nav'>
                        <div>Main Table</div>
                    </div>
                    <div className='board-actions'>

                        <button
                            onClick={() => onAddTask(board?.groups[0]?.id, `New ${board?.managingType}`, 'unshift')}
                            disabled={!board?.groups?.length}
                            className='blue add-btn'> New {board?.managingType}
                        </button>

                        <section className='board-action-btn'>

                            <div className={`search-btn btn ${isSearchOpen} ${!!inputValue.length ? 'hasValue' : ''}`} onClick={onOpenSearchBar}>
                                <span className="icon">
                                    <SvgIcon iconName='searchGlass' size={20} colorName='secondaryText' />
                                </span>


                                {!isSearchOpen ?
                                    <span className='txt'>Search</span>
                                    :

                                    <div className='open-search'>
                                        <input type="text"
                                            className='search-txt'
                                            placeholder='Search This Board'
                                            onChange={(ev) => handelChange(ev)}
                                            onBlur={isSearching}
                                            ref={inputRef}
                                            value={inputValue}
                                        />
                                        <section className="actions">
                                            <button
                                                className={`delete-btn hover-show up ${inputValue ? true : false}`}
                                                data-type={' Clear Search'}
                                                onClick={onClearInput}>
                                                <SvgIcon iconName='xMark' size={16} colorName='secondaryText' />
                                            </button>

                                            <button className='search-option-btn hover-show up' data-type={'Search Options'} >
                                                <SvgIcon iconName='searchOptions' size={16} colorName='secondaryText' />
                                            </button>
                                        </section>
                                    </div>
                                }

                            </div>

                            <button
                                className={`person-btn hover-show up ${isPersonFilterOpen || byPerson ? "active" : ""}`}
                                data-type='Filter board by Person'
                                ref={personBtnRef} onClick={toggleIsPersonFilterOpen}
                            >
                                {byPerson
                                    ? <img src={board?.members?.find(m => m._id === byPerson)?.imgUrl || ''}
                                        alt="selected person" className='selected-person' />
                                    : <span className="icon">
                                        <SvgIcon iconName='person' size={20} colorName={`secondaryText`} />
                                    </span>
                                }
                                <span className='txt'>Person</span>
                                {byPerson &&
                                    <div onClick={(ev) => {
                                        ev.stopPropagation(),
                                            onSetFilterBy({ byPerson: '' }),
                                            onClosePersonFilter()
                                    }}>
                                        <SvgIcon
                                            iconName='xMark' size={12}
                                            colorName={`currentColor`}
                                            className='mini-x' />
                                    </div>
                                }
                            </button>

                            <button className={`filter-btn hover-show up ${isFilterOpen || filterByNum > 0 ? "active" : ""}`}
                                data-type={'filter board by Anything'}
                                ref={filterBtnRef} onClick={toggleIsFilterOpen}
                            >
                                <span className="icon">
                                    <SvgIcon iconName='filter' size={20} colorName='secondaryText' />
                                </span>
                                <span className='txt'>Filter {filterByNum ? `/ ${filterByNum}` : ""}</span>
                            </button>

                            <button
                                className={`sort-btn hover-show up ${isSortOpen || sortBy ? "active" : ""}`}
                                data-type={'Sort board by Any Column'}
                                ref={sortByRef} onClick={toggleIsSortOpen}
                            >
                                <span className="icon">
                                    <SvgIcon iconName='sortArrows' size={20} colorName='secondaryText' />
                                </span>
                                <span className='txt'>Sort {sortBy ? ' / 1' : ""}</span>
                            </button>


                        </section>
                    </div>

                </header>
                {boardGroupsToShow?.length > 0
                    ? < GroupList
                        groups={boardGroupsToShow}
                        managingType={board?.managingType}
                    />
                    : <div className='no-results-msg'>
                        <img src={noResults} alt="no-results" />
                        <div className="no-results-title">No results were found</div>
                    </div>
                }


                {board?.groups?.length > 0 &&
                    <button
                        onClick={() => onAddGroup(board?._id)}
                        className='add-group flex'>
                        <SvgIcon iconName="plus" size={20} />
                        <span>Add new group</span>
                    </button>}

            </div>


            <div className={`task-details-wrapper ${task ? "open" : ""}`}>
                {task && <TaskDetails
                    task={task}
                    onCloseTaskDetails={onCloseTaskDetails}
                />}
            </div>


            {board && isPersonFilterOpen && <FloatingContainerCmp
                anchorEl={personBtnRef.current}
                onClose={onClosePersonFilter}
            >
                <PersonFilter
                    members={board?.members}
                    filterBy={{ byPerson }}
                    onSetFilterBy={onSetFilterBy}
                />

            </FloatingContainerCmp>}

            {board && isFilterOpen && <FloatingContainerCmp
                anchorEl={filterBtnRef.current}
                onClose={onCloseFilter}
            >
                <FilterBy
                    board={board}
                    filterOptions={filterOptions}
                    filterBy={{ byGroups, byNames, byStatuses, byPriorities, byMembers, byDueDateOp }}
                    onSetFilterBy={onSetFilterBy}
                />

            </FloatingContainerCmp>}



            {board?.cmpOrder && isSortOpen && <FloatingContainerCmp
                anchorEl={sortByRef.current}
                onClose={onCloseSortBy}
            >
                <SortBy
                    sortOptions={board?.cmpOrder}
                    sortByData={{ sortBy, dir }}
                    onSetFilterBy={onSetFilterBy}
                />

            </FloatingContainerCmp>}

        </section>
    )
}
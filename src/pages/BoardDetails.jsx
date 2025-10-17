
import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useSelector } from 'react-redux'

// services
import { boardService } from '../services/board/index.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
import { addGroup, loadBoard, setBoardRemovedMsg } from '../store/actions/board.actions.js'
import { onSetHighLightedTxt } from '../store/actions/system.actions.js'

// cmps
import { SvgIcon } from '../cmps/SvgIcon.jsx'
import { BoardRemovedMsg } from '../cmps/Board/BoardRemovedMsg.jsx'
import { AppLoader } from '../cmps/AppLoader.jsx'
import { BoardDetailsHeader } from '../cmps/Board/BoardDetailsHeader.jsx'
import { cleanSearchParams } from '../services/util.service.js'
import { GroupList } from '../cmps/group/GroupList.jsx'
import { TaskDetails } from '../cmps/Task/TaskDetails.jsx'

// img
import noResults from '/img/no-results.svg'


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

    const inputRef = useRef(null)

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

    // search fncs

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

    function isSearching() {
        if (!inputValue) {
            onClearInput()
        }
    }

    // Groups funcs

    async function onAddGroup() {
        try {
            await addGroup(board?._id)
            showSuccessMsg('group added to the board')
        } catch (err) {
            console.log(err)
            showErrorMsg('cannot add group')
        }
    }



    if (isAppLoading) return <AppLoader />
    if (boardRemovedMsg && !board) return <BoardRemovedMsg removedMsg={boardRemovedMsg} />

    const boardGroupsToShow = !!inputValue.length ? searchValues : board?.groups

    return (
        <section className="board-details">
            <div className="board-details-container" >

                <BoardDetailsHeader
                    board={board}
                    onOpenSearchBar={onOpenSearchBar}
                    handelChange={handelChange}
                    inputValue={inputValue}
                    isSearchOpen={isSearchOpen}
                    onClearInput={onClearInput}
                    inputRef={inputRef}
                    isSearching={isSearching}
                    filterBy={filterBy}
                    filterOptions={filterOptions}
                    onSetFilterBy={onSetFilterBy}
                />

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


                {board?.groups?.length > 0 && boardGroupsToShow?.length > 0 &&
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

        </section>
    )
}
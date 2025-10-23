
import { useEffect, useRef, useState } from 'react'
import { Outlet, useNavigate, useParams, useSearchParams } from 'react-router-dom'
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


// img
import noResults from '/img/no-results.svg'


export function BoardDetails() {
    const [anchorEl, setAnchorEl] = useState(false)
    const navigate = useNavigate()

    const { boardId } = useParams()

    const isAppLoading = useSelector(state => state.systemModule.isAppLoading)
    const board = useSelector(storeState => storeState.boardModule.board)
    const filterOptions = useSelector(storeState => storeState.boardModule.filterOptions)
    const boardRemovedMsg = useSelector(storeState => storeState.boardModule.boardRemovedMsg)

    const [searchAnchor, setSearchAnchor] = useState()
    const [showPopUP, setShowPopUP] = useState(false)

    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [searchValues, setSearchValues] = useState(false)
    const [inputValue, setInputValue] = useState('')

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
        setFilterBy(boardService.getFilterFromSearchParams(searchParams))
        onLoadBoard(boardId, filterBy)
    }, [boardId])


    useEffect(() => {
        setSearchParams(cleanSearchParams(filterBy))
        onLoadBoard(boardId, filterBy)
    }, [filterBy])


    async function onLoadBoard(boardId, filterBy) {
        try {
            if (boardRemovedMsg) setBoardRemovedMsg('')
            await loadBoard(boardId, filterBy)
        } catch (err) {
            console.log(err)
            showErrorMsg('faild to laod board')
        }
    }


    function onCloseMenu() {
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

    /// group header box shadow on scroll

    const boardContiner = useRef(null)

    useEffect(() => {
        if (isAppLoading) return
        const container = boardContiner.current
        if (!container) return

        const headers = container.querySelectorAll('.group-header')
        if (!headers.length) return

        const onScroll = () => {
            const containerRect = container.getBoundingClientRect()
            const scrollTop = container.scrollTop

            headers.forEach((header, idx) => {
                const rect = header.getBoundingClientRect()
                const isSticky = rect.top - containerRect.top <= 148

                if (scrollTop === 0) {
                    header.classList.remove('sticky-active')
                } else {
                    const firstHeaderRect = headers[0].getBoundingClientRect()
                    const firstIsSticky = firstHeaderRect.top - containerRect.top <= 148
                    header.classList.toggle('sticky-active', isSticky && firstIsSticky)
                }
            })
        }

        container.addEventListener('scroll', onScroll)

        return (() => {
            container.removeEventListener('scroll', onScroll)
        })
    }, [board, isAppLoading])


    if (isAppLoading) return <AppLoader />
    if (boardRemovedMsg && !board) return <BoardRemovedMsg removedMsg={boardRemovedMsg} />

    const boardGroupsToShow = !!inputValue.length ? searchValues : board?.groups

    return (
        <section className="board-details">
            <div className="board-details-container" ref={boardContiner}>

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
                        className='btn-shrink-wrapper'
                        onClick={() => onAddGroup(board?._id)}>
                        <div className='btn add-group shrink flex'>
                            <SvgIcon iconName="plus" size={20} />
                            <span>Add new group</span>
                        </div>
                    </button>}
            </div>

            <div className='task-details-wrapper'>
                <Outlet />
            </div>


        </section>
    )
}
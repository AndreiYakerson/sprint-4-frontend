import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

// services
import { loadBoards, updateBoard, removeBoard, setIsBoardEditorOpen } from '../store/actions/board.actions'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
import { boardService } from '../services/board'

// cmps
import { BoardList } from '../cmps/Board/BoardList'
import { SvgIcon } from '../cmps/SvgIcon'
import { AppLoader } from '../cmps/AppLoader'
import { userService } from '../services/user'


export function BoardIndex({ setIsSideBarOpen }) {

    const isAppLoading = useSelector(state => state.systemModule.isAppLoading)
    const boards = useSelector(storeState => storeState.boardModule.boards)

    const [filterBy, setFilterBy] = useState(boardService.getDefaultFilter())
    const [isCollapse, setIsCollapse] = useState(false)
    const user = userService.getLoggedinUser()

    useEffect(() => {
        loadBoards(filterBy)
    }, [filterBy])

    async function onRemoveBoard(boardId) {
        try {
            await removeBoard(boardId)
            showSuccessMsg('Board removed')
        } catch (err) {
            showErrorMsg('Cannot remove board')
        }
    }

    async function onUpdateBoard(board, valsToUpdate) {

        const boardToSave = { ...structuredClone(board), ...valsToUpdate }

        try {
            const savedBoard = await updateBoard(boardToSave)
            showSuccessMsg(`Board ${savedBoard.title} updated`)
        } catch (err) {
            showErrorMsg('Cannot update board')
            throw err;
        }
    }

    function toggleIsCollapse() {
        setIsCollapse(!isCollapse)
    }

    if (isAppLoading) return <AppLoader />
    return (
        <section className="board-index">
            <header className='board-index-header'>
                <div className="welcome-notice">
                    <span className='morning'>Good morning, {<span className="user-name">{user?.fullname}</span>}!</span>
                    <span className='text'>Quickly access your recent boards, Inbox and workspaces</span>
                </div>
                {/* <button className='blue' onClick={() => setIsBoardEditorOpen(true)}>Add New Board</button> */}
            </header>
            {/* <BoardFilter filterBy={filterBy} setFilterBy={setFilterBy} /> */}

            <div className='board-list-container'>
                <div className='board-list-title flex'>

                    <div className='board-list-collapse-toggle'
                        onClick={toggleIsCollapse}
                    >
                        <SvgIcon
                            iconName={isCollapse ? 'chevronRight' : 'chevronDown'}
                            size={24}
                            colorName={'currentColor'}
                        />
                    </div>

                    <span>Recently visited</span>
                </div>

                {!isCollapse && <BoardList
                    boards={boards}
                    onRemoveBoard={onRemoveBoard}
                    onUpdateBoard={onUpdateBoard}
                />}
            </div>


        </section>
    )
}
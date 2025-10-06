// import { userService } from '../services/user'
import { Link, useLocation, useNavigate } from 'react-router-dom'

// cmps
import { BoardPreview } from './BoardPreview'

export function BoardList({ boards, onRemoveBoard, onUpdateBoard, isSideBarDispaly = false }) {
    const navigate = useNavigate()

    const location = useLocation()
    // function shouldShowActionBtns(board) {
    //     const user = userService.getLoggedinUser()

    //     if (!user) return false
    //     if (user.isAdmin) return true
    //     return board.owner?._id === user._id
    // }


    function onNavigateToBoard(boardId) {
        navigate(`/board/${boardId}`)
    }

    function onUpdateTitle(board) {
        const title = prompt('New title?', board.title).trim() || ''
        if (title === '' || title === board.title) return

        onUpdateBoard(board, { title: title })
    }


    return <ul className={`board-list ${isSideBarDispaly ? "side-bar-dispaly" : ""}`}>
        {boards.map(board => {
            return <li key={board._id}
                className={`board-item ${location.pathname.includes(board._id) ? "active" : ""}`}
                onClick={() => onNavigateToBoard(board?._id)}
            >
                <BoardPreview board={board} isSideBarDispaly={isSideBarDispaly} onUpdateBoard={onUpdateBoard} />
                <div className='board-actions flex' onClick={(ev) => ev.stopPropagation()}>
                    <button onClick={() => onRemoveBoard(board._id)}>Remove</button>
                    <button onClick={() => onUpdateTitle(board)}>Update</button>
                    <Link to={`/board/${board._id}`} className='btn'>Details</Link>
                </div>
            </li>
        })
        }
    </ul>
}
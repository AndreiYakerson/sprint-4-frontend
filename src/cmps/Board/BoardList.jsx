// import { userService } from '../services/user'
import { Link, useLocation, useNavigate } from 'react-router-dom'

// cmps
import { BoardPreview } from './BoardPreview'
import { setBoard } from '../../store/actions/board.actions'
import { boardService } from '../../services/board'

export function BoardList({ boards, isSideBarDisplay = false }) {
    const navigate = useNavigate()
    

    const location = useLocation()
    // function shouldShowActionBtns(board) {
    //     const user = userService.getLoggedinUser()

    //     if (!user) return false
    //     if (user.isAdmin) return true
    //     return board.owner?._id === user._id
    // }


    async function onNavigateToBoard(boardId) {
        // Set Board To Store
        try {
            const board = await boardService.getById(boardId)
            setBoard(board)
        } catch (error) {
            console.log('cant set board to store')
            
        }
        navigate(`/board/${boardId}`)
    }


    return <ul className={`board-list ${isSideBarDisplay ? "side-bar-dispaly" : ""}`}>
        {boards.map(board => {
            return <li key={board._id}
                className={`board-item ${location.pathname.includes(board._id) ? "active" : ""}`}
                onClick={() => onNavigateToBoard(board?._id)}
            >
                <BoardPreview board={board} isSideBarDisplay={isSideBarDisplay} />
            </li>
        })
        }
    </ul>
}
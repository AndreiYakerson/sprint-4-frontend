// import { userService } from '../services/user'
import { Link, useLocation } from 'react-router-dom'

// cmps
import { BoardPreview } from './BoardPreview'

export function BoardList({ boards, onRemoveBoard, onUpdateBoard, isSideBarDispaly = false }) {
    const location = useLocation()

    // function shouldShowActionBtns(board) {
    //     const user = userService.getLoggedinUser()

    //     if (!user) return false
    //     if (user.isAdmin) return true
    //     return board.owner?._id === user._id
    // }



    return <section>
        <ul className={`board-list ${isSideBarDispaly ? "side-bar-dispaly" : ""}`}>
            {boards.map(board => {
                return <li key={board._id} className={`board-item ${location.pathname.includes(board._id) ? "active" : ""}`}>
                    <BoardPreview board={board} />
                    <div className='board-actions flex '>
                        <button onClick={() => onRemoveBoard(board._id)}>Remove</button>
                        <button onClick={() => onUpdateBoard(board)}>Update</button>
                        <Link to={`/board/${board._id}`} className='btn'>Details</Link>
                    </div>
                </li>
            })
            }
        </ul>
    </section>
}
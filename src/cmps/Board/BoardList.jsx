// import { userService } from '../services/user'
import { Link } from 'react-router-dom'
import { BoardPreview } from './BoardPreview'

export function BoardList({ boards, onRemoveBoard, onUpdateBoard }) {

    // function shouldShowActionBtns(board) {
    //     const user = userService.getLoggedinUser()

    //     if (!user) return false
    //     if (user.isAdmin) return true
    //     return board.owner?._id === user._id
    // }

    return <section>
        <ul className="board-list">
            {boards.map(board =>
                <li key={board._id} className='board-item'>
                    <BoardPreview board={board} />
                    <div className='board-actions'>
                        <button onClick={() => onRemoveBoard(board._id)}>Remove</button>
                        <button onClick={() => onUpdateBoard(board)}>Update</button>
                        <Link to={`/board/${board._id}`} className='btn'>Details</Link>
                    </div>
                </li>)
            }
        </ul>
    </section>
}
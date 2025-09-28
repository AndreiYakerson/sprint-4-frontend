import { Link } from 'react-router-dom'

export function BoardPreview({ board }) {

    return(
    <article className="board-preview">
            <img src="https://res.cloudinary.com/dsxi4o2gb/image/upload/v1759048092/Screenshot_2025-09-28_112323_epn5b0.png" alt="Board Image" className='board-img' />
        <header>
            <Link to={`/board/${board._id}`}>{board.title}</Link>
        </header>
    </article>)
}
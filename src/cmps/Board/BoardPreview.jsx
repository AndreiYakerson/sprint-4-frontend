import { Link } from 'react-router-dom'

// images
import boardIcon from '/icons/board.svg'
import boardItemLogo from '/img/board-item-img.svg'

export function BoardPreview({ board }) {

    return (
        <article className="board-preview">
            <img
                src={boardItemLogo}
                alt="Board Image" className='board-img' />
            <header>
                <Link to={`/board/${board._id}`} className='board-title'>
                    <img className='icon big' src={boardIcon} alt="logo" />
                    <span>{board.title}</span>
                </Link>
            </header>
        </article>)
}
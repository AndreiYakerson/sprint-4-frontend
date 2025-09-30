import { Link } from 'react-router-dom'
import { HoveredTextCmp } from '../HoveredTextCmp.jsx'
// images
import boardIcon from '/icons/board.svg'
import dashboard from '/icons/dashboard.svg'
import starFull from '/icons/star-full.svg'
import star from '/icons/star.svg'
import boardItemLogo from '/img/board-item-img.svg'
import { useState } from 'react'
import { LongTxt } from '../LongText/LongText.jsx'

export function BoardPreview({ board }) {
    const [anchorEl, setAnchorEl] = useState(null)

    return (
        <article className="board-preview">
            <img
                src={boardItemLogo}
                alt="Board Image" className='board-img' />

            <header>
                <Link to={`/board/${board._id}`} className='board-title'>
                    <div className='board-info-items flex'>
                        <HoveredTextCmp
                            size='big'
                         
                            position="down"
                            label="Dash Board"
                        >
                         <img src={boardIcon} />   
                        </HoveredTextCmp>
                        <span className='hover-show' data-type="Board Title"><LongTxt txt={board.title}/></span>
                        <span >
                            <HoveredTextCmp
                                size='big'
                                position="down"
                                label={'logo'}
                            
                            >
                                 <img src={starFull} />
                            </HoveredTextCmp>
                        </span>
                    </div>
                </Link>
            </header>
        </article>)
}


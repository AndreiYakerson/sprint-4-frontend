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
import { SvgIcon } from '../SvgIcon.jsx'

export function BoardPreview({ board, isSideBarDispaly }) {
    const [anchorEl, setAnchorEl] = useState(null)

    //Demo Pre For Stared Logic
    const isStarred = false

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
                            position="up"
                            label="Dash Board"
                        >
                            <SvgIcon iconName="board" size={isSideBarDispaly ? 16 : 22} colorName={isSideBarDispaly ? "currentColor" : ''} />
                        </HoveredTextCmp>
                        <span className='hover-show' data-type="Board Title"><LongTxt txt={board.title} /></span>
                        <span >
                            <HoveredTextCmp
                                size='big'
                                position="up"
                                label={'logo'}
                            >
                                <SvgIcon iconName="star" size={isSideBarDispaly ? 16 : 22} colorName={isSideBarDispaly ? "currentColor" : ''} />
                            </HoveredTextCmp>
                        </span>
                    </div>
                </Link>
            </header>
        </article>)
}


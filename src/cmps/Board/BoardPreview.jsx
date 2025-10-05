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
            <div className='board-img-wrapper'>
                <img
                    src={boardItemLogo}
                    alt="Board Image" className='board-img' />
            </div>

            <div className='board-info-items'>
                <HoveredTextCmp
                    size='big'
                    position="up"
                    label="Dash Board"
                >
                    <SvgIcon iconName="board" size={isSideBarDispaly ? 16 : 22} colorName={isSideBarDispaly ? "currentColor" : ''} />
                </HoveredTextCmp>

                {/* <span className='hover-show' data-type="Board Title"> </span> */}

                {/* <LongTxt txt={board.title} className='board-title' /> */}

                <div className='board-title'>{board.title}</div>

                <span >
                    <HoveredTextCmp
                        size='big'
                        position="up"
                        label={'logo'}
                    >
                        <SvgIcon iconName="starFull" size={isSideBarDispaly ? 16 : 22} colorName={isSideBarDispaly ? "starColor" : 'starColor'} />
                    </HoveredTextCmp>
                </span>
            </div>

        </article>)
}


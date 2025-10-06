import { useEffect, useState } from 'react'
// cmps
import { HoveredTextCmp } from '../HoveredTextCmp.jsx'
import { SvgIcon } from '../SvgIcon.jsx'

// images
import boardItemLogo from '/img/board-item-img.svg'

export function BoardPreview({ board, isSideBarDispaly, onUpdateBoard }) {
    // const [anchorEl, setAnchorEl] = useState(null)

    const [isStarred, setIsStarred] = useState(board?.isStarred)



    async function toggleIsStarred(isStarred) {
        setIsStarred(isStarred)

        try {
            await onUpdateBoard(board, { isStarred: isStarred })
        } catch (err) {
            setIsStarred(board?.isStarred)
        }

    }



    return (
        <article className="board-preview">

            <div className='board-img-wrapper'>
                <img
                    src={boardItemLogo}
                    alt="Board Image" className='board-img' />
            </div>

            <div className='board-info-items'>
                <HoveredTextCmp
                    position="up"
                    label="Dash Board"
                >
                    <SvgIcon iconName="board" size={isSideBarDispaly ? 16 : 22} colorName={isSideBarDispaly ? "currentColor" : ''} />
                </HoveredTextCmp>

                <div className='board-title'>{board.title}</div>

                {isSideBarDispaly
                    ? <button className='dost-btn transparent' onClick={(ev) => ev.stopPropagation()}>
                        <SvgIcon iconName="dots" size={16} colorName="currentColor" />

                    </button>

                    : <button className='white square' onClick={(ev) => { ev.stopPropagation(), toggleIsStarred(!isStarred) }}>
                        <SvgIcon iconName={isStarred ? 'starFull' : 'star'}
                            size={22}
                            colorName={isStarred ? "starColor" : 'secondaryText'}
                        />
                    </button>
                }


            </div>

        </article>)
}


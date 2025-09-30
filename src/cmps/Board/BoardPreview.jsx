import { Link } from 'react-router-dom';
import { HoveredTextCmp } from '../HoveredTextCmp.jsx';
// images as src if you keep as image
import boardIcon from '/icons/board.svg';
import star from '/icons/star.svg';
import boardItemLogo from '/img/board-item-img.svg';
// SVG as React component import for easy styling
import { ReactComponent as StarFull } from '../../assets/icons/star-full.svg';
import { useState } from 'react';
import { LongTxt } from '../LongText/LongTxt.jsx';

export function BoardPreview({ board }) {
    const [anchorEl, setAnchorEl] = useState(null);

    return (
        <article className="board-preview">
            <img src={boardItemLogo} alt="Board Image" className='board-img' />

            <header>
                <Link to={`/board/${board._id}`} className='board-title'>
                    <div className='board-info-items'>
                        {/* Use HoveredTextCmp for image icons */}
                        <HoveredTextCmp
                            size='big'
                            src={boardIcon}
                            position="down"
                            label="Board"
                        />
                        <LongTxt txt={board.title} />
                        {/* Use StarFull React component directly */}
                        <StarFull className="icon" />
                        <span>
                            <HoveredTextCmp
                                size='big'
                                src={star}
                                position="down"
                                label='logo test'
                            />
                        </span>
                    </div>
                </Link>
            </header>
        </article>
    );
}

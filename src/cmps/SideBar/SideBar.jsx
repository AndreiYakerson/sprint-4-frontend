import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";

// services
import { loadBoards, setIsBoardEditorOpen } from "../../store/actions/board.actions.js";
import { onSetIsSideBarOpen } from "../../store/actions/system.actions.js";

// cmps
import { BoardList } from "../Board/BoardList.jsx";
import { HoveredTextCmp } from "../HoveredTextCmp.jsx";
import { SvgIcon } from "../SvgIcon.jsx";

import { PopUp } from "../PopUp.jsx";
import { BoardEdit } from "../Board/BaordEdit.jsx";

//images
import favStarIcon from '/img/fav-star-icon.svg'

export function SideBar() {

    const isSideBarOpen = useSelector(state => state.systemModule.isSideBarOpen)
    const boards = useSelector(storeState => storeState.boardModule.boards)
    const [isFavoritesTabOpen, setIsFavoritesTabOpen] = useState(false)
    const [anchorEl, setAnchorEl] = useState(null)

    useEffect(() => {
        loadBoards()
    }, [])

    function toggleIsFavoritesTabOpen() {
        setIsFavoritesTabOpen(!isFavoritesTabOpen)
    }


    const favoritesBoards = boards.filter(b => b.isStarred)

    return (
        <div className={`side-bar ${isSideBarOpen ? "is-open" : "close"}`}
            onClick={() => { !isSideBarOpen ? onSetIsSideBarOpen(true) : '' }}
        >

            <button className={`icon close-btn ${isSideBarOpen}`} onClick={() => onSetIsSideBarOpen(!isSideBarOpen)}>
                <HoveredTextCmp
                    label={isSideBarOpen ? 'Close Navigation' : 'Open Navigation'}
                    position={'down'}
                >
                    <SvgIcon iconName={isSideBarOpen ? 'chevronLeft' : 'chevronRight'} size={16} />
                </HoveredTextCmp>
            </button>

            <div className="side-bar-content">

                <nav className="side-nav-list">
                    <NavLink to="/board" end><HoveredTextCmp><SvgIcon iconName="home" size={16} colorName="currentColor" /></HoveredTextCmp>Home</NavLink>
                </nav>

                <div className="scrollable-content">

                    <div className="favorites-tab-container">
                        <div className="favorites-tab flex align-center"
                            onClick={toggleIsFavoritesTabOpen}>
                            <span>Favorites</span>
                            <SvgIcon
                                iconName={isFavoritesTabOpen ? 'chevronDown' : 'chevronRight'}
                                size={12}
                                colorName={'currentColor'}
                            />
                        </div>
                    </div>
                    <div className={`favorites-boards ${isFavoritesTabOpen ? "open" : ''}`}>
                        {favoritesBoards?.length > 0
                            ? <BoardList boards={favoritesBoards} isSideBarDispaly={true} />

                            : <div>
                                <div className="no-fav-board-msg">
                                    <img src={favStarIcon} alt="fav star" className="fave-star-icon" />
                                    <span className="m-t">No favorites yet</span>
                                    <span className="m-p">Add your boards, docs, or dashboards for a quick access.</span>
                                </div>
                            </div>
                        }
                    </div>


                    <div className="boards-title-tab flex align-center ">
                        <span className="boards-title">Boards</span>
                        <button className="blue square" onClick={() => setIsBoardEditorOpen(true)}>
                            <SvgIcon iconName="plus" size={20} colorName="whiteText" />
                        </button>
                    </div>

                    <BoardList boards={boards} isSideBarDispaly={true} />
                </div>
            </div>

            <PopUp showCloseBtn={true}>
                <BoardEdit />
            </PopUp>
        </div>
    )
}
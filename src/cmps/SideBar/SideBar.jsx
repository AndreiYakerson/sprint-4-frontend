import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";

// services
import { loadBoards, setIsBoardEditorOpen } from "../../store/actions/board.actions.js";
import { onSetIsApploading, onSetIsSideBarOpen, onSetPopUpIsOpen } from "../../store/actions/system.actions.js";

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
    const isAppLoading = useSelector(state => state.systemModule.isAppLoading)
    const boards = useSelector(storeState => storeState.boardModule.boards)

    const [isFavoritesTabOpen, setIsFavoritesTabOpen] = useState(false)
    const [showPopUP, setShowPopUP] = useState(false)
    const [anchorEl, setAnchorEl] = useState(null)

    useEffect(() => {
        onLoadBoards()
    }, [])

    async function onLoadBoards() {
        if (!boards?.length) {
            onSetIsApploading(true)
        }
        try {
            await loadBoards()
        } catch (err) {
            console.log('err:', err)
        } finally {
            setTimeout(() =>
                onSetIsApploading(false)
                , 1000)
        }
    }

    function toggleIsFavoritesTabOpen() {
        setIsFavoritesTabOpen(!isFavoritesTabOpen)
    }
    function _onShowPopUp(value) {
        setShowPopUP(value)
        onSetPopUpIsOpen(value)
    }

    const favoritesBoards = boards.filter(b => b.isStarred)

    return (
        <div className={`side-bar ${isSideBarOpen ? "is-open" : "close"} ${isAppLoading ? "app-loading" : ""}`}
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
                    <NavLink to="/board" end>
                        <HoveredTextCmp>
                            <SvgIcon iconName="home" size={16} colorName="currentColor" />
                        </HoveredTextCmp>Home
                    </NavLink>

                    <NavLink to="/" end style={{ cursor: 'default' }}
                        onClick={(ev) => ev.preventDefault()}>
                        <HoveredTextCmp>
                            <SvgIcon iconName="myWork" size={16} colorName="currentColor" />
                        </HoveredTextCmp>My work
                    </NavLink>

                    <NavLink to="/" end style={{ cursor: 'default' }}
                        onClick={(ev) => ev.preventDefault()}>
                        <HoveredTextCmp>
                            <SvgIcon iconName="more" size={16} colorName="currentColor" />
                        </HoveredTextCmp>More
                    </NavLink>                </nav>

                <div className="scrollable-content">

                    <div className="favorites-tab-container">
                        <div className="favorites-tab small-nav-tab flex align-center"
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
                            ? <div>
                                <BoardList boards={favoritesBoards} isSideBarDisplay={true} />
                            </div>

                            : <div>
                                <div className="no-fav-board-msg">
                                    <img src={favStarIcon} alt="fav star" className="fave-star-icon" />
                                    <span className="m-t">No favorites yet</span>
                                    <span className="m-p">Add your boards, docs, or dashboards for a quick access.</span>
                                </div>
                            </div>
                        }
                    </div>


                    <div className="boards-title-tab">
                        <div className="small-nav-tab flex align-center justify-between">
                            <span> Workspaces</span>
                            <div className="Workspaces-tab-btns">
                                <button className={`transparent board-menu-btn`}>
                                    <SvgIcon iconName="dots" size={16} colorName="secondaryText" />
                                </button>
                                <button className={`transparent board-menu-btn`}  >
                                    <SvgIcon iconName="searchGlass" size={16} colorName="secondaryText" />
                                </button>
                            </div>
                        </div>
                        <div className="flex align-center">
                            <span className="boards-title">Boards</span>
                            <button className="blue square" onClick={() => _onShowPopUp(true)}>
                                <SvgIcon iconName="plus" size={18} colorName="whiteText" />
                            </button>
                        </div>
                    </div>

                    <BoardList boards={boards} isSideBarDisplay={true} />
                </div>
            </div>

            {showPopUP &&
                <PopUp onClose={() => setShowPopUP(false)}>
                    <BoardEdit />
                </PopUp>}
        </div>
    )
}
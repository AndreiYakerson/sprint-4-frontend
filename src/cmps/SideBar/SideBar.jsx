import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { BoardList } from "../Board/BoardList.jsx";
import { loadBoards, onSetIsSideBarOpen } from "../../store/actions/board.actions.js";
import { HoveredTextCmp } from "../HoveredTextCmp.jsx";

// icons 
import homeIcon from '/icons/home.svg'
import myWork from '/icons/my-work.svg'
import chevronRight from '/icons/chevron-right.svg'
import chevronLeft from '/icons/chevron-left.svg'
import chevronDown from '/icons/chevron-down.svg'

export function SideBar() {

    const isSideBarOpen = useSelector(state => state.boardModule.isSideBarOpen)
    const boards = useSelector(storeState => storeState.boardModule.boards)
    const [anchorEl, setAnchorEl] = useState(null)


    useEffect(() => {
        loadBoards()
    }, [])


    return (
        <div className={`side-bar ${isSideBarOpen}`}>
            <button className={`icon close-btn ${isSideBarOpen}`}>
                <HoveredTextCmp
                    label={isSideBarOpen ? 'Close Navigation' : 'Open Navigation'}
                    position={'down'}
                    onClick={() => onSetIsSideBarOpen(!isSideBarOpen)}
                >
                    <img src={isSideBarOpen ? chevronLeft : chevronRight} alt="" />
                </HoveredTextCmp>
            </button>
            <div className="side-bar-content">
                <nav className="side-nav-list">
                    <NavLink to=""><HoveredTextCmp src={homeIcon} />Home</NavLink>
                    <NavLink to=""><HoveredTextCmp src={myWork} />My Work</NavLink>
                </nav>
                {/* <div className="favorites flex">Favorites
                    {
                    isSideBarOpen ?  
                      <HoveredTextCmp src={chevronRight} label="chevron Right" position="" />  
                    : 
                      <HoveredTextCmp src={chevronDown} label="chevron Down" position="" />  
                    }
                    </div> */}

                <div>Boards</div>
                <BoardList boards={boards} isSideBarDispaly={true} />
            </div>
        </div>
    )
}
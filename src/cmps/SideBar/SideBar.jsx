import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";

// services
import { loadBoards } from "../../store/actions/board.actions.js";
import { onSetIsSideBarOpen } from "../../store/actions/system.actions.js";

// cmps
import { BoardList } from "../Board/BoardList.jsx";
import { HoveredTextCmp } from "../HoveredTextCmp.jsx";
import { SvgIcon } from "../SvgIcon.jsx";

// icons 
import homeIcon from '/icons/home.svg'
import myWork from '/icons/my-work.svg'
import chevronRight from '/icons/chevron-right.svg'
import chevronLeft from '/icons/chevron-left.svg'
import chevronDown from '/icons/chevron-down.svg'


export function SideBar() {

    const isSideBarOpen = useSelector(state => state.systemModule.isSideBarOpen)
    const boards = useSelector(storeState => storeState.boardModule.boards)
    const [anchorEl, setAnchorEl] = useState(null)


    useEffect(() => {
        loadBoards()
    }, [])


    return (
        <div className={`side-bar ${isSideBarOpen}`}>
            <button className={`icon close-btn ${isSideBarOpen}`} onClick={() => onSetIsSideBarOpen(!isSideBarOpen)}>
                <HoveredTextCmp
                    label={isSideBarOpen ? 'Close Navigation' : 'Open Navigation'}
                    position={'down'}
                >
                    {/* <img src={isSideBarOpen ? chevronLeft : chevronRight} alt="" /> */}
                    <SvgIcon iconName={isSideBarOpen ? 'chevronLeft' : 'chevronRight'} size={16} />
                </HoveredTextCmp>
            </button>
            <div className="side-bar-content">
                <nav className="side-nav-list">
                    <NavLink to=""><HoveredTextCmp><SvgIcon iconName="home" size={16} colorName="currentColor" /></HoveredTextCmp>Home</NavLink>
                    <NavLink to=""><HoveredTextCmp><SvgIcon iconName="myWork" size={16} colorName="currentColor" /></HoveredTextCmp>My Work</NavLink>
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
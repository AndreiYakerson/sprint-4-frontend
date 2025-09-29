import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { useEffect } from "react";

// services
import { loadBoards, onIsSideBarOpen } from "../../store/actions/board.actions.js";
// cmps
import { BoardList } from "../Board/BoardList.jsx";

// icons 
import homeIcon from '/icons/home.svg'
import myWork from '/icons/my-work.svg'
import chevronRight from '/icons/chevron-right.svg'
import chevronLeft from '/icons/chevron-left.svg'
import chevronDown from '/icons/chevron-down.svg'
import { IconCmp } from "../IconCmp.jsx";

export function SideBar() {

    const isSideBarOpen = useSelector(state => state.boardModule.isSideBarOpen)
    const user = useSelector(storeState => storeState.userModule.user)

    const boards = useSelector(storeState => storeState.boardModule.boards)

    useEffect(() => {
        loadBoards()
    }, [])


    return (
        <div className={`side-bar ${isSideBarOpen}`}>
            <button onClick={() => onIsSideBarOpen(!isSideBarOpen)} className={`close-btn ${isSideBarOpen}`}>

                <IconCmp src={isSideBarOpen ? chevronLeft : chevronRight} label={''} position={'down'} />
                {/* <img src= alt="chevron" className="icon" /> */}
            </button>
            <div className="side-bar-content">
                <nav className="side-nav-list">
                    <NavLink to=""><IconCmp src={homeIcon} />Home</NavLink>
                    <NavLink to=""><IconCmp src={myWork} />My work</NavLink>
                </nav>
                {/* <div className="favorites flex">Favorites
                    {
                    isSideBarOpen ?    
                    <IconCmp src={chevronRight}/>
                    : 
                    <IconCmp src={chevronDown}/>
                    }
                    </div> */}

                <div>Boards</div>

                <BoardList boards={boards} isSideBarDispaly={true} />
            </div>
        </div>
    )
}
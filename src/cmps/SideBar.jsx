import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { useEffect } from "react";

// services
import { loadBoards, onIsSideBarOpen } from "../store/actions/board.actions.js";
// cmps
import { BoardList } from "./Board/BoardList.jsx";

// icons 
import homeIcon from '../../public/img/icons/home.svg'
import myWork from '../../public/img/icons/my-work.svg'
import chevronRight from '../../public/img/icons/chevron-right.svg'
import chevronLeft from '../../public/img/icons/chevron-left.svg'
import chevronDown from '../../public/img/icons/chevron-down.svg'

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
                <img src={isSideBarOpen ? chevronLeft : chevronRight} alt="chevron" className="icon" />
            </button>
            <div className="side-bar-content">
                <nav className="side-nav-list">
                    <NavLink to=""><img className='icon' src={homeIcon} alt="logo" />Home</NavLink>
                    <NavLink to="board"><img className='icon' src={myWork} alt="logo" />My work</NavLink>
                </nav>
                {/* <div className="favorites flex">Favorites
                    {
                    isSideBarOpen ?    
                    <img className='icon' src={chevronRight} alt="logo" />
                    : 
                    <img className='icon' src={chevronDown} alt="logo" />
                    }
                    </div> */}

                <div>Boards</div>

                <BoardList boards={boards} isSideBarDispaly={true} />
            </div>
        </div>
    )
}
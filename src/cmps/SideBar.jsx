import { useSelector } from "react-redux";
import { boardService } from "../services/board/board.service.remote";
import { onIsSideBarOpen } from "../store/actions/board.actions";
import { NavLink } from "react-router-dom";
import homeIcon from '../../public/img/icons/home.svg'
import myWork from '../../public/img/icons/my-work.svg'
import chevronRight from '../../public/img/icons/chevron-right.svg'
import chevronDown from '../../public/img/icons/chevron-down.svg'
export function SideBar() {

    const isSideBarOpen = useSelector(state => state.boardModule.isSideBarOpen)
    const user = useSelector(storeState => storeState.userModule.user)

    return (
        <div className={`side-bar ${isSideBarOpen}`}>
            <button onClick={() => onIsSideBarOpen(!isSideBarOpen)} className={`close-btn ${isSideBarOpen}`}>{isSideBarOpen ? '<' : '>'}</button>
            <div className="side-bar-content">
                <nav className="side-nav-list">
                    <NavLink to=""><img className='icon' src={homeIcon} alt="logo" />Home</NavLink>
                    <NavLink to="board"><img className='icon' src={myWork} alt="logo" />My Work</NavLink>
                </nav>
                {/* <div className="favorites flex">Favorites
                    {
                    isSideBarOpen ?    
                    <img className='icon' src={chevronRight} alt="logo" />
                    : 
                    <img className='icon' src={chevronDown} alt="logo" />
                    }
                    </div> */}

            </div>
        </div>
    )
}